from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import random, string, smtplib, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import models, schemas, database

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY                  = os.environ.get("SECRET_KEY", "SUPER_SECRET_COMPLEX_PASSPHRASE_FOR_CAMPUS_MARKETPLACE_OSSD_Y9")
ALGORITHM                   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

# Brevo SMTP — works on Railway (Gmail port 465 is blocked on Railway free plan)
BREVO_USER = os.environ.get("BREVO_USER", "your@email.com")
BREVO_PASS = os.environ.get("BREVO_PASS", "your-brevo-smtp-key")

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Student Market Palace API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Pydantic Schemas for OTP ──────────────────────────────────────────────────
class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp:   str

class ResendOTPRequest(BaseModel):
    email: EmailStr

# ── Helpers ───────────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_from_header(authorization: Optional[str] = Header(None), db: Session = Depends(database.get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization token.")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload.")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid.")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(to_email: str, otp: str, name: str = "Student"):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = '🔐 Your Student Market Palace Verification Code'
    msg['From']    = BREVO_USER
    msg['To']      = to_email

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#0f0f1a;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7c3aed,#a855f7);padding:32px;text-align:center;">
        <div style="font-size:36px">🎓</div>
        <h1 style="color:white;margin:8px 0;font-size:22px;">Student Market Palace</h1>
        <p style="color:#e9d5ff;margin:0;font-size:14px;">Email Verification</p>
      </div>
      <div style="padding:32px;background:#1a1a2e;">
        <p style="color:#ccc;font-size:15px;">Hi <strong style="color:white;">{name}</strong>,</p>
        <p style="color:#ccc;font-size:15px;">Use this code to verify your email address:</p>
        <div style="background:#0f0f1a;border:2px dashed #7c3aed;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
          <span style="font-size:48px;font-weight:900;letter-spacing:14px;color:#a855f7;">{otp}</span>
        </div>
        <p style="color:#888;font-size:13px;text-align:center;">⏱ This code expires in <strong style="color:#ccc;">10 minutes</strong></p>
        <p style="color:#888;font-size:13px;text-align:center;">Do not share this code with anyone.</p>
      </div>
      <div style="background:#0f0f1a;padding:16px;text-align:center;border-top:1px solid #2a2a3e;">
        <p style="color:#555;font-size:12px;margin:0;">Student Market Palace — UMT Campus</p>
      </div>
    </div>
    """
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP('smtp-relay.brevo.com', 587) as smtp:
        smtp.starttls()
        smtp.login(BREVO_USER, BREVO_PASS)
        smtp.sendmail(BREVO_USER, to_email, msg.as_string())

# ── API ENDPOINTS ─────────────────────────────────────────────────────────────

# 1. Register — now sends OTP, does NOT create account yet
@app.post("/register", status_code=200)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing and existing.is_verified:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    # If unverified account exists, delete it and re-register
    if existing and not existing.is_verified:
        db.delete(existing)
        db.commit()

    hashed = hash_password(user.password)
    new_user = models.User(name=user.name, email=user.email, password=hashed, is_verified=False)
    db.add(new_user)

    # Generate OTP
    otp     = generate_otp()
    expires = datetime.utcnow() + timedelta(minutes=10)
    db.query(models.OTPCode).filter(models.OTPCode.email == user.email).delete()
    db.add(models.OTPCode(email=user.email, code=otp, expires_at=expires))
    db.commit()

    try:
        send_otp_email(user.email, otp, user.name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Account created but email failed: {str(e)}")

    return {"message": "OTP sent to your email. Please verify to complete registration."}

# 2. Verify OTP — creates the verified account
@app.post("/verify-otp", status_code=200)
def verify_otp(payload: OTPVerifyRequest, db: Session = Depends(database.get_db)):
    record = db.query(models.OTPCode).filter(
        models.OTPCode.email == payload.email,
        models.OTPCode.used  == False
    ).order_by(models.OTPCode.id.desc()).first()

    if not record:
        raise HTTPException(status_code=400, detail="OTP not found. Please register again.")
    if datetime.utcnow() > record.expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired. Please register again.")
    if record.code != payload.otp.strip():
        raise HTTPException(status_code=400, detail="Incorrect OTP. Please try again.")

    # Mark OTP used & verify user
    record.used = True
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_verified = True
    db.commit()

    # Return token so user is logged in immediately
    token = create_access_token({"sub": user.email})
    return {"message": "Email verified successfully!", "access_token": token, "token_type": "bearer", "user_id": user.user_id}

# 3. Resend OTP
@app.post("/resend-otp", status_code=200)
def resend_otp(payload: ResendOTPRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email.")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="This account is already verified.")

    otp     = generate_otp()
    expires = datetime.utcnow() + timedelta(minutes=10)
    db.query(models.OTPCode).filter(models.OTPCode.email == payload.email).delete()
    db.add(models.OTPCode(email=payload.email, code=otp, expires_at=expires))
    db.commit()

    try:
        send_otp_email(payload.email, otp, user.name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not send email: {str(e)}")

    return {"message": "New OTP sent to your email."}

# 4. Login — blocks unverified users
@app.post("/login", response_model=schemas.Token)
def login_user(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in.")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# 5. Search [Public]
@app.get("/products/search", response_model=List[schemas.ProductResponse])
def search_products(keyword: str, db: Session = Depends(database.get_db)):
    return db.query(models.Product).filter(
        (models.Product.title.ilike(f"%{keyword}%")) |
        (models.Product.description.ilike(f"%{keyword}%"))
    ).all()

# 6. Filter [Public]
@app.get("/products/filter", response_model=List[schemas.ProductResponse])
def filter_products(category: Optional[str] = None, status: Optional[str] = "available", db: Session = Depends(database.get_db)):
    query = db.query(models.Product)
    if category: query = query.filter(models.Product.category.ilike(category))
    if status:   query = query.filter(models.Product.status == status)
    return query.all()

# 7. Get All Products [Public]
@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    return db.query(models.Product).filter(models.Product.status == "available").offset(skip).limit(limit).all()

# 8. Get Product by ID [Public]
@app.get("/products/{id}", response_model=schemas.ProductResponse)
def get_product_by_id(id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.product_id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    seller = db.query(models.User).filter(models.User.user_id == product.user_id).first()
    product.seller_name  = seller.name  if seller else None
    product.seller_email = seller.email if seller else None
    return product

# 9. Create Product [Protected]
@app.post("/products", response_model=schemas.ProductResponse, status_code=201)
def create_product(product: schemas.ProductCreate, current_user: models.User = Depends(get_user_from_header), db: Session = Depends(database.get_db)):
    new_product = models.Product(**product.model_dump(), user_id=current_user.user_id)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# 10. Update Product [Protected]
@app.put("/products/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, updated_fields: schemas.ProductUpdate, current_user: models.User = Depends(get_user_from_header), db: Session = Depends(database.get_db)):
    product_query = db.query(models.Product).filter(models.Product.product_id == id)
    product = product_query.first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    if product.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized. You do not own this listing.")
    product_query.update(updated_fields.model_dump(exclude_unset=True), synchronize_session=False)
    db.commit()
    return product_query.first()

# 11. Delete Product [Protected]
@app.delete("/products/{id}", status_code=200)
def delete_product(id: int, current_user: models.User = Depends(get_user_from_header), db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.product_id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    if product.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized.")
    db.delete(product)
    db.commit()
    return {"detail": "Product listing removed."}

# 12. User Profile [Protected]
@app.get("/users/profile")
def get_user_profile(current_user: models.User = Depends(get_user_from_header)):
    return {
        "user_id":    current_user.user_id,
        "name":       current_user.name,
        "email":      current_user.email,
        "created_at": current_user.created_at
    }

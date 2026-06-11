from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

import models, schemas, database

# Config constants (load via env vars in production)
SECRET_KEY = "SUPER_SECRET_COMPLEX_PASSPHRASE_FOR_CAMPUS_MARKETPLACE_OSSD_Y9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Student Market Palace API", version="1.0")

# Allow frontend to interact across origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Utility Helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_from_header(authorization: Optional[str] = Header(None), db: Session = Depends(database.get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization token format.")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload.")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token processing error or expiration encountered.")

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


# --- API ENDPOINTS ---

# 1. User Registration [Public]
@app.post("/register", status_code=201)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this student email already exists.")

    hashed_pwd = hash_password(user.password)
    new_user = models.User(name=user.name, email=user.email, password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Account created successfully!", "user_id": new_user.user_id}

# 2. User Login [Public]
@app.post("/login", response_model=schemas.Token)
def login_user(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid Email or Password credentials provided.")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# 3. Full-Text Search [Public] -- MUST be before /products/{id}
@app.get("/products/search", response_model=List[schemas.ProductResponse])
def search_products(keyword: str, db: Session = Depends(database.get_db)):
    return db.query(models.Product).filter(
        (models.Product.title.ilike(f"%{keyword}%")) |
        (models.Product.description.ilike(f"%{keyword}%"))
    ).all()

# 4. Multi-Parameter Filter [Public] -- MUST be before /products/{id}
@app.get("/products/filter", response_model=List[schemas.ProductResponse])
def filter_products(category: Optional[str] = None, status: Optional[str] = "available", db: Session = Depends(database.get_db)):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category.ilike(category))
    if status:
        query = query.filter(models.Product.status == status)
    return query.all()

# 5. Get All Products with Pagination [Public]
@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    return db.query(models.Product).filter(models.Product.status == "available").offset(skip).limit(limit).all()

# 6. Get Product By ID [Public]
@app.get("/products/{id}", response_model=schemas.ProductResponse)
def get_product_by_id(id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.product_id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Requested marketplace product listing does not exist.")
    
    # Fetch seller info from User table
    seller = db.query(models.User).filter(models.User.user_id == product.user_id).first()
    
    # Attach seller details to product object
    product.seller_name  = seller.name  if seller else None
    product.seller_email = seller.email if seller else None
    
    return product

# 7. Create Product Listing [Protected]
@app.post("/products", response_model=schemas.ProductResponse, status_code=201)
def create_product(product: schemas.ProductCreate, current_user: models.User = Depends(get_user_from_header), db: Session = Depends(database.get_db)):
    new_product = models.Product(**product.model_dump(), user_id=current_user.user_id)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# 8. Update Product Listing [Protected]
@app.put("/products/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, updated_fields: schemas.ProductUpdate, current_user: models.User = Depends(get_user_from_header), db: Session = Depends(database.get_db)):
    product_query = db.query(models.Product).filter(models.Product.product_id == id)
    project = product_query.first()

    if not project:
        raise HTTPException(status_code=404, detail="Product not found.")
    if project.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized action. You do not own this listing.")

    update_data = updated_fields.model_dump(exclude_unset=True)
    product_query.update(update_data, synchronize_session=False)
    db.commit()
    return product_query.first()

# 9. Delete Product Listing [Protected]
@app.delete("/products/{id}", status_code=200)
def delete_product(id: int, current_user: models.User = Depends(get_user_from_header), db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.product_id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    if product.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized action. You do not own this listing.")

    db.delete(product)
    db.commit()
    return {"detail": "Product listing permanently removed from marketplace."}

# 10. Get User Profile Data [Protected]
@app.get("/users/profile")
def get_user_profile(current_user: models.User = Depends(get_user_from_header)):
    return {
        "user_id": current_user.user_id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

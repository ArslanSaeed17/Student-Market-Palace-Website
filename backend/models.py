from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id     = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)
    email       = Column(String(150), unique=True, nullable=False, index=True)
    password    = Column(Text, nullable=False)
    is_verified = Column(Boolean, default=False)   # ← NEW: email verified?
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)

    products = relationship("Product", back_populates="owner")

class OTPCode(Base):                               # ← NEW table
    __tablename__ = "otp_codes"

    id         = Column(Integer, primary_key=True, index=True)
    email      = Column(String(150), nullable=False, index=True)
    code       = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used       = Column(Boolean, default=False)

class Product(Base):
    __tablename__ = "products"

    product_id  = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.user_id"))
    title       = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    price       = Column(Numeric(10, 2), nullable=False)
    category    = Column(String(100), nullable=False)
    condition   = Column(String(50), nullable=False, default="Used")
    status      = Column(String(20), default="available")
    image_url   = Column(Text, nullable=True)
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="products")

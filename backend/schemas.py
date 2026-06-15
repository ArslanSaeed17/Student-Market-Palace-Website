from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime


# --- USER SCHEMAS ---

class UserCreate(BaseModel):
    name:     str = Field(..., min_length=2, max_length=50)
    email:    EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email:    EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type:   str

class TokenData(BaseModel):
    email: Optional[str] = None


# --- PRODUCT SCHEMAS ---

class ProductCreate(BaseModel):
    title:       str   = Field(..., min_length=3, max_length=100)
    description: str   = Field(..., min_length=10, max_length=1000)
    price:       float = Field(..., gt=0)
    category:    str
    condition:   str        # "New", "Like New", "Used"
    image_url:   Optional[str] = None

class ProductUpdate(BaseModel):
    title:       Optional[str]   = None
    description: Optional[str]   = None
    price:       Optional[float] = None
    category:    Optional[str]   = None
    condition:   Optional[str]   = None
    status:      Optional[str]   = None   # available, reserved, sold
    image_url:   Optional[str]   = None

class ProductResponse(BaseModel):
    product_id:   int
    title:        str
    description:  str
    price:        float
    category:     str
    condition:    str
    status:       str
    image_url:    Optional[str]
    user_id:      Optional[int]  = None
    created_at:   datetime
    seller_name:  Optional[str]  = None
    seller_email: Optional[str]  = None

    class Config:
        from_attributes = True

    # Numeric(10,2) → float conversion
    @validator('price', pre=True)
    def parse_price(cls, v):
        return float(v) if v is not None else 0.0

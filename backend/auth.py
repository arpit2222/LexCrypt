import os
import jwt
from datetime import datetime, timedelta
import bcrypt
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def verify_admin(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return payload

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "nyaya_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client.nyaya_db
users_collection = db.users

class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    role: str
    firm_name: str = ""
    tokens_remaining: int = 50

class UserLogin(BaseModel):
    email: str
    password: str

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password[:72].encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password[:72].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

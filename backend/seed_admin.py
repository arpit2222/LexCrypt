import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from pymongo import MongoClient

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://consultforai_db_user:P2WK5dKcuRdw6xpR@cluster0.dxzu7zr.mongodb.net/?appName=Cluster0")
client = MongoClient(MONGO_URI)
db = client.nyaya_db
users_collection = db.users

def seed_admin():
    email = "admin@nyayasetu.ai"
    password = "Alpha@1002@"
    
    existing = users_collection.find_one({"email": email})
    if not existing:
        print(f"Creating master admin: {email}")
        users_collection.insert_one({
            "email": email,
            "password": pwd_context.hash(password),
            "name": "Super Admin",
            "role": "admin",
            "firm_name": "Nyaya Venture Studio",
            "tokens_remaining": 999999
        })
        print("Done.")
    else:
        print(f"Admin {email} already exists. Updating password and tokens.")
        users_collection.update_one(
            {"email": email},
            {"$set": {
                "password": pwd_context.hash(password),
                "role": "admin",
                "tokens_remaining": 999999
            }}
        )
        print("Done.")

if __name__ == "__main__":
    seed_admin()

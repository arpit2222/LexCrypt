import bcrypt
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://consultforai_db_user:P2WK5dKcuRdw6xpR@cluster0.dxzu7zr.mongodb.net/?appName=Cluster0")
client = MongoClient(MONGO_URI)
db = client.nyaya_db
users_collection = db.users

users = [
    {"email": "partner1@nyayasetu.ai", "password": "PremiumUser123!", "name": "Partner One", "role": "lawyer", "firm_name": "Premium Law Firm", "tokens_remaining": 999999},
    {"email": "partner2@nyayasetu.ai", "password": "PremiumUser123!", "name": "Partner Two", "role": "lawyer", "firm_name": "Premium Law Firm", "tokens_remaining": 999999}
]

for u in users:
    # Use passlib compatible bcrypt hash
    hashed = bcrypt.hashpw(u["password"].encode('utf-8')[:72], bcrypt.gensalt()).decode()
    users_collection.update_one(
        {"email": u["email"]},
        {"$set": {
            "password": hashed,
            "name": u["name"],
            "role": u["role"],
            "firm_name": u["firm_name"],
            "tokens_remaining": u["tokens_remaining"]
        }},
        upsert=True
    )
print("Seeded 2 premium users")

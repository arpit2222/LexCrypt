import bcrypt
import os
from pymongo import MongoClient

client = MongoClient("mongodb+srv://consultforai_db_user:P2WK5dKcuRdw6xpR@cluster0.dxzu7zr.mongodb.net/?appName=Cluster0")
users_collection = client.nyaya_db.users

password = b"Alpha@1002@"
hashed = bcrypt.hashpw(password, bcrypt.gensalt()).decode()

users_collection.update_one(
    {"email": "admin@nyayasetu.ai"},
    {"$set": {
        "password": hashed,
        "name": "Super Admin",
        "role": "admin",
        "firm_name": "Nyaya Venture Studio",
        "tokens_remaining": 999999
    }},
    upsert=True
)
print("Admin seeded successfully")

import bcrypt
import os
from pymongo import MongoClient

client = MongoClient("mongodb+srv://consultforai_db_user:P2WK5dKcuRdw6xpR@cluster0.dxzu7zr.mongodb.net/?appName=Cluster0")
users_collection = client.nyaya_db.users

users = [
    {"email": "partner1@nyayasetu.ai", "password": "PremiumUser123!", "name": "Partner One", "role": "lawyer", "firm_name": "Premium Law Firm", "tokens_remaining": 999999, "walletAddress": "partner1_wallet"},
    {"email": "partner2@nyayasetu.ai", "password": "PremiumUser123!", "name": "Partner Two", "role": "lawyer", "firm_name": "Premium Law Firm", "tokens_remaining": 999999, "walletAddress": "partner2_wallet"}
]

for u in users:
    hashed = bcrypt.hashpw(u["password"].encode('utf-8')[:72], bcrypt.gensalt()).decode()
    users_collection.update_one(
        {"email": u["email"]},
        {"$set": {
            "password": hashed,
            "name": u["name"],
            "role": u["role"],
            "firm_name": u["firm_name"],
            "tokens_remaining": u["tokens_remaining"],
            "walletAddress": u["walletAddress"]
        }},
        upsert=True
    )
print("Seeded 2 premium users")

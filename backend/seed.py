import bcrypt
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://consultforai_db_user:P2WK5dKcuRdw6xpR@cluster0.dxzu7zr.mongodb.net/?appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client.nyaya_db
users_collection = db.users

email = "admin@nyayasetu.ai"
password = b"Alpha@1002@"
hashed = bcrypt.hashpw(password, bcrypt.gensalt()).decode()

existing = users_collection.find_one({"email": email})
if not existing:
    users_collection.insert_one({
        "email": email,
        "password": hashed,
        "name": "Super Admin",
        "role": "admin",
        "firm_name": "Nyaya Venture Studio",
        "tokens_remaining": 999999
    })
    print("Created")
else:
    users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed, "role": "admin", "tokens_remaining": 999999}}
    )
    print("Updated")

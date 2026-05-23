from auth import users_collection, get_password_hash

def seed():
    print("Clearing existing users...")
    users_collection.delete_many({})

    dummy_users = [
        {"email": "admin@nyaya.ai", "name": "System Admin", "password": "password123", "role": "admin"},
        {"email": "citizen@nyaya.ai", "name": "Rahul Citizen", "password": "password123", "role": "citizen"},
        {"email": "lawyer@nyaya.ai", "name": "Adv. Ravi Sharma", "password": "password123", "role": "lawyer"},
        {"email": "associate@nyaya.ai", "name": "Priya Associate", "password": "password123", "role": "associate"},
    ]

    print("Inserting dummy users...")
    for u in dummy_users:
        u["password"] = get_password_hash(u["password"])
        users_collection.insert_one(u)
        
    print("Database seeding complete!")

if __name__ == "__main__":
    seed()

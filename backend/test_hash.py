import sys
import os

# Ensure we import from current dir
sys.path.append(os.getcwd())

try:
    from auth import get_password_hash
    pw = "a" * 80
    print(f"Hashing password of length {len(pw)}")
    h = get_password_hash(pw)
    print("Success! Hash:", h)
except Exception as e:
    print("Error:", str(e))

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import uuid
import os
import json
from datetime import datetime
from PyPDF2 import PdfReader

from ai_service import draft_document, chat_analysis
from auth import auth_router

app = FastAPI(title="Nyaya AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth")

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGODB_URI")
if not uri:
    raise ValueError("MONGODB_URI environment variable not set")

client = MongoClient(uri, server_api=ServerApi('1'))
db = client['nyaya_db']
citizen_chat_collection = db['citizen_chats']
lawyer_copilot_collection = db['lawyer_copilots']
cases_collection = db['cases']

class CaseAssignRequest(BaseModel):
    citizen_wallet: str
    lawyer_id: str
    query_details: str

class ChatRequest(BaseModel):
    history: list
    session_id: str = ""
    user_id: str
    language: str = "english"

class CopilotRequest(BaseModel):
    history: list
    session_id: str = ""
    email: str = ""

@app.post("/api/cases/hire")
def assign_case(request: CaseAssignRequest):
    case_doc = {
        "_id": str(uuid.uuid4()),
        "citizen_wallet": request.citizen_wallet,
        "lawyer_id": request.lawyer_id,
        "query_details": request.query_details,
        "status": "pending",
        "timestamp": datetime.utcnow().isoformat()
    }
    cases_collection.insert_one(case_doc)
    return {"status": "success", "case_id": case_doc["_id"]}

@app.post("/api/chat")
def chat_with_ai(request: ChatRequest):
    reply = chat_analysis(request.history)
    
    session_id = request.session_id
    if not session_id:
        session_id = str(uuid.uuid4())
        title = request.history[0].get("content", "")[:50] + "..." if request.history else "New Case"
        citizen_chat_collection.insert_one({
            "_id": session_id,
            "email": request.user_id,
            "title": title,
            "history": request.history + [{"role": "assistant", "content": reply}],
            "timestamp": datetime.utcnow().isoformat()
        })
    else:
        citizen_chat_collection.update_one(
            {"_id": session_id},
            {"$set": {"history": request.history + [{"role": "assistant", "content": reply}]}}
        )

    return {"reply": reply, "session_id": session_id}

@app.get("/api/chat/history")
def get_chat_history(email: str):
    cursor = citizen_chat_collection.find({"email": email}).sort("timestamp", -1)
    return list(cursor)

@app.post("/api/copilot/research")
def copilot_research(request: CopilotRequest):
    reply = chat_analysis(request.history)
    
    session_id = request.session_id
    if not session_id:
        session_id = str(uuid.uuid4())
        title = request.history[0].get("content", "")[:50] + "..." if request.history else "New Research"
        lawyer_copilot_collection.insert_one({
            "_id": session_id,
            "email": request.email,
            "title": title,
            "history": request.history + [{"role": "assistant", "content": reply}],
            "timestamp": datetime.utcnow().isoformat()
        })
    else:
        lawyer_copilot_collection.update_one(
            {"_id": session_id},
            {"$set": {"history": request.history + [{"role": "assistant", "content": reply}]}}
        )

    return {"reply": reply, "session_id": session_id}

@app.get("/api/copilot/history")
def get_copilot_history(email: str):
    cursor = lawyer_copilot_collection.find({"email": email}).sort("timestamp", -1)
    return list(cursor)

@app.post("/api/copilot/upload")
async def copilot_upload(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf") and not file.filename.endswith(".txt"):
         return {"error": "Only PDF and TXT files are supported."}
    
    text_content = ""
    if file.filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        for page in reader.pages:
            text_content += page.extract_text() + "\n"
    else:
        text_content = (await file.read()).decode("utf-8")
        
    return {"filename": file.filename, "text": text_content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

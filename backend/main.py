from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import uuid
import os
import json
from datetime import datetime
from PyPDF2 import PdfReader

from ai_service import draft_document, chat_analysis, copilot_research as copilot_research_ai
from auth import auth_router

app = FastAPI(title="Nyaya Setu Backend")

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
uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(uri, serverSelectionTimeoutMS=5000)
db = client['nyaya_db']
citizen_chat_collection = db['citizen_chats']
lawyer_copilot_collection = db['lawyer_copilots']
lawyer_drafts_collection = db['lawyer_drafts']
cases_collection = db['cases']

class CaseAssignRequest(BaseModel):
    session_id: str
    citizen: str
    lawyer_id: str
    query: str

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
        "citizen": request.citizen,
        "lawyer_id": request.lawyer_id,
        "query": request.query,
        "status": "PENDING",
        "timestamp": datetime.utcnow().isoformat()
    }
    cases_collection.update_one(
        {"_id": request.session_id},
        {"$set": case_doc},
        upsert=True
    )
    citizen_chat_collection.update_one(
        {"_id": request.session_id},
        {"$set": {"assigned": True}}
    )
    return {"status": "success", "case_id": request.session_id}

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
    results = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

@app.get("/api/user/me")
def get_user_me(email: str):
    from auth import users_collection
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "email": user.get("email"),
        "name": user.get("name"),
        "role": user.get("role"),
        "firm_name": user.get("firm_name", "Nyaya Setu")
    }

@app.post("/api/copilot/research")
def copilot_research(request: CopilotRequest):
    ai_result = copilot_research_ai(request.history)
    reply = ai_result.get("summary", "")
    
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
    results = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

@app.delete("/api/copilot/history/{session_id}")
def delete_copilot_history(session_id: str):
    from bson.objectid import ObjectId
    try:
        obj_id = ObjectId(session_id)
    except:
        obj_id = None
    query = {"$or": [{"_id": session_id}]}
    if obj_id:
        query["$or"].append({"_id": obj_id})
        
    result = lawyer_copilot_collection.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="History not found")
    return {"status": "success"}

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

class ActionRequest(BaseModel):
    case_id: str
    action: str

@app.get("/api/cases/lawyer")
def get_lawyer_cases(lawyer_id: str):
    return list(cases_collection.find({"lawyer_id": lawyer_id}))

@app.post("/api/cases/action")
def action_case(request: ActionRequest):
    cases_collection.update_one({"_id": request.case_id}, {"$set": {"status": request.action}})
    return {"message": "Success"}

@app.get("/api/cases/citizen")
def get_citizen_cases(citizen_wallet: str):
    return list(cases_collection.find({"citizen_wallet": citizen_wallet}))

class DraftRequest(BaseModel):
    instructions: str
    document_type: str = "General Legal Document"
    email: str = ""

@app.post("/api/draft")
def get_draft(request: DraftRequest):
    draft_content = draft_document(request.document_type, request.instructions)
    if request.email:
        lawyer_drafts_collection.insert_one({
            "_id": str(uuid.uuid4()),
            "email": request.email,
            "document_type": request.document_type,
            "instructions": request.instructions,
            "details": request.instructions,
            "draft_content": draft_content,
            "timestamp": datetime.utcnow().isoformat()
        })
    return draft_content

@app.get("/api/draft/history")
def get_draft_history(email: str):
    cursor = lawyer_drafts_collection.find({"email": email}).sort("timestamp", -1)
    results = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

@app.delete("/api/draft/history/{draft_id}")
def delete_draft_history(draft_id: str):
    from bson.objectid import ObjectId
    try:
        obj_id = ObjectId(draft_id)
    except:
        obj_id = None
    query = {"$or": [{"_id": draft_id}]}
    if obj_id:
        query["$or"].append({"_id": obj_id})
        
    result = lawyer_drafts_collection.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Draft not found")
    return {"status": "success"}

@app.get("/api/admin/stats")
def get_admin_stats():
    return {"total_citizens": 124, "total_lawyers": 45, "active_cases": 12, "ai_requests": 8420, "recent_users": []}

@app.get("/api/admin/users")
def get_admin_users():
    return []

chat_rooms_collection = db['chat_rooms']

class ChatMessageRequest(BaseModel):
    case_id: str
    sender: str
    text: str
    file_url: str = ""

@app.post("/api/cases/chat/send")
def send_chat_message(request: ChatMessageRequest):
    msg = {
        "case_id": request.case_id,
        "sender": request.sender,
        "text": request.text,
        "file_url": request.file_url,
        "timestamp": datetime.utcnow().isoformat()
    }
    chat_rooms_collection.insert_one(msg)
    return {"status": "success"}

@app.get("/api/cases/chat/history")
def get_case_chat(case_id: str):
    return list(chat_rooms_collection.find({"case_id": case_id}).sort("timestamp", 1))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

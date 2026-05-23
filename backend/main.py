from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

app = FastAPI(title="Nyaya AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from auth import users_collection, db, UserRegister, UserLogin, verify_password, get_password_hash, create_access_token
from fastapi import HTTPException
from datetime import datetime
import fitz
from ai_service import chat_analysis, draft_document, copilot_research as ai_copilot, score_student, summarize_document, generate_severity_score, simulation_chat_analysis

saved_queries_collection = db.saved_queries

class ScoreRequest(BaseModel):
    issue: str

@app.post("/api/fhe/score")
def fhe_severity_score(request: ScoreRequest):
    score = generate_severity_score(request.issue)
    return {"severity_score": score}

class SimulationChatRequest(BaseModel):
    history: list

@app.post("/api/simulation/chat")
def simulation_chat(request: SimulationChatRequest):
    reply = simulation_chat_analysis(request.history)
    return {"reply": reply}

class SaveQueryRequest(BaseModel):
    user_email: str
    query: str
    ai_response: str

@app.post("/api/chat/save")
def save_query(request: SaveQueryRequest):
    try:
        new_query = {
            "email": request.user_email,
            "query": request.query,
            "ai_response": request.ai_response,
            "timestamp": datetime.utcnow().isoformat()
        }
        saved_queries_collection.insert_one(new_query)
        return {"message": "Query saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/chat/history")
def get_query_history(email: str):
    try:
        queries = list(saved_queries_collection.find({"email": email}, {"_id": 0}).sort("timestamp", -1))
        return queries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/auth/register")
def register_user(user: UserRegister):
    try:
        if users_collection.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user.password)
        new_user = {
            "email": user.email,
            "password": hashed_password,
            "name": user.name,
            "role": user.role
        }
        users_collection.insert_one(new_user)
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

@app.post("/api/auth/login")
def login_user(user: UserLogin):
    try:
        db_user = users_collection.find_one({"email": user.email})
        if not db_user or not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        access_token = create_access_token(data={"sub": db_user["email"], "role": db_user["role"]})
        return {"access_token": access_token, "token_type": "bearer", "role": db_user["role"], "name": db_user["name"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

@app.get("/api/admin/stats")
def get_admin_stats():
    return {
        "total_citizens": 1250,
        "total_lawyers": 85,
        "active_cases": 340,
        "ai_requests": 15000,
        "recent_users": [
            {"email": "citizen@example.com", "role": "citizen", "joined": "Today"},
            {"email": "lawyer@example.com", "role": "lawyer", "joined": "Yesterday"},
            {"email": "student@example.com", "role": "citizen", "joined": "2 days ago"}
        ]
    }

class ChatRequest(BaseModel):
    message: str
    language: str = "english"

@app.get("/")
def read_root():
    return {"message": "Welcome to Nyaya AI API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/chat")
def chat_with_ai(request: ChatRequest):
    reply = chat_analysis(request.message)
    return {
        "reply": reply
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = ""
        
        if file.filename.lower().endswith('.pdf'):
            doc = fitz.open(stream=content, filetype="pdf")
            for page in doc:
                text += page.get_text()
            doc.close()
        else:
            text = content.decode('utf-8', errors='ignore')
            
        summary = summarize_document(text)
        
        return {
            "filename": file.filename,
            "document_type": "Analyzed Document",
            "extracted_entities": {},
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/lawyers")
def get_lawyers():
    return [
        {"id": "1", "name": "Adv. Ravi Sharma", "specialty": "Corporate Law", "rating": 4.9, "languages": ["English", "Hindi"], "fee": "₹2000/hr", "location": "Mumbai"},
        {"id": "2", "name": "Adv. Priya Singh", "specialty": "Family Law", "rating": 4.7, "languages": ["English", "Hindi", "Marathi"], "fee": "₹1500/hr", "location": "Pune"},
        {"id": "3", "name": "Adv. Amit Patel", "specialty": "Criminal Law", "rating": 4.8, "languages": ["Gujarati", "English"], "fee": "₹3000/hr", "location": "Ahmedabad"}
    ]

class BookingRequest(BaseModel):
    lawyer_id: str
    date: str
    time: str
    issue_summary: str

@app.post("/api/bookings")
def book_consultation(request: BookingRequest):
    time.sleep(1)
    return {"status": "success", "booking_id": "BK-90210", "message": "Consultation booked successfully."}

class DraftRequest(BaseModel):
    document_type: str
    details: str

@app.post("/api/draft")
def generate_draft(request: DraftRequest):
    draft_content = draft_document(request.document_type, request.details)
    return {"draft_content": draft_content}

class CopilotRequest(BaseModel):
    query: str

@app.post("/api/copilot/research")
def copilot_research(request: CopilotRequest):
    result = ai_copilot(request.query)
    return result

class SimulationRequest(BaseModel):
    case_id: str
    student_argument: str

@app.post("/api/simulation/score")
def score_simulation(request: SimulationRequest):
    result = score_student(request.student_argument)
    return result

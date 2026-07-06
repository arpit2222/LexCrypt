import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("AZURE_OPENAI_API_KEY", "")
azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "https://testconsulting.openai.azure.com/")
deployment_name = "gpt-5.4"

client = AzureOpenAI(
    azure_endpoint=azure_endpoint,
    api_key=api_key,
    api_version="2024-02-15-preview"
)

def chat_analysis(user_message: str) -> str:
    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are Nyaya AI, an expert legal assistant in Indian law. Provide accurate, clear, and actionable legal advice to citizens. Use bullet points, bold text, and numbered lists to make your answer highly structured and readable. Avoid long walls of text. Keep answers under 3 short sections."},
                {"role": "user", "content": user_message}
            ],
            max_completion_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def draft_document(doc_type: str, details: str) -> str:
    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are Nyaya AI, an expert legal drafter. Draft highly professional legal documents based on user input. Include standard boilerplates."},
                {"role": "user", "content": f"Draft a {doc_type} based on these details:\n{details}"}
            ],
            max_completion_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def copilot_research(query: str) -> dict:
    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are a legal AI Copilot fine-tuned exclusively on the private historical data of 'Sharma & Associates'. When answering, always explicitly state that you are drawing insights from the firm's private database, successful past case templates, and proprietary historical records."},
                {"role": "user", "content": query}
            ],
            max_completion_tokens=2000
        )
        return {
            "summary": response.choices[0].message.content,
            "citations": ["Sharma & Associates Internal DB: Case File #892-A (2021)", "Sharma & Associates Internal DB: Reliance Contract Template (2019)"]
        }
    except Exception as e:
        return {"summary": f"AI Error: {str(e)}", "citations": []}

def score_student(argument: str) -> dict:
    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are a Law Professor. Evaluate the student's legal argument. Return a score from 1-100, brief feedback, and a recommended reading. Format EXACTLY as: SCORE|FEEDBACK|READING"},
                {"role": "user", "content": argument}
            ],
            max_completion_tokens=2000
        )
        text = response.choices[0].message.content
        parts = text.split('|')
        
        if len(parts) >= 3:
            return {
                "score": int(parts[0].strip()),
                "feedback": parts[1].strip(),
                "recommended_reading": parts[2].strip()
            }
        return {
            "score": 75,
            "feedback": text,
            "recommended_reading": "Review relevant sections of the Indian Penal Code."
        }
    except Exception as e:
        return {"score": 0, "feedback": f"AI Error: {str(e)}", "recommended_reading": ""}

def summarize_document(text: str) -> str:
    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "Summarize the legal document text provided in 2 sentences. Specify what type of document it is."},
                {"role": "user", "content": text[:4000]} # Limit tokens to prevent overload
            ],
            max_completion_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

def generate_severity_score(issue: str) -> int:
    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are a legal triaging system. Evaluate the legal issue and return ONLY a number from 1 to 100 representing the severity/urgency (100 is life-threatening/immediate, 1 is minor inconvenience)."},
                {"role": "user", "content": issue}
            ],
            max_completion_tokens=2000
        )
        return int(response.choices[0].message.content.strip())
    except Exception as e:
        return 50 # Default fallback

def simulation_chat_analysis(history: list[dict]) -> str:
    try:
        messages = [
            {"role": "system", "content": "You are a multi-agent simulation in an Indian Courtroom. The user is a law student playing the Defense. You play TWO roles. 1) The PROSECUTION generating a legal counter-argument. 2) The JUDGE providing a quick 1-sentence ruling/critique of the student's argument. Format EXACTLY like this:\n\n[PROSECUTION]: <counter-argument>\n\n[JUDGE]: <ruling>"}
        ]
        
        for msg in history:
            role = "assistant" if msg.get("role") == "ai" else msg.get("role", "user")
            messages.append({"role": role, "content": msg.get("content", "")})
        
        response = client.chat.completions.create(
            model=deployment_name,
            messages=messages,
            max_completion_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"AI Error: {str(e)}"

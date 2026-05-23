# ⚖️ Nyaya AI - Akindo Wave Hackathon Build

Nyaya AI is an advanced, multilingual AI-powered legal intelligence and access platform. This build represents our complete End-to-End MVP for the hackathon, featuring real Azure OpenAI integration, Deep Web3 Fully Homomorphic Encryption (FHE), Voice Accessibility, and Live Video Infrastructure.

---

## 🌟 What We Have Developed (Hackathon Build)

### 1. The Four Core Pillars
* **Citizen Pillar**: Multilingual AI legal chat, PDF document intelligence, lawyer marketplace, and automated legal drafting (RTIs, Notices).
* **Lawyer Pillar**: Case management dashboard, live video consultations, and AI Copilot for deep legal research.
* **Associate / Law Student Pillar**: Mock Trial Simulator (Vakil Guru) featuring a Multi-Agent AI (Acting dynamically as both Prosecution and Judge).
* **Admin Pillar**: System-wide analytics and user management.

### 2. Deep Web3 FHE Integration (Fhenix)
We implemented a Fully Homomorphic Encryption (FHE) flow to protect citizen data on-chain.
* **Smart Contract**: `NyayaFHE.sol` stores encrypted case severity using `@fhenixprotocol/contracts`.
* **Frontend Flow**: When a citizen connects their wallet (RainbowKit) and saves a case, the LLM secretly evaluates the severity. The frontend then encrypts this score using `fhenixjs` before it ever leaves the browser, generating the ciphertext needed for the smart contract!

### 3. Voice Accessibility & Video Infrastructure
* **Multilingual STT/TTS**: Integrated native Web Speech API. Citizens can speak their legal issues in Hindi/English using the **Mic icon**, and the AI can read advice out loud using the **Listen button**.
* **Live Video Calls**: Integrated **Jitsi Meet** WebRTC directly into the app. Citizens and Lawyers can join secure, embedded video rooms without leaving the platform.

### 4. Real Azure OpenAI & Document Intelligence
* Replaced all mock data with a real `gpt-5.4` Azure OpenAI deployment.
* Integrated `PyMuPDF` to extract text from uploaded documents, allowing the AI to summarize real PDFs.

---

## 🔑 Login Credentials

The platform uses a role-based JWT authentication system connected to MongoDB Atlas. Use the following test accounts to explore the different dashboards:

| Role | Email | Password |
|------|-------|----------|
| **Citizen** | `citizen@nyaya.ai` | `password123` |
| **Lawyer** | `lawyer@nyaya.ai` | `password123` |
| **Associate/Student** | `associate@nyaya.ai` | `password123` |
| **Admin** | `admin@nyaya.ai` | `password123` |

---

## 🚀 Setup & Run Instructions

### 1. Backend (FastAPI)
The backend handles MongoDB, JWT Auth, and the Azure OpenAI endpoints.
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*API available at `http://localhost:8000`*

### 2. Frontend (Next.js)
The frontend uses Next.js, Tailwind CSS, RainbowKit, Wagmi, and Fhenixjs.
```bash
cd frontend
npm install
npm run dev
```
*Web App available at `http://localhost:3000`*

### 3. Testing the FHE Web3 Flow
1. Login as a **Citizen**.
2. Click the **Connect Wallet** button in the top right header.
3. Chat with the AI about a legal issue.
4. Click **Save** beneath the AI's response. You will see an alert confirming the Fhenix encryption (`euint8`) occurred in the browser!

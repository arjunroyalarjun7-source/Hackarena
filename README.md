# 🌸 Sakhi AI — Speak. Understand. Access.

> **Government Help, In Your Voice.**  
> Sakhi AI empowers first-time women citizens across India to understand and access essential welfare services through simple voice or text conversations in their own language — without requiring English literacy, technical expertise, or third-party intermediaries.

---

## 📌 Problem

In India, hundreds of essential government welfare schemes exist to support women through livelihood grants, vocational training, maternity assistance, and business loans. However:
1. **Language Barrier:** Most official portals and application forms are available predominantly in complex English or dense administrative language.
2. **Digital & Technical Divide:** First-time internet users, especially rural and semi-urban women, struggle with multi-stage digital forms, captchas, and technical jargon.
3. **Exploitation by Middlemen:** Due to lack of clarity, women frequently pay unauthorized fees to middlemen or internet cafe operators just to understand basic eligibility.
4. **Fear of Frauds:** Vulnerable citizens are often duped into sharing OTPs, bank passwords, or debit card PINs.

---

## 💡 Solution

**Sakhi AI** acts as a trusted, warm digital companion. The user simply taps the microphone and speaks naturally in **English**, **Tamil (தமிழ்)**, or **Telugu (తెలుగు)**.

Sakhi AI:
- Asks **one simple question at a time**.
- Uses plain, respectful language free of administrative jargon.
- Intelligently explains what to do when the user says *"I don't know"*.
- Guides the user through a 4-step eligibility assessment.
- Formulates a personalized **Sakhi Journey** with a clear 4-step roadmap and document checklist.
- Strictly guards privacy: **never requests OTPs, PINs, or passwords**.

---

## 🚀 Key Features

- 🎙️ **Voice-First Experience:** Powered by the browser's Web Speech API (`SpeechRecognition` for speech-to-text and `SpeechSynthesis` for natural spoken responses).
- 🇮🇳 **Multilingual Support:** Native language guidance in **English (en-IN)**, **Tamil (ta-IN)**, and **Telugu (te-IN)**.
- 🔮 **Adaptive Animated Voice Orb:** Visual state feedback for *Ready*, *Listening*, *Thinking/Processing*, and *Speaking*.
- 🛡️ **Zero-Credential Security Guard:** Built-in safeguards preventing any collection of OTPs, passwords, or sensitive credentials.
- 📑 **Actionable Sakhi Roadmap:** Step-by-step guidance (01 Prepare Documents → 02 Open Official Service → 03 Complete Application → 04 Keep Acknowledgement).
- 📋 **Document Preparation Checklist:** Plain-language list of essential papers (Aadhaar, passbook, photos).
- 🏷️ **Transparent DEMO DATA Markers:** Clear disclaimers advising users to verify with official government sources before final submission.
- ⚡ **Rate Limited & Resilient:** Protected backend with Express Rate Limiter, graceful port conflict resolution, and structured JSON output.

---

## 🏗️ Architecture & Core Flow

```text
User Speaks or Types in Native Language (en-IN / ta-IN / te-IN)
                     ↓
      Web Speech API (STT in Browser)
                     ↓
       Frontend UI (React + Vite)
                     ↓
  Backend Express API (/api/guide, /api/session)
  (Session State + Scheme Dataset + Rate Limiting)
                     ↓
   Google Gemini API (@google/genai SDK)
                     ↓
 Structured JSON Response (Eligibility, Progress, Options)
                     ↓
 Frontend Updates UI & SpeechSynthesis Reads Reply Aloud
                     ↓
 Personalized Sakhi Journey Roadmap & Official Link
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 + Vite 6
- **Language:** Modern JavaScript (ES Modules)
- **Styling:** Custom Vanilla CSS (Dark navy, soft violet, warm rose glassmorphism, responsive mobile-first)
- **Icons:** `lucide-react`
- **Voice / Audio:** Web Speech API (`SpeechRecognition` + `window.speechSynthesis`)

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v4)
- **AI SDK:** Official Google GenAI SDK (`@google/genai` v2.25+)
- **Security & Utilities:** `cors`, `dotenv`, `express-rate-limit`, Node native `crypto.randomUUID()`

---

## 📂 Folder Structure

```text
sakhi-ai/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Header with language selector and restart button
│   │   │   ├── VoiceOrb.jsx         # Animated voice orb with audio wave states
│   │   │   ├── LanguageSelector.jsx # Language switcher (English, தமிழ், తెలుగు)
│   │   │   ├── QuickAction.jsx      # Quick-start action cards
│   │   │   ├── ChatBubble.jsx       # Chat message bubble with read-aloud button
│   │   │   ├── TypingIndicator.jsx  # Animated pulse indicator for Gemini thinking
│   │   │   ├── ProgressBar.jsx      # 4-stage visual progress tracker
│   │   │   ├── JourneyCard.jsx      # Comprehensive outcome card with steps & docs
│   │   │   ├── SourceBadge.jsx      # DEMO DATA and official source badge
│   │   │   ├── PrivacyCard.jsx      # Security notice ("Never share OTPs or PINs")
│   │   │   └── Footer.jsx           # Accessible footer with disclaimers
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero landing with Voice Orb & Quick Actions
│   │   │   ├── Guide.jsx            # Interactive Q&A conversation screen
│   │   │   └── Result.jsx           # Sakhi Journey roadmap and document summary
│   │   │
│   │   ├── services/
│   │   │   ├── api.js               # Frontend API client (points to Express backend)
│   │   │   ├── speechService.js     # Web Speech STT and TTS controller
│   │   │   └── translations.js      # Multilingual dictionaries & step questions
│   │   │
│   │   ├── App.jsx                  # Master app controller & state coordinator
│   │   ├── main.jsx                 # React root DOM bootstrap
│   │   └── index.css                # Design system, glass cards, animations
│   │
│   ├── .env                         # Frontend environment configuration
│   ├── .env.example                 # Example frontend environment file
│   ├── vite.config.js               # Vite build configuration
│   └── package.json                 # Frontend dependencies
│
├── server/
│   ├── controllers/
│   │   └── guideController.js       # Request controllers for session & AI guide
│   │
│   ├── routes/
│   │   └── guideRoutes.js           # API route mappings (/api/session, /api/guide, /api/health)
│   │
│   ├── services/
│   │   ├── geminiService.js         # Official @google/genai SDK integration
│   │   ├── schemeService.js         # Scheme data loader & step question provider
│   │   └── sessionService.js        # Independent session state store (UUID-based)
│   │
│   ├── data/
│   │   └── schemes.js               # Verified DEMO welfare scheme dataset
│   │
│   ├── middleware/
│   │   └── rateLimiter.js           # Express rate limiters for abuse prevention
│   │
│   ├── utils/
│   │   └── validators.js            # Input sanitization and request validation
│   │
│   ├── server.js                    # Express application entry point & fallback port handler
│   ├── .env                         # Server environment configuration (API Key)
│   ├── .env.example                 # Example server environment template
│   ├── .gitignore                   # Backend git ignore
│   └── package.json                 # Backend dependencies
│
├── .gitignore                       # Root git ignore
└── README.md                        # Documentation
```

---

## 🔑 Gemini Setup & Environment Variables

### 1. Backend (`server/.env`)
Create or edit `server/.env`:
```env
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
PORT=5000
```
> [!IMPORTANT]
> - Replace `YOUR_ACTUAL_GEMINI_API_KEY` with your actual Google Gemini API key obtained from [Google AI Studio](https://aistudio.google.com/).
> - The API key is stored exclusively on the server and is **never** sent to the client browser.

### 2. Frontend (`client/.env`)
Create or edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```
> [!NOTE]
> The frontend client only communicates with the backend Express server (`http://localhost:5000`). If port 5000 is occupied (for instance, by macOS AirPlay Receiver), the backend and frontend automatically detect and use fallback port `5001`.

---

## 🏃 Quick Start Guide

### Step 1: Install Dependencies
Open your terminal in the root folder:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Your API Key
In `server/.env`:
```env
GEMINI_API_KEY=paste_your_gemini_api_key_here
PORT=5000
```

### Step 3: Run the Application

#### Terminal 1 — Start Backend Server:
```bash
cd server
npm run dev
```
Backend runs on: **`http://localhost:5000`** (or `http://localhost:5001` if port 5000 is in use)  
Health Check: **`http://localhost:5000/api/health`**

#### Terminal 2 — Start Frontend Client:
```bash
cd client
npm run dev
```
Frontend runs on: **`http://localhost:5173`**

---

## 🗣️ Voice & Language Support

- **Speech Recognition (STT):** Uses the browser's native `SpeechRecognition` / `webkitSpeechRecognition`. Works smoothly in Chrome, Edge, Safari, and Chromium-based browsers.
- **Speech Synthesis (TTS):** Uses `window.speechSynthesis` with speech rate and pitch tuned for clarity and friendliness.
- **Supported Locales:**
  - `en-IN`: Indian English
  - `ta-IN`: தமிழ் (Tamil)
  - `te-IN`: తెలుగు (Telugu)
- **Fallback:** If a user visits on a browser without speech recognition support, Sakhi presents a friendly banner and provides a smooth text input and button selection fallback.

---

## 🔒 Security & Privacy

1. **API Key Isolation:** The Gemini API key remains strictly on the Node.js backend. No client-side bundle contains or exposes the key.
2. **Zero-Credential Policy:** Sakhi's system prompt strictly prohibits asking for or accepting passwords, OTPs, PINs, or UPI details.
3. **Rate Limiting:** `express-rate-limit` prevents Denial-of-Service and excessive API token consumption.
4. **Input Sanitization:** All messages are trimmed, sanitized, and length-capped.
5. **No Stack Traces:** Server errors are intercepted and returned with human-readable messages without exposing underlying stack traces.

---

## ⚠️ Demo Data Notice

All scheme information in this version represents **DEMO DATA** for hackathon evaluation:
- Scheme: *Demo Women Livelihood & Support Service*
- Disclaimer: *"Verify important information with the official government service before applying."*
- Schema is designed for seamless plug-and-play replacement with real APIs (e.g., MyScheme portal or state DBT APIs).

---

## 🔮 Future Scope

- **WhatsApp & IVR Integration:** Enable rural women to dial a toll-free number or send a WhatsApp voice note to interact with Sakhi.
- **Document OCR & Scanner:** Allow users to show an Aadhaar or ration card to verify spelling and eligibility automatically.
- **Regional Dialect Fine-Tuning:** Extend voice recognition to colloquial rural dialects across additional Indian languages (Hindi, Kannada, Marathi, Bengali, Odia).
- **Assisted Submission Mode:** Connect directly with verified Common Service Centre (CSC) village-level entrepreneurs (VLE) for doorstep document pickup.

---

**Built with ❤️ for digital inclusion, accessibility, and women empowerment.**

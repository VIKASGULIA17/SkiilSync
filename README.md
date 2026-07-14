# SkillSync

**AI-Powered Resume Analysis & Career Guidance**

SkillSync analyzes your resume against target job roles, identifies skill gaps, provides AI-powered improvement recommendations, and connects you with matching job opportunities.

---

## ✨ Features

- **📄 Smart Resume Analysis** — Upload your PDF resume and get an instant skill-match score against 55+ tech roles
- **🎯 Auto Role Detection** — AI automatically identifies the best-matching role for your profile
- **💡 AI Career Coach** — Personalized feedback and learning recommendations powered by Groq/Llama
- **🔍 Job Discovery** — Browse 700+ jobs scraped from Internshala and FreshersWorld with search & filters
- **📊 Skill Gap Visualization** — See exactly which skills you have and which ones you're missing

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Backend | FastAPI (Python) |
| Database | SQLite (SQLAlchemy ORM) |
| AI | Groq API + LangChain (Llama 4 Scout) |
| Styling | Vanilla CSS with glassmorphism design |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Groq API Key** — Get one free at [console.groq.com/keys](https://console.groq.com/keys)

### 1. Clone the Repository

```bash
git clone https://github.com/VIKASGULIA17/SkiilSync.git
cd SkiilSync
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure API key (copy example and edit)
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the interactive API documentation.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** The frontend proxies `/api` requests to the backend at `localhost:8000`, so both servers must be running.

### 4. (Optional) Configure API Key via UI

Instead of using the `.env` file, you can also configure your Groq API key through the **Settings** page in the web UI.

## 📁 Project Structure

```
SkiilSync/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py          # App entry point, CORS, startup
│   │   ├── config.py        # Settings & environment variables
│   │   ├── database.py      # SQLite + SQLAlchemy setup
│   │   ├── models.py        # DB models + Pydantic schemas
│   │   ├── routes/          # API route handlers
│   │   │   ├── resume.py    # /api/analyze endpoints
│   │   │   ├── jobs.py      # /api/jobs endpoints
│   │   │   ├── skills.py    # /api/roles endpoint
│   │   │   └── settings.py  # /api/settings endpoints
│   │   └── services/        # Business logic (single source of truth)
│   │       ├── resume_parser.py
│   │       ├── gap_analyzer.py
│   │       ├── ai_feedback.py
│   │       ├── skills_db.py
│   │       └── job_scraper.py
│   ├── data/
│   │   └── skills_data.csv  # Role-skill mapping database
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── api/client.js    # API wrapper
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Router setup
│   │   └── index.css        # Design system
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Upload PDF resume for analysis |
| `POST` | `/api/analyze/feedback` | Get AI-powered improvement feedback |
| `POST` | `/api/analyze/role` | Analyze resume for a specific role |
| `GET` | `/api/roles` | List all available roles |
| `GET` | `/api/jobs` | List jobs with filtering & pagination |
| `POST` | `/api/jobs/refresh` | Trigger background job scraping |
| `GET` | `/api/jobs/status` | Get scraping status |
| `POST` | `/api/settings/api-key` | Configure Groq API key |
| `GET` | `/api/settings/api-key/status` | Check API key status |

## 📄 License

This project is open source.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
# 🚀 FemWell - AI-Powered Women's Health Analysis

## 📌 Project Overview
FemWell is an AI-powered web application created during **Forge Alumunus - Inspira 2025 (24Hr Hackathon)**.
It helps provide **PCOS screening insights** using survey/assessment inputs and an ML inference layer.

⚠️ FemWell is a screening tool and **not** a substitute for professional medical diagnosis.

---

## 🛠️ Features
✅ **User Authentication** - Secure login & registration using **email + password** with DB-backed sessions.  
✅ **Analysis Dashboard** - Access different screening tools and pages.  
✅ **Survey Analysis** - Collect and process personalized assessment data.  
✅ **PCOS Screening (ML-backed)** - Returns `pcosProbability` (0..1) + `pcosLikelihood` label.  
✅ **Saved Assessments** - Results are stored in Postgres and shown in Profile/Results.  
✅ **Report Scanner (UI)** - Upload UX is available; analysis model can be integrated later.  

---

## 🎯 Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Drizzle ORM) — commonly hosted on Supabase
- **AI/ML:** Python (scikit-learn pipeline; invoked by the backend)

---

## 📂 Project Structure
```
Femwell-AI-PCOS-Detection/
│-- client/               # Frontend (React + Vite)
│-- server/               # Backend (Express API)
│-- shared/               # Shared types/schemas (Zod)
│-- dataset/              # ML scripts + model artifacts (train/predict)
│-- Dockerfile            # Render deploy (Node + Python)
│-- render.yaml           # Render blueprint config
│-- netlify.toml          # Netlify config + /api proxy + SPA fallback
│-- README.md             # Project documentation
```

---

## 🚀 Installation & Setup

### 🔹 Step 1: Clone the Repository
```bash
git clone https://github.com/nileshh-27/Femwell-AI-PCOS-Detection.git
cd Femwell-AI-PCOS-Detection
```

### 🔹 Step 2: Configure Environment Variables
Create a `.env` file in the repo root:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
DATABASE_SSL=true
```

> `DATABASE_SSL=true` is recommended for hosted Postgres providers (like Supabase). If your connection string already contains `sslmode=...`, that also works.

Optional (ML runtime paths):
```bash
PCOS_PYTHON=python3
PCOS_PREDICT_SCRIPT=dataset/predict.py
PCOS_MODEL_PATH=dataset/pcos_model.joblib
```

### 🔹 Step 3: Install Dependencies
```bash
npm install
```

### 🔹 Step 4: Setup Database Tables
```bash
npm run db:push
```

### 🔹 Step 5: Run the Application
```bash
npm run dev
```

Application runs at: **http://localhost:5000/**  
Health check: **http://localhost:5000/api/health**

---

## 📸 Screenshots
*(I’ll add screenshots here.)*

---

## 🛠️ API Routes
| Route | Method | Description |
|---|---:|---|
| `/api/health` | GET | Health check |
| `/api/auth/register` | POST | Register user (email & password) |
| `/api/auth/login` | POST | Login and create DB-backed session |
| `/api/auth/logout` | POST | Logout and revoke session |
| `/api/auth/user` | GET | Get current authenticated user |
| `/api/assessments` | POST | Submit assessment + save result |
| `/api/assessments/latest` | GET | Fetch latest saved assessment |
| `/api/assessments/:id` | GET | Fetch assessment by ID |
| `/api/profile` | GET/PUT/DELETE | Profile read/update/delete |

---

## 🤖 AI Model Details
- Model Type: **scikit-learn pipeline (Logistic Regression)**
- Output:
	- `pcosProbability` → value between **0 and 1**
	- `pcosLikelihood` → **Unlikely / Possible / Likely**
- Purpose: Early screening support (**not a medical diagnosis**)

---

## 🌍 Deployment
- **Backend + ML:** Render (Docker)
- **Frontend:** Netlify (static) with `/api/*` proxy to Render

Backend verify:
- `https://<your-render-service>.onrender.com/api/health`

---

## 📞 Contact
For questions or collaboration, contact:  
📧 **karrinileshreddy@gmail.com**  
📧 **saimanvitha.chevuru.1@gmail.com**

🔗 GitHub: https://github.com/nileshh-27
🔗 GitHub: https://github.com/Saimanvitha-11

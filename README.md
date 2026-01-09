FemWell-AI-PCOS-Detection

📌 Project Overview

FemWell is an AI-powered web application developed during Forge Alumunus – Inspira 2025 (24-Hour Hackathon).
The platform assists in women’s health screening by analyzing ultrasound images, survey responses, and lab results. It integrates machine learning with a secure web interface to provide early screening insights for conditions such as PCOS.

⚠️ FemWell is a screening tool and not a substitute for professional medical diagnosis.

🛠️ Features

✅ User Authentication
Secure login and registration backed by MongoDB.

✅ Analysis Dashboard
Centralized access to all diagnostic and screening tools.

✅ Ultrasound Image Analysis
AI-based image classification using deep learning models.

✅ Survey-Based Screening
Personalized health survey analysis.

✅ Lab Results Comparison
Hormone-level comparison for enhanced screening accuracy.

✅ Flask Web Application
Smooth and responsive UI built with HTML, CSS, and JavaScript.

🎯 Tech Stack
# Backend
Flask
Express Js
Supabase
scikit-learn
# Frontend
React / Vite
Node Js


📂 Project Structure

FemWell-AI-PCOS-Detection/
│-- client/ # Frontend (React + Vite)
│-- server/ # Backend (Express API)
│-- shared/ # Shared types/schemas (Zod)
│-- dataset/ # ML scripts + model artifacts (predict/train)
│-- Dockerfile # Render deploy (Node + Python)
│-- render.yaml # Render blueprint (optional)
│-- netlify.toml # Netlify config + /api proxy
│-- README.md # Project documentation

🔗 API Routes (Core)

Route	Method	Description
Route	Method	Description
/api/health	GET	Health check
/api/auth/register	POST	Register user (email & password)
/api/auth/login	POST	Login and create DB-backed session
/api/auth/logout	POST	Logout and revoke session
/api/auth/user	GET	Get current authenticated user
/api/assessments	POST	Submit assessment and save result
/api/assessments/latest	GET	Fetch latest saved assessment
/api/assessments/:id	GET	Fetch assessment by ID
/api/profile	GET/PUT/DELETE	Profile read/update/delete

🤖 AI Model Details

Model Type: scikit-learn pipeline (Logistic Regression)
Output:
pcosProbability → value between 0 and 1
pcosLikelihood → Unlikely / Possible / Likely
Purpose: Early screening support (not a medical diagnosis)

# Deployment (Current Setup)

Backend + ML deployed on Render (Docker)
Frontend deployed on Netlify
Netlify proxies /api/* requests to the Render backend
To check if backend is live:
https://<your-render-service>.onrender.com/api/health

For questions, feedback, or collaboration:
📧 karrinileshreddy@gmail.com | 📧 saimanvitha.chevuru.1@gmail.com

FemWell – AI-Powered Women’s Health Analysis

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
Backend

Flask

MongoDB

Frontend

HTML

CSS

JavaScript

AI & ML

TensorFlow

Keras

OpenCV

scikit-learn

Database

MongoDB

📂 Project Structure
FemWell/
│-- static/
│   │-- uploads/         # Uploaded ultrasound images
│   │-- results/         # AI-processed output images
│   │-- styles/          # CSS stylesheets
│
│-- templates/
│   │-- login.html       # User login page
│   │-- register.html    # User registration page
│   │-- analysis.html    # Main dashboard
│   │-- ultrasound.html  # Ultrasound AI analysis page
│
│-- app.py               # Main Flask application
│-- bestmodel.h5         # Pre-trained AI model
│-- requirements.txt     # Python dependencies
│-- README.md            # Project documentation

🔗 API Routes (Core)
Route	Method	Description
/api/auth/register	POST	Register user (email & password)
/api/auth/login	POST	Login and create DB-backed session
/api/auth/logout	POST	Logout and revoke session
/api/auth/user	GET	Get current authenticated user
/api/assessments	POST	Submit assessment and compute ML result
/api/assessments/latest	GET	Fetch latest assessment
/api/assessments/:id	GET	Fetch assessment by ID
/scanner	GET (UI)	Ultrasound report upload interface
🤖 AI Model Details

Model Type: Logistic Regression (scikit-learn pipeline)

Output:

pcosProbability → Value between 0–1

pcosLikelihood → Unlikely / Possible / Likely

Purpose:
Early screening support (not a medical diagnosis)

📞 Contact

For questions, feedback, or collaboration:

📧 karrinileshreddy@gmail.com

📧 saimanvitha.chevuru.1@gmail.com

# Femwell-AI-PCOS-Detection
🚀 FemWell - AI-Powered Women's Health Analysis
📌 Project Overview
FemWell is an AI-powered web application created during Forge Alumunus - Insipira 2025, 24Hr Hackathon, which assists in analyzing ultrasound images, survey responses, and lab results for women's health diagnostics. It features user authentication, a dashboard for different analysis tools, and a deep learning model for ultrasound image classification.

🛠️ Features
✅ User Authentication - Secure login & registration using MongoDB.
✅ Analysis Dashboard - Access different diagnostic tools.
✅ Ultrasound Image Analysis - AI-powered image classification using TensorFlow.
✅ Survey Analysis - Collect and process personalized survey data.
✅ Lab Results Comparison - Compare hormone levels for accurate diagnosis.
✅ Flask Web App - Seamless web interface with HTML, CSS, and JavaScript.

🎯 Tech Stack
Backend: Flask, MongoDB
Frontend: HTML, CSS, JavaScript
AI Model: TensorFlow, Keras, OpenCV
Database: MongoDB

FemWell/
│-- static/
│   │-- uploads/         # Uploaded images
│   │-- results/         # Processed images with AI analysis
│   │-- styles/          # CSS styles
│-- templates/
│   │-- login.html       # User login page
│   │-- register.html    # Registration page
│   │-- analysis.html    # Dashboard
│   │-- ultrasound.html  # Ultrasound AI analysis page
│-- app.py               # Main Flask application
│-- bestmodel.h5         # Pre-trained AI model
│-- requirements.txt     # Python dependencies
│-- README.md            # Project documentation


API Routes (Core)
Route	Method	Description
/api/auth/register	POST	Register with email + password
/api/auth/login	POST	Login and receive DB-backed session cookie
/api/auth/logout	POST	Logout and revoke token
/api/auth/user	GET	Get current authenticated user
/api/assessments	POST	Submit assessment + compute ML screening result
/api/assessments/latest	GET	Get latest assessment
/api/assessments/:id	GET	Get assessment by id
/scanner	GET (UI)	Report Scanner page (upload UI; model later)

🤖 AI Model Details (Current)
Model Type: Logistic Regression (scikit-learn pipeline)
Output: pcosProbability (0–1) + pcosLikelihood (unlikely/possible/likely)
Note: This is a screening tool and not a medical diagnosis.


📞 Contact
For questions or collaboration, contact:
📧 karrinileshreddy@gmail.com
📧 saimanvitha.chevuru.1@gmail.com

🔗 GitHub
🔗 GitHub

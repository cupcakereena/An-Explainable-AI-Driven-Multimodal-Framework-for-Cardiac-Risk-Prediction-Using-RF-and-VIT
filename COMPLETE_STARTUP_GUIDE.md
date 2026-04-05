# 🏥 Cardiac Risk Prediction System - Complete Startup Guide

## Quick Start (Recommended)

### Option 1: PowerShell Script (Best for Windows)

```powershell
# Run this command in PowerShell from the project root:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run the startup script:
.\START_APPLICATION.ps1
```

### Option 2: Batch File

```batch
# Just double-click:
START_APPLICATION.bat

# Or run from Command Prompt:
START_APPLICATION.bat
```

### Option 3: Manual Startup (Step-by-step)

#### Step 1: Open First Terminal (Backend)

```powershell
# In PowerShell, navigate to the project root
cd "C:\Users\reena\Downloads\project sem 08"

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Set environment variables for advanced features
$env:ENABLE_ADVANCED_INSIGHTS='true'
$env:ENABLE_SMART_ENGINE='true'

# Start backend server
cd cardiac_risk_prediction\backend
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

#### Step 2: Open Second Terminal (Frontend)

```powershell
# In a NEW PowerShell window, navigate to frontend
cd "C:\Users\reena\Downloads\project sem 08\cardiac_risk_prediction\frontend"

# Install dependencies (if needed)
npm install

# Start frontend development server
npm start
```

Expected output:
```
Compiled successfully!
On Your Network: http://YOUR-IP:3001
```

---

## Access the Application

Once both servers are running:

| Component | URL | Purpose |
|-----------|-----|---------|
| **Frontend** | http://localhost:3001 | Web UI (React) |
| **Backend API** | http://localhost:5000 | REST API (Flask) |

---

## Complete User Workflow

### 1. **Register/Login** ✅
- Open http://localhost:3001
- Click "Register" to create new account
- Or use existing credentials to login

### 2. **Clinical Data Entry**
- Click **"Clinical Data"** button
- Fill in:
  - Age
  - Gender
  - Blood Pressure (Systolic)
  - Blood Pressure (Diastolic)
  - Cholesterol
  - ECG Results
- Click **"Submit Clinical Data"**

### 3. **Lifestyle Factors**
- Click **"Lifestyle Factors"** button
- Fill in:
  - Smoking Status
  - Alcohol Consumption
  - Physical Activity Level
  - Diet Pattern
  - Stress Level
  - Sleep Duration
- Click **"Submit Lifestyle Data"**

### 4. **Data Validation**
- Click **"Validate Data"** button
- Review all submitted information
- Verify correctness

### 5. **Get Prediction**
- Click **"Get Prediction"** button
- View:
  - **Risk Classification** (High/Low Risk)
  - **Risk Probability %** (tabular + image predictions)
  - **Model Accuracy Score**
  - **SHAP Feature Importance** (top factors affecting your risk)
  - **Preventable Risk %** (how much risk can be reduced)
  - **Biological Age** (cardiac age vs chronological age)
  - **What-If Simulator** (test lifestyle changes)
  - **Personalized Recommendations**

### 6. **Analytics Dashboard** 📊 ⭐ NEW FEATURE
- Click **"Analytics"** button from dashboard navbar
- Switch between two tabs:

#### **Dashboard Analytics Tab:**
- **📊 Pie Chart** - Risk distribution (Low/Medium/High breakdown)
- **📈 Bar Graph** - Patient count by risk category
- **📉 Line Chart** - Risk trend over time
- **KPI Cards:**
  - Total Assessments (count)
  - Average Risk %
  - High Risk Patients (count)
  - Median Risk Trend %

#### **Recommendations Tab:**
- **📋 Clinical Recommendations**
  - Regular cardiac evaluations
  - Blood pressure management
  - Cholesterol monitoring
  - Diabetes control
  - ECG monitoring

- **🏃 Lifestyle Recommendations**
  - Exercise 150 min/week
  - Smoking cessation
  - Alcohol reduction
  - Mediterranean diet
  - Sleep 7-9 hours

- **😌 Mental Health & Stress Management**
- **Risk Stratification Guide** - Table with action items per risk level

### 7. **Export Report**
- Click **"Save Report (PDF)"** button
- Download comprehensive cardiac risk assessment report

---

## Features Overview

✅ **Authentication**
- Secure JWT token-based authentication
- Role-based access control (Doctor/Healthcare Professional)

✅ **Data Collection**
- Separate forms for clinical and lifestyle factors
- Real-time validation

✅ **AI Prediction**
- Random Forest model (tabular data)
- Vision Transformer model (ECG image analysis, if PyTorch installed)
- Ensemble probability combining both models

✅ **Explainability**
- SHAP analysis showing top risk factors
- Feature importance breakdown
- Clinical & lifestyle contribution percentages

✅ **Advanced Insights**
- Preventable risk estimation
- Biological age calculation
- Confidence/uncertainty scoring
- What-If scenario simulator
- Counterfactual suggestions

✅ **Analytics Dashboard**
- Risk distribution visualization (pie chart)
- Patient stratification (bar chart)
- Trend analysis (line chart)
- Personalized recommendations
- Risk stratification guidance

✅ **Report Generation**
- PDF export with all analysis
- Professional formatting
- Shareable with healthcare providers

---

## System Requirements

| Component | Requirement |
|-----------|------------|
| **OS** | Windows 10/11 |
| **Python** | 3.8+ |
| **Node.js** | 14+ |
| **npm** | 6+ |
| **Browser** | Chrome, Firefox, Edge (latest) |

---

## Troubleshooting

### Frontend shows "Loading..." indefinitely

**Solution:**
1. Check backend is running on http://localhost:5000
2. Open browser Developer Console (F12)
3. Check Network tab for failed API requests
4. Ensure Authorization header is being sent

### Backend crashes on startup

**Solution:**
```powershell
# Clean database and caches
rm cardiac_risk_prediction\backend\instance\cardiac_risk.db -ErrorAction SilentlyContinue
rm cardiac_risk_prediction\backend\__pycache__ -Recurse -ErrorAction SilentlyContinue
rm cardiac_risk_prediction\backend\routes\__pycache__ -Recurse -ErrorAction SilentlyContinue
rm cardiac_risk_prediction\backend\utils\__pycache__ -Recurse -ErrorAction SilentlyContinue

# Restart backend
cd cardiac_risk_prediction\backend
python app.py
```

### "ModuleNotFoundError" on backend startup

**Solution:**
```powershell
# Reinstall dependencies
cd cardiac_risk_prediction\backend
pip install -r requirements.txt
python app.py
```

### Analytics shows "Loading..." or error message

**Solution:**
1. Ensure you're logged in (JWT token stored in localStorage)
2. Submit clinical + lifestyle data first
3. Get a prediction first (this populates analytics data)
4. Clear browser cache and refresh (Ctrl+Shift+Delete)
5. Check backend logs for API errors

### ViT Model Warning (PyTorch not installed)

**Note:** This is *not* a blocker. The tabular Random Forest model still works perfectly.

**Optional: Install PyTorch for ECG image analysis:**
```powershell
cd cardiac_risk_prediction\backend
pip install torch torchvision torchaudio
python app.py
```

---

## Environment Variables

The application uses these optional variables:

```bash
ENABLE_ADVANCED_INSIGHTS=true    # Enable advanced features
ENABLE_SMART_ENGINE=true          # Enable smart engine features
```

These are automatically set by the startup scripts.

---

## Database

- **Location:** `cardiac_risk_prediction/backend/instance/cardiac_risk.db`
- **Type:** SQLite
- **Auto-created:** Yes (on first run)
- **Never manually delete** while backend is running

To reset database:
```powershell
rm cardiac_risk_prediction\backend\instance\cardiac_risk.db
# Restart backend - new DB will be created
```

---

## API Endpoints

All endpoints require JWT authentication header:
```
Authorization: Bearer <token>
```

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/data/clinical` | Submit clinical data |
| POST | `/api/data/lifestyle` | Submit lifestyle data |
| POST | `/api/predict/` | Get risk prediction |
| POST | `/api/predict/simulate-risk` | Run What-If simulator |
| GET | `/api/analytics/dashboard-analytics` | Get analytics data |

---

## File Structure

```
project sem 08/
├── cardiac_risk_prediction/
│   ├── backend/
│   │   ├── app.py                 # Flask main app
│   │   ├── models.py              # Database models
│   │   ├── requirements.txt       # Python dependencies
│   │   ├── instance/              # Database (auto-created)
│   │   ├── models/                # Trained ML models
│   │   ├── routes/                # API blueprints
│   │   │   ├── auth.py
│   │   │   ├── data.py
│   │   │   ├── prediction.py
│   │   │   └── dashboard.py       # NEW: Analytics endpoint
│   │   └── utils/                 # Utility modules
│   │       ├── model_loader.py
│   │       ├── vit_model.py
│   │       ├── gradcam.py
│   │       ├── shap_explainer.py
│   │       ├── preventable_risk.py         # NEW
│   │       ├── counterfactual_engine.py    # NEW
│   │       ├── biological_age.py           # NEW
│   │       ├── confidence.py               # NEW
│   │       ├── grouped_shap.py             # NEW
│   │       └── dashboard_analytics.py      # NEW
│   │
│   └── frontend/
│       ├── package.json           # NPM dependencies
│       ├── src/
│       │   ├── App.js             # Main React app
│       │   ├── App.css            # Professional theme
│       │   └── components/
│       │       ├── Login.js
│       │       ├── Register.js
│       │       ├── Dashboard.js
│       │       ├── ClinicalForm.js
│       │       ├── LifestyleForm.js
│       │       ├── DataValidation.js
│       │       ├── PredictionResult.js
│       │       └── AnalyticsDashboard.js   # NEW
│       └── build/                 # Production build (auto-generated)
│
├── START_APPLICATION.ps1          # PowerShell launcher
├── START_APPLICATION.bat          # Batch launcher
└── vit_ecg_model.pth              # Pre-trained ViT model
```

---

## Support & Documentation

For issues or questions:
1. Check backend logs in terminal
2. Check frontend console (F12 Developer Tools)
3. Review this guide's troubleshooting section

---

**Happy Predicting! 🎯**

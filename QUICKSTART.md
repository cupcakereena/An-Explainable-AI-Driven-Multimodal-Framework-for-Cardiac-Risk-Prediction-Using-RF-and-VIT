# Quick Start Guide - Cardiac Risk Prediction System

## System Running Status

✅ **Backend Server**: Running on http://localhost:5000  
✅ **Frontend Server**: Running on http://localhost:3000

---

## Step-by-Step Usage Guide

### 1. **Access the Application**
   - Open your browser and go to: **http://localhost:3000**
   - You should see the login/registration page

### 2. **Create Account or Login**
   - **New User?** Click "Register here"
     - Fill in Username, Email, Password
     - Select Role: Doctor or Healthcare Staff
     - Click "Register"
   
   - **Existing User?** Enter credentials and click "Login"

### 3. **Enter Clinical Data** (Step 1)
   - Click "1. Enter Clinical Data" button
   - Fill in all required fields:
     - Age (years)
     - Sex (Male/Female)
     - Blood Pressure (mmHg)
     - Cholesterol (mg/dL)
     - Fasting Blood Sugar (mg/dL)
     - ECG Results (Normal/ST-T Abnormality/LV Hypertrophy)
     - Maximum Heart Rate (bpm)
     - Chest Pain Type
   - Click "Submit Clinical Data"

### 4. **Enter Lifestyle Data** (Step 2)
   - Click "2. Enter Lifestyle Data" button
   - Fill in all required fields:
     - Smoking Status (Never/Former/Current)
     - Alcohol Consumption (None/Low/Moderate/High)
     - Physical Activity Level (Low/Moderate/High)
     - Diet Pattern (Healthy/Unhealthy)
     - Stress Level (Low/Moderate/High)
     - Sleep Duration (hours)
     - Family History (Yes/No checkbox)
   - Click "Submit Lifestyle Data"

### 5. **Validate Data** (Step 3)
   - Click "3. Validate Data" button
   - System checks if both clinical and lifestyle data are present
   - You should see: "✅ Validation Successful - Clinical and lifestyle data matched successfully"
   - Click "Proceed to Prediction"

### 6. **Get Prediction & Explanation** (Step 4)
   - Click "4. Get Prediction & Explanation" button
   - System displays:
     - **Risk Classification**: High Risk / Low Risk
     - **Risk Probability**: Percentage score (0-100%)
     - **Model Accuracy**: 87%
     - **SHAP Explanation**: Top contributing factors
     - **Personalized Recommendations**: Based on your risk level

---

## Understanding Results

### Low Risk
- Continue preventive measures
- Maintain healthy lifestyle
- Regular health screenings
- Follow recommended activities

### High Risk
- Consult healthcare provider immediately
- Implement lifestyle modifications
- Follow medical recommendations
- Regular monitoring required

---

## Troubleshooting

### **Form Not Submitting?**
- ✅ Check all fields are filled (all required)
- ✅ Verify you're logged in (token in localStorage)
- ✅ Check browser console (F12) for errors
- ✅ Ensure backend is running on port 5000

### **Prediction Failed Error?**
- ✅ Make sure BOTH clinical AND lifestyle data are submitted
- ✅ Go back and fill in any missing data
- ✅ Validate data before prediction

### **Server Not Running?**
- Backend: Run `python app.py` in backend directory
- Frontend: Run `npm start` in frontend directory

---

## API Endpoints (For Reference)

```
Authentication:
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile

Data Collection:
POST   /api/data/clinical     - Submit clinical data
POST   /api/data/lifestyle    - Submit lifestyle data
GET    /api/data/validate     - Validate data completeness

Prediction:
POST   /api/predict/          - Get prediction with SHAP explanation
```

---

## Important Notes

1. **All fields are required** - Cannot submit incomplete forms
2. **Data validation required** - Both forms must be submitted before prediction
3. **JWT Authentication** - Token stored in browser localStorage
4. **SHAP Explainability** - Shows which factors influenced the prediction most
5. **Database** - Data persists in SQLite database (cardiac_risk.db)

---

## Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Review server logs (backend terminal)
3. Verify all data formats are correct
4. Ensure both servers are running
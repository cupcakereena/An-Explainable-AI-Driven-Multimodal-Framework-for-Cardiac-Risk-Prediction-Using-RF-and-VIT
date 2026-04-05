@echo off
echo Starting Cardiac Risk Prediction System...

echo Setting up backend...
cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo Training model (if needed)...
python train_model.py

echo Starting Flask backend...
start cmd /k "python app.py"

cd ..

echo Setting up frontend...
cd frontend

echo Installing Node.js dependencies...
npm install

echo Starting React frontend...
start cmd /k "npm start"

cd ..

echo System is starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause
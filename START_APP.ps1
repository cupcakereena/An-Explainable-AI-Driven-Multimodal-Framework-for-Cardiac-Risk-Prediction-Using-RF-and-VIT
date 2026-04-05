# Cardiac Risk Prediction System - Application Startup
# =====================================================

Write-Host "====================================="
Write-Host "Starting Cardiac Risk Prediction System"
Write-Host "====================================="
Write-Host ""

$projectRoot = "C:\Users\reena\Downloads\project sem 08"

# Set environment variables
$env:ENABLE_ADVANCED_INSIGHTS='true'
$env:ENABLE_SMART_ENGINE='true'
Write-Host "[OK] Environment variables set"

# Start Backend (Flask)
Write-Host ""
Write-Host "Starting Backend Server (Port 5000)..."
$backendCmd = "cd '$projectRoot\cardiac_risk_prediction\backend'; & '$projectRoot\.venv\Scripts\python.exe' app.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
Write-Host "[OK] Backend starting in new window..."

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend (React)
Write-Host "Starting Frontend Server (Port 3001)..."
$frontendCmd = "cd '$projectRoot\cardiac_risk_prediction\frontend'; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd
Write-Host "[OK] Frontend starting in new window..."

Write-Host ""
Write-Host "====================================="
Write-Host "STARTUP COMPLETE"
Write-Host "====================================="
Write-Host ""
Write-Host "Frontend: http://localhost:3001"
Write-Host "Backend:  http://localhost:5000"
Write-Host ""
Write-Host "Your browser should open automatically..."
Write-Host ""

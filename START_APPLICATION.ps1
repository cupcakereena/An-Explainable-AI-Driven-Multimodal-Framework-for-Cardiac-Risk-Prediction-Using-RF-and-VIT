# ============================================================
# Cardiac Risk Prediction System - Full Application Startup
# ============================================================
# This script starts both backend and frontend servers
# ============================================================

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Starting Cardiac Risk Prediction System" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Get the project root directory
$projectRoot = "C:\Users\reena\Downloads\project sem 08"

# Set environment variables for advanced features
$env:ENABLE_ADVANCED_INSIGHTS='true'
$env:ENABLE_SMART_ENGINE='true'
Write-Host "✓ Environment variables set (Advanced insights enabled)" -ForegroundColor Green

# Start Backend Server in a new window
Write-Host ""
Write-Host "Starting Backend Server (Flask on port 5000)..." -ForegroundColor Cyan
$backendScript = @"
Set-Location "$projectRoot"
& "$projectRoot\.venv\Scripts\Activate.ps1"
cd "$projectRoot\cardiac_risk_prediction\backend"
python app.py
"@
$backendScript | Out-File "$projectRoot\temp_backend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$projectRoot\temp_backend.ps1"
Write-Host "✓ Backend server starting..." -ForegroundColor Green

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server in a new window
Write-Host "Starting Frontend Server (React on port 3001)..." -ForegroundColor Cyan
$frontendScript = @"
Set-Location "$projectRoot\cardiac_risk_prediction\frontend"
npm start
"@
$frontendScript | Out-File "$projectRoot\temp_frontend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$projectRoot\temp_frontend.ps1"
Write-Host "✓ Frontend server starting..." -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "APPLICATION STARTUP COMPLETE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 ACCESS YOUR APPLICATION:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Frontend (React UI):  http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Backend API:          http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 GETTING STARTED:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Open http://localhost:3001 in your browser" -ForegroundColor White
Write-Host "  2. Register a new account or use existing credentials" -ForegroundColor White
Write-Host "  3. Click 'Clinical Data' and submit clinical information" -ForegroundColor White
Write-Host "  4. Click 'Lifestyle Factors' and submit lifestyle data" -ForegroundColor White
Write-Host "  5. Click 'Validate Data' to review your entries" -ForegroundColor White
Write-Host "  6. Click 'Get Prediction' to view your risk assessment" -ForegroundColor White
Write-Host "  7. Click 'Analytics' button to see dashboard with:" -ForegroundColor White
Write-Host "     - Pie Chart (Risk Distribution)" -ForegroundColor White
Write-Host "     - Bar Graph (Patient Count by Risk)" -ForegroundColor White
Write-Host "     - Line Chart (Risk Trend Over Time)" -ForegroundColor White
Write-Host "     - Recommendations Tab (Clinical & Lifestyle)" -ForegroundColor White
Write-Host ""
Write-Host "📊 FEATURES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ✓ Secure JWT-based authentication" -ForegroundColor Green
Write-Host "  ✓ Clinical & Lifestyle data collection" -ForegroundColor Green
Write-Host "  ✓ AI-powered risk prediction (Random Forest + Vision Transformer)" -ForegroundColor Green
Write-Host "  ✓ SHAP explainability analysis" -ForegroundColor Green
Write-Host "  ✓ What-If scenario simulator" -ForegroundColor Green
Write-Host "  ✓ Analytics dashboard with charts" -ForegroundColor Green
Write-Host "  ✓ Personalized recommendations" -ForegroundColor Green
Write-Host "  ✓ PDF report export" -ForegroundColor Green
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Both servers are running in separate windows" -ForegroundColor Green
Write-Host "Close either window to stop that server" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Keep this window open
Write-Host "Press any key to exit this launcher (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

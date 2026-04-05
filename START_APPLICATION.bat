@echo off
REM ============================================================
REM Cardiac Risk Prediction System - Quick Start (Windows)
REM ============================================================

echo.
echo =========================================
echo   Cardiac Risk Prediction System Launcher
echo =========================================
echo.

setlocal enabledelayedexpansion

REM Set working directory
cd /d "C:\Users\reena\Downloads\project sem 08"

REM Set environment variables
set ENABLE_ADVANCED_INSIGHTS=true
set ENABLE_SMART_ENGINE=true

echo [OK] Environment variables configured

REM Check if Node is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js/npm not found. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python first.
    pause
    exit /b 1
)

echo.
echo Starting servers...
echo.

REM Start Backend (Flask) in new window
echo [INFO] Launching Backend Server (Port 5000)...
start cmd /k "cd cardiac_risk_prediction\backend && python app.py"

REM Wait a bit for backend to initialize
timeout /t 3 /nobreak

REM Start Frontend (React) in new window
echo [INFO] Launching Frontend Server (Port 3001)...
start cmd /k "cd cardiac_risk_prediction\frontend && npm start"

echo.
echo =========================================
echo   STARTUP SUCCESSFUL
echo =========================================
echo.
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:5000
echo.
echo A browser window will open automatically.
echo.
echo Close each command window to stop that server.
echo.
pause

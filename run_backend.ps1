# Backend setup and run script
# Usage: run this script in its folder or call from run_all.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Create venv if not exists
if (-Not (Test-Path .venv)) {
    Write-Host "Creating virtual environment..."
    python -m venv .venv
}

# Activate venv and upgrade pip
Write-Host "Activating virtual environment and installing dependencies..."
& .\.venv\Scripts\python.exe -m pip install --upgrade pip
& .\.venv\Scripts\pip.exe install -r requirements.txt

# Train tabular model if missing
if ((Test-Path models\cardiac_rf_model.pkl) -and (Test-Path models\scaler.pkl)) {
    Write-Host "Tabular models exist. Skipping training."
} else {
    Write-Host "Training tabular RandomForest model..."
    & .\.venv\Scripts\python.exe train_model.py
}

# Ensure uploads folder exists
if (-Not (Test-Path uploads)) { New-Item -ItemType Directory -Path uploads | Out-Null }

Write-Host "Starting Flask backend (http://localhost:5000) ..."
& .\.venv\Scripts\python.exe app.py

# Keep window open
Read-Host -Prompt "Flask server started. Press Enter to close this window."
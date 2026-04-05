# Run the entire Cardiac Risk Prediction app locally (Windows PowerShell)
# Opens two PowerShell windows: one for backend, one for frontend.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendScript = Join-Path $root 'backend\run_backend.ps1'
$frontendScript = Join-Path $root 'frontend\run_frontend.ps1'

Write-Host "Starting backend in a new PowerShell window..."
Start-Process powershell -ArgumentList "-NoExit","-Command","& '$backendScript'" -WorkingDirectory $root

Start-Sleep -Seconds 2
Write-Host "Starting frontend in a new PowerShell window..."
Start-Process powershell -ArgumentList "-NoExit","-Command","& '$frontendScript'" -WorkingDirectory $root

Write-Host "All processes started. Backend should be available at http://localhost:5000 and frontend at http://localhost:3000"
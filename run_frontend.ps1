# Frontend setup and run script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Installing frontend dependencies (if needed)..."
if (-Not (Test-Path node_modules)) {
    npm install
} else {
    Write-Host "node_modules already present."
}

Write-Host "Starting React dev server (http://localhost:3000)..."
npm start

# Keep window open
Read-Host -Prompt "React dev server started. Press Enter to close this window."
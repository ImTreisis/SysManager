$ErrorActionPreference = 'Stop'

if ($env:OS -ne 'Windows_NT') {
    throw 'Build this executable on Windows. PyInstaller does not cross-compile for other operating systems.'
}

$AgentDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$PythonExecutable = Join-Path $AgentDirectory '.venv\Scripts\python.exe'
$SpecFile = Join-Path $AgentDirectory 'WindowsSystemMonitorAgent.spec'
$ExecutablePath = Join-Path $AgentDirectory 'dist\WindowsSystemMonitorAgent.exe'
$ProjectDirectory = Split-Path -Parent $AgentDirectory
$DownloadDirectory = Join-Path $ProjectDirectory 'frontend\public\downloads'
$DownloadPath = Join-Path $DownloadDirectory 'WindowsSystemMonitorAgent.exe'

if (-not (Test-Path -LiteralPath $PythonExecutable)) {
    throw "The agent virtual environment was not found. Create it and install requirements first: $PythonExecutable"
}

if (-not (Test-Path -LiteralPath $SpecFile)) {
    throw "The PyInstaller configuration was not found: $SpecFile"
}

Push-Location $AgentDirectory
try {
    & $PythonExecutable -m PyInstaller --clean --noconfirm $SpecFile
    if ($LASTEXITCODE -ne 0) {
        throw "PyInstaller failed with exit code $LASTEXITCODE."
    }
} finally {
    Pop-Location
}

if (-not (Test-Path -LiteralPath $ExecutablePath)) {
    throw "PyInstaller finished without creating the expected executable: $ExecutablePath"
}

New-Item -ItemType Directory -Path $DownloadDirectory -Force | Out-Null
Copy-Item -LiteralPath $ExecutablePath -Destination $DownloadPath -Force

Write-Host "Build complete: $ExecutablePath"
Write-Host "Website download updated: $DownloadPath"

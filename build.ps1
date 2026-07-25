# Build script for Windows
# PowerShell

$ErrorActionPreference = "Stop"

Write-Host "Building GeekDown..."

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..."
    npm install
}

# Build frontend
Write-Host "Building frontend..."
npm run build

# Windows build
Write-Host "Building Tauri binary for Windows..."
Set-Location "src-tauri"
cargo build --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build complete!"
    Write-Host "Binary available at: src-tauri/target/release/geekdown.exe"
} else {
    Write-Host "Build failed with exit code: $LASTEXITCODE"
    exit 1
}
# PowerShell script to generate Protocol Buffer files
# Equivalent to proto-gen.sh for Windows

Write-Host "Cleaning up existing generated files..." -ForegroundColor Yellow

# Remove existing randomPackage directory (equivalent to rm -rf ./proto/randomPackage)
$randomPackageDir = ".\proto\randomPackage"
if (Test-Path $randomPackageDir) {
    Remove-Item -Path $randomPackageDir -Recurse -Force
    Write-Host "Removed existing randomPackage directory" -ForegroundColor Yellow
}

Write-Host "Generating Protocol Buffer TypeScript files..." -ForegroundColor Green

# Generate TypeScript files for backend
# Use PowerShell to expand the glob pattern
$protoFiles = Get-ChildItem -Path "proto" -Filter "*.proto" | ForEach-Object { $_.FullName }
if ($protoFiles.Count -eq 0) {
    Write-Host "No .proto files found in proto directory" -ForegroundColor Red
    exit 1
}

Write-Host "Found proto files: $($protoFiles -join ', ')" -ForegroundColor Cyan
yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto/ $protoFiles

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend proto files generated successfully!" -ForegroundColor Green
}
else {
    Write-Host "Error generating backend proto files" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Create frontend proto directory if it doesn't exist
$frontendProtoDir = "..\frontend\src\proto"
if (!(Test-Path $frontendProtoDir)) {
    New-Item -ItemType Directory -Path $frontendProtoDir -Force
    Write-Host "Created frontend proto directory: $frontendProtoDir" -ForegroundColor Yellow
}

Write-Host "Generating JavaScript and gRPC-Web files for frontend..." -ForegroundColor Green

# Generate TypeScript and gRPC-Web files for frontend
# Use PowerShell to expand the glob pattern for protoc
$protoFilesRelative = Get-ChildItem -Path "proto" -Filter "*.proto" | ForEach-Object { "proto/$($_.Name)" }
$protocArgs = @("-I=proto") + $protoFilesRelative + @("--js_out=import_style=commonjs:../frontend/src/proto", "--grpc-web_out=import_style=typescript,mode=grpcwebtext:../frontend/src/proto")

Write-Host "Running protoc with args: $($protocArgs -join ' ')" -ForegroundColor Cyan
& protoc $protocArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend proto files generated successfully!" -ForegroundColor Green
    Write-Host "Protocol Buffer generation completed!" -ForegroundColor Cyan
}
else {
    Write-Host "Error generating frontend proto files" -ForegroundColor Red
    exit $LASTEXITCODE
}

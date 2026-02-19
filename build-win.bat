@echo off
REM Build EGIEdit distributable for Windows (NSIS installer + zip, x64)
REM Run this on a Windows machine for a proper .exe installer.

cd /d "%~dp0"

echo Building EGIEdit for Windows...
call npm run build
call npx electron-builder --win

echo.
echo Done. Output files are in the release\ folder.
dir /b release\*.exe release\*.zip 2>nul

@echo off
setlocal
chcp 65001 >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0platform-module\tools\open_fusion.ps1" %*
set "AB_RESULT=%ERRORLEVEL%"
if not "%AB_RESULT%"=="0" if not "%~1"=="--check" if not "%~1"=="--no-browser" pause
exit /b %AB_RESULT%

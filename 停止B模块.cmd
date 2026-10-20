@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0b-risk-knowledge\tools\stop.ps1"
if errorlevel 1 pause

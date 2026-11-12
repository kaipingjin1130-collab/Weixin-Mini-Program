@echo off
setlocal
cd /d "%~dp0"
python candidate\server.py --host 0.0.0.0 --port 8767
pause

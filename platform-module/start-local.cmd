@echo off
setlocal
cd /d "%~dp0"
python candidate\server.py --host 127.0.0.1 --port 8767
pause

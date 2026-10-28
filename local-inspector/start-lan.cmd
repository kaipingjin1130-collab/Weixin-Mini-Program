@echo off
setlocal
cd /d "%~dp0"
echo Quality Safety Inspector
echo Local URL: http://127.0.0.1:8765/work
echo Password file: data\local-password.txt
echo Keep this window open while using the app.
where python >nul 2>nul
if errorlevel 1 goto use_py
python server.py --host 0.0.0.0 --port 8765
goto finished
:use_py
py -3 server.py --host 0.0.0.0 --port 8765
:finished
echo.
echo Server stopped. If an error appears above, send a screenshot.
pause

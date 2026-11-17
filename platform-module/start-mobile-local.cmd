@echo off
setlocal
cd /d "%~dp0"
set "QAXC_DATA=%~dp0..\.local\mobile-workflow-data"
set "QAXC_DB_URL="
set "QAXC_AUTH_URL="
set "QAXC_AUTH_KEY="
set "QAXC_ROOT_PATH="
set "QAXC_WM_URL="
set "QAXC_WM_BRIDGE_KEY="
set "QAXC_WECHAT_APP_ID="
set "QAXC_WECHAT_APP_SECRET="
set "QAXC_PASSWORD="
python candidate\server.py --host 127.0.0.1 --port 18817
pause

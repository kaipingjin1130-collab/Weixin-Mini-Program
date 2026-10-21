@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动质量安全小察。本地地址 http://127.0.0.1:8765
echo 首次启动后，请用记事本打开 data\local-password.txt 查看登录密码。
python server.py --host 127.0.0.1 --port 8765
pause

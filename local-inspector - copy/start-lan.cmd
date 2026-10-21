@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 局域网调试模式：手机和电脑需在同一可信网络。
echo 密码在 data\local-password.txt。此模式为开发调试，请勿映射到公网。
echo 在另一个终端运行 ipconfig，查找电脑的 IPv4 地址。
python server.py --host 0.0.0.0 --port 8765
pause

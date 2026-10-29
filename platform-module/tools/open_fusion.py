"""Windows one-click launcher for the isolated ABversion preview only."""
import argparse
import ctypes
import json
import msvcrt
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import time
from urllib.parse import urlsplit

import httpx

ROOT = Path(__file__).resolve().parents[2]
LOCAL = ROOT / '.local/fusion-integration'
CONFIG = ROOT / 'b-risk-knowledge/.local/config.json'
RUNTIME = ROOT / 'platform-module/tools/fusion_runtime.py'
URL = 'http://127.0.0.1:18771/quality/'
CONTAINER = 'qaxc-fusion-test-postgres'
HIDDEN = subprocess.CREATE_NO_WINDOW


def say(message):
    print(message, flush=True)


def run(args, *, env=None, timeout=25):
    return subprocess.run(args, cwd=ROOT, env=env, capture_output=True,
        text=True, encoding='utf-8', errors='replace', timeout=timeout, creationflags=HIDDEN)


def configured_environment():
    if not CONFIG.is_file():
        raise RuntimeError('缺少本地融合数据库配置，请先完成项目的本机初始化。')
    data = json.loads(CONFIG.read_text(encoding='utf-8'))
    target = urlsplit(data['database_url'])
    if (target.scheme, target.hostname, target.port, target.path, target.username) != ('postgresql+psycopg', '127.0.0.1', 55447, '/fusion', 'fusion'):
        raise RuntimeError('当前数据库不是独立融合测试库，已停止，避免影响其他人的联调。')
    storage = Path(data['storage']).resolve()
    if not storage.is_relative_to((ROOT / 'b-risk-knowledge/.local').resolve()):
        raise RuntimeError('存储位置不是本项目测试目录，已停止启动。')
    for relative in ('platform-module/b-web/embedded/knowledge.js', 'platform-module/b-web/embedded/knowledge.css'):
        if not (ROOT / relative).is_file():
            raise RuntimeError('缺少网页构建资源，请先运行 platform-module/build_frontend.py。')
    env = dict(os.environ)
    env.update(B_DATABASE_URL=data['database_url'], B_STORAGE=str(storage), B_ENV='development',
        B_AUTH_MODE='a', PYTHONUTF8='1', PYTHONUNBUFFERED='1')
    return env


def ensure_database(docker):
    probe = run([docker, 'info', '--format', '{{.ServerVersion}}'])
    if probe.returncode and 'permission denied' in probe.stderr.lower():
        raise RuntimeError('当前进程仍无权访问 Docker。请保留错误信息以检查 Windows 进程权限；启动器未重启或替换其他服务。')
    if probe.returncode:
        desktop = Path(docker).resolve().parents[2] / 'Docker Desktop.exe'
        if not desktop.is_file():
            raise RuntimeError('Docker 尚未运行，请先启动 Docker Desktop，再双击本文件。')
        say('正在启动 Docker Desktop，请稍候…')
        startup = subprocess.STARTUPINFO()
        startup.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startup.wShowWindow = subprocess.SW_HIDE
        subprocess.Popen([str(desktop)], startupinfo=startup, creationflags=HIDDEN,
                         stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(30):
            time.sleep(2)
            if run([docker, 'info', '--format', '{{.ServerVersion}}'], timeout=8).returncode == 0:
                break
        else:
            raise RuntimeError('Docker 启动尚未完成，请等待其就绪后再次双击。')
    found = run([docker, 'inspect', CONTAINER])
    if found.returncode:
        raise RuntimeError('缺少专用融合测试数据库容器，请先完成本机初始化；不会使用其他数据库。')
    item = json.loads(found.stdout)[0]
    if item['Config'].get('Labels', {}).get('com.qaxc.purpose') != 'fusion-test':
        raise RuntimeError('数据库容器标识不符，已停止启动。')
    if not item['State']['Running']:
        say('正在启动融合测试数据库…')
        if run([docker, 'start', CONTAINER]).returncode:
            raise RuntimeError('专用数据库启动失败，请在 Docker Desktop 检查。')
    for _ in range(20):
        if run([docker, 'exec', CONTAINER, 'pg_isready', '-U', 'fusion', '-d', 'fusion']).returncode == 0:
            return
        time.sleep(1)
    raise RuntimeError('数据库尚未就绪，请稍后再试。')


def health():
    keys = LOCAL / 'keys.json'
    if not keys.is_file():
        return None
    key = json.loads(keys.read_text(encoding='utf-8'))['a']
    try:
        response = httpx.get('http://127.0.0.1:18771/__knowledge/api/v1/health',
            headers={'Authorization': 'Bearer ' + key}, timeout=3, trust_env=False)
        if response.status_code == 200:
            data = response.json()
            if data.get('app') == 'risk-b01' and data.get('auth_mode') == 'a' and data.get('environment') == 'development':
                return data
    except (httpx.HTTPError, ValueError):
        pass
    return None


def alive(pid):
    kernel = ctypes.WinDLL('kernel32', use_last_error=True)
    kernel.OpenProcess.restype = ctypes.c_void_p
    handle = kernel.OpenProcess(0x1000, False, int(pid))
    if not handle:
        return False
    try:
        code = ctypes.c_ulong()
        return bool(kernel.GetExitCodeProcess(ctypes.c_void_p(handle), ctypes.byref(code))) and code.value == 259
    finally:
        kernel.CloseHandle(ctypes.c_void_p(handle))


def start(mode, env):
    record = LOCAL / ('launcher-' + mode + '.json')
    if record.is_file():
        previous = json.loads(record.read_text(encoding='utf-8'))
        if alive(previous['pid']):
            return  # Wait for its health rather than starting a duplicate.
    with (LOCAL / ('launcher-' + mode + '.log')).open('w', encoding='utf-8') as log:
        process = subprocess.Popen([sys.executable, str(RUNTIME), mode], cwd=ROOT, env=env,
            stdin=subprocess.DEVNULL, stdout=log, stderr=log,
            creationflags=HIDDEN | subprocess.CREATE_NEW_PROCESS_GROUP)
    record.write_text(json.dumps({'pid':process.pid}), encoding='utf-8')


def open_browser():
    candidates = [Path(base) / suffix
        for base in (os.environ.get('PROGRAMFILES',''), os.environ.get('PROGRAMFILES(X86)',''), os.environ.get('LOCALAPPDATA',''))
        if base
        for suffix in ('Google/Chrome/Application/chrome.exe', 'Microsoft/Edge/Application/msedge.exe')]
    browser = next((p for p in candidates if p.is_file()), None)
    if not browser:
        raise RuntimeError('服务已启动，但未找到 Chrome 或 Edge；请用独立浏览器配置打开上方地址。')
    # Cookies are not port-scoped. A dedicated profile protects any parallel A
    # debugging session on another localhost port from being logged out.
    subprocess.Popen([str(browser), '--user-data-dir=' + str(LOCAL / 'browser'),
        '--no-first-run', '--no-default-browser-check', '--app=' + URL],
        stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)


def open_platform(env, no_browser):
    current = health()
    if not current:
        docker = shutil.which('docker')
        if not docker:
            raise RuntimeError('找不到 Docker Desktop，请确认它已经安装。')
        ensure_database(docker)
        with socket.socket() as probe:
            probe.settimeout(1)
            occupied = probe.connect_ex(('127.0.0.1', 18771)) == 0
        if occupied:
            raise RuntimeError('18771 端口已被占用，且不是本次融合服务；未停止或替换该服务。')
        say('正在准备并启动 ABversion…')
        initialized = run([sys.executable, str(RUNTIME), 'init'], env=env, timeout=90)
        if initialized.returncode:
            (LOCAL / 'launcher-init.log').write_text(initialized.stdout + initialized.stderr, encoding='utf-8')
            raise RuntimeError('初始化失败，请查看 .local/fusion-integration/launcher-init.log。')
        start('unified', env)
        for _ in range(30):
            current = health()
            if current:
                break
            time.sleep(1)
        else:
            raise RuntimeError('网页服务未就绪，请查看 .local/fusion-integration/launcher-unified.log。')
    if not current['worker_online']:
        say('正在启动后台处理服务…')
        start('worker', env)
        for _ in range(30):
            current = health()
            if current and current['worker_online']:
                break
            time.sleep(1)
        else:
            raise RuntimeError('后台服务未就绪，请查看 .local/fusion-integration/launcher-worker.log。')
    say('ABversion 已就绪：' + URL)
    say('本地测试版会自动进入管理员工作台，无需输入账号密码。')
    say('关闭本窗口不会停止后台服务。再次双击会复用已运行的服务。')
    if not no_browser:
        open_browser()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Validate paths/config only; do not start services.')
    parser.add_argument('--no-browser', action='store_true', help='Start/check services without opening a browser.')
    args = parser.parse_args()
    env = configured_environment()
    if args.check:
        say('ABversion 启动配置检查通过。此检查未启动服务。')
        return
    LOCAL.mkdir(parents=True, exist_ok=True)
    with (LOCAL / 'launcher.lock').open('a+b') as lock:
        lock.seek(0)
        if not lock.read(1):
            lock.write(b'0'); lock.flush()
        lock.seek(0)
        try:
            msvcrt.locking(lock.fileno(), msvcrt.LK_NBLCK, 1)
        except OSError:
            say('另一个启动窗口正在处理，请等待它完成。')
            return
        try:
            open_platform(env, args.no_browser)
        finally:
            lock.seek(0)
            msvcrt.locking(lock.fileno(), msvcrt.LK_UNLCK, 1)


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        # Never print database URLs, service tokens, or child command lines.
        say(str(exc) if isinstance(exc, RuntimeError) else '启动失败（' + type(exc).__name__ + '），请检查本机环境后重试。')
        raise SystemExit(1)

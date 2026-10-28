"""Build frontend and copy deployable static assets alongside platform source."""
from pathlib import Path
import shutil
import subprocess
import sys

root=Path(__file__).resolve().parents[1]
frontend=root/'b-risk-knowledge/frontend'
pnpm=shutil.which('pnpm.cmd' if sys.platform=='win32' else 'pnpm')
if not pnpm:
    raise SystemExit('Install Node.js and pnpm first.')
subprocess.run([pnpm,'install','--frozen-lockfile'],cwd=frontend,check=True)
subprocess.run([pnpm,'run','build'],cwd=frontend,check=True)
shutil.copytree(frontend/'dist',root/'platform-module/b-web',dirs_exist_ok=True)
print('Deployable frontend: platform-module/b-web')

param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $root
$python = Join-Path $root '.venv\Scripts\python.exe'
$local = Join-Path $root '.local'
$logs = Join-Path $local 'logs'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
try {
    if (!(Test-Path -LiteralPath $python)) { throw 'Install requirements into .venv first. See README.md.' }
    & $python tools/bootstrap.py --config-only
    if ($LASTEXITCODE -ne 0) { throw 'Local configuration failed.' }
    docker info --format '{{.ServerVersion}}' 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Start Docker Desktop, then retry.' }
    $containerNames = @(docker ps -a --format '{{.Names}}')
    & (Join-Path $PSScriptRoot 'ensure-vector.ps1')
    if ($containerNames -notcontains 'risk-b01-postgres') {
        # ensure-vector.ps1 already created the dedicated container.
        if ($LASTEXITCODE -ne 0) { throw 'Could not create the dedicated database container.' }
    }
    $container = docker inspect risk-b01-postgres | ConvertFrom-Json
    if ($container[0].Config.Labels.'com.riskb.project' -ne 'B01') { throw 'Container ownership mismatch.' }
    docker start risk-b01-postgres | Out-Null
    $databaseReady = $false
    for ($i=0; $i -lt 30; $i++) {
        docker exec risk-b01-postgres pg_isready -U risk_b -d risk_b | Out-Null
        if ($LASTEXITCODE -eq 0) { $databaseReady=$true; break }
        Start-Sleep -Seconds 1
    }
    if (!$databaseReady) { throw 'Database did not become ready.' }
    & $python -m alembic upgrade head
    if ($LASTEXITCODE -ne 0) { throw 'Database migration failed.' }
    & $python -m backend.initialize
    if ($LASTEXITCODE -ne 0) { throw 'Database initialization failed.' }
    $statePath = Join-Path $local 'processes.json'
    $states = @()
    if (Test-Path -LiteralPath $statePath) {
        $states = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
    }
    function Start-Owned($name, $exe, $arguments, $directory, $port = 0) {
        $prior = $states | Where-Object { $_.name -eq $name } | Select-Object -Last 1
        if ($prior) {
            $existing = Get-CimInstance Win32_Process -Filter "ProcessId=$($prior.pid)"
            if ($existing -and $existing.CreationDate.ToUniversalTime().Ticks.ToString() -eq $prior.created -and $existing.ExecutablePath -eq $prior.exe) { return }
        }
        if ($port -and (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)) {
            throw "Port $port is occupied by an untracked process. Close it or use the existing project launcher."
        }
        $p = Start-Process -FilePath $exe -ArgumentList $arguments -WorkingDirectory $directory -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs "$name.out.log") -RedirectStandardError (Join-Path $logs "$name.err.log")
        $identity = Get-CimInstance Win32_Process -Filter "ProcessId=$($p.Id)"
        if (!$identity) { throw "$name exited before its process could be recorded. Check logs." }
        $script:states = @($states | Where-Object { $_.name -ne $name }) + @{name=$name;pid=$p.Id;created=$identity.CreationDate.ToUniversalTime().Ticks.ToString();exe=$identity.ExecutablePath}
        $script:states | ConvertTo-Json | Set-Content -LiteralPath $statePath -Encoding UTF8
    }
    Start-Owned 'api' $python '-m uvicorn backend.app:app --host 127.0.0.1 --port 8181' $root 8181
    Start-Owned 'worker' $python '-m backend.worker' $root
    $node = (Get-Command node.exe -ErrorAction Stop).Source
    Start-Owned 'frontend' $node 'node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5181 --strictPort' (Join-Path $root 'frontend') 5181
    $ready = $false
    for ($i=0; $i -lt 40; $i++) {
        try {
            $health = Invoke-RestMethod 'http://127.0.0.1:8181/api/v1/health' -TimeoutSec 2
            $page = Invoke-WebRequest 'http://127.0.0.1:5181/workbench' -UseBasicParsing -TimeoutSec 2
            if ($health.app -eq 'risk-b01' -and $health.worker_online -and $page.StatusCode -eq 200) { $ready=$true; break }
        } catch {}
        Start-Sleep -Seconds 1
    }
    if (!$ready) { throw "Services did not become ready. Check .local/logs." }
    Write-Host 'B06 ready: http://127.0.0.1:5181/retrospectives'
    if (!$NoBrowser) { Start-Process 'http://127.0.0.1:5181/workbench' }
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

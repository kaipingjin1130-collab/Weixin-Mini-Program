$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$statePath = Join-Path $root '.local\processes.json'
if (Test-Path -LiteralPath $statePath) {
    $states = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($entry in $states) {
        $p = Get-CimInstance Win32_Process -Filter "ProcessId=$($entry.pid)"
        if ($p -and $p.CreationDate.ToUniversalTime().Ticks.ToString() -eq $entry.created -and $p.ExecutablePath -eq $entry.exe) {
            taskkill /PID $p.ProcessId /T /F | Out-Null
            if ($LASTEXITCODE -ne 0) { throw "Could not stop $($entry.name)." }
        } elseif ($p) {
            throw "Process identity changed for $($entry.name). No process was stopped."
        }
    }
    Remove-Item -LiteralPath $statePath
}
Write-Host 'B01 application services stopped. Database retained.'

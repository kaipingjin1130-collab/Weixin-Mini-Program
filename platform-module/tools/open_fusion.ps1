# Use the installed interpreter referenced by pyvenv.cfg, with the existing
# environment's dependencies. The venv redirector on this machine runs at low
# integrity and cannot access Docker's named pipe. Do not change machine ACLs.
$ErrorActionPreference = 'Stop'
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$candidates = @()
if ($env:ABVERSION_PYTHON) { $candidates += $env:ABVERSION_PYTHON }
$candidates += (Join-Path $repoRoot '..\..\b-risk-knowledge\.venv\Scripts\python.exe')
$candidates += (Join-Path $repoRoot 'b-risk-knowledge\.venv\Scripts\python.exe')
$selectedPython = $candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
if (-not $selectedPython) {
    Write-Host 'Project Python environment not found. Set ABVERSION_PYTHON to its python.exe.'
    exit 1
}
$selectedPython = (Resolve-Path -LiteralPath $selectedPython).Path
$venvRoot = Split-Path (Split-Path $selectedPython -Parent) -Parent
$venvConfig = Join-Path $venvRoot 'pyvenv.cfg'
if (Test-Path -LiteralPath $venvConfig -PathType Leaf) {
    $config = Get-Content -LiteralPath $venvConfig -Raw -Encoding UTF8
    $match = [regex]::Match($config, '(?m)^home\s*=\s*(.+?)\r?$')
    if (-not $match.Success) { throw 'Cannot find Python home in pyvenv.cfg.' }
    $basePython = Join-Path $match.Groups[1].Value.Trim() 'python.exe'
    $sitePackages = Join-Path $venvRoot 'Lib\site-packages'
    if (-not (Test-Path -LiteralPath $basePython -PathType Leaf)) { throw 'The original Python installation is missing.' }
    if (-not (Test-Path -LiteralPath $sitePackages -PathType Container)) { throw 'Project dependencies are missing.' }
    $selectedPython = $basePython
    $env:PYTHONPATH = $sitePackages
}
$env:PYTHONUTF8 = '1'
$env:PYTHONNOUSERSITE = '1'
& $selectedPython (Join-Path $PSScriptRoot 'open_fusion.py') @args
exit $LASTEXITCODE

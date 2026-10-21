param([switch]$Install)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$wheelRoot = Join-Path $root '.local\dependency-wheels'
New-Item -ItemType Directory -Path $wheelRoot -Force | Out-Null
# Project-only fallback when pip's HTTP transport stalls on this Windows host.
$packages = @('pgvector','numpy','jieba','jsonschema','referencing','rpds-py','jsonschema-specifications','setuptools','wheel')
$downloaded = @()
$pins = Get-Content -LiteralPath (Join-Path $root 'requirements.txt') -Encoding UTF8
foreach ($name in $packages) {
    $pin = $pins | Where-Object { $_ -match ('^' + [regex]::Escape($name) + '==') } | Select-Object -First 1
    if (!$pin) { throw "No locked dependency version: $name" }
    $version = ($pin -split '==')[1].Trim()
    $url = "https://pypi.org/pypi/$name/$version/json"
    $metadata = Invoke-RestMethod -Uri $url -TimeoutSec 25
    $asset = $metadata.urls | Where-Object { $_.filename -match 'cp312-cp312-win_amd64.whl$|cp312-abi3-win_amd64.whl$|py3-none-any.whl$|py2.py3-none-any.whl$' } | Select-Object -First 1
    if (!$asset -and $name -eq 'jieba') { $asset = $metadata.urls | Where-Object { $_.filename -like '*.tar.gz' } | Select-Object -First 1 }
    if (!$asset) { throw "No compatible wheel for $name" }
    $target = Join-Path $wheelRoot $asset.filename
    if (!(Test-Path -LiteralPath $target)) { Invoke-WebRequest -Uri $asset.url -OutFile $target -TimeoutSec 60 }
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant() -ne $asset.digests.sha256) { throw "Checksum mismatch: $name" }
    $downloaded += $target
    Write-Host "$name $($metadata.info.version): checksum verified"
}
if ($Install) {
    $python = Join-Path $root '.venv\Scripts\python.exe'
    & $python -m pip --cache-dir (Join-Path $wheelRoot 'cache') install --no-index --no-deps ($downloaded | Where-Object { $_ -like '*setuptools-*' }) ($downloaded | Where-Object { $_ -like '*wheel-*' })
    if ($LASTEXITCODE -ne 0) { throw 'Build helpers installation failed.' }
    & $python -m pip --cache-dir (Join-Path $wheelRoot 'cache') install --no-index --no-build-isolation --no-deps @downloaded
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}

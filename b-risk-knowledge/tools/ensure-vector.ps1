$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$image = 'pgvector/pgvector:0.8.7-pg15-trixie'
$name = 'risk-b01-postgres'
$names = @(docker ps -a --format '{{.Names}}')
if ($LASTEXITCODE -ne 0) { throw 'Docker is unavailable.' }
if ($names -notcontains $name) {
    docker run -d --name $name --label com.riskb.project=B01 --env-file (Join-Path $root '.local\postgres.env') -p 127.0.0.1:55439:5432 -v risk-b01-pgdata:/var/lib/postgresql/data $image | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Could not create pgvector database.' }
    return
}
$info = docker inspect $name | ConvertFrom-Json
if ($info[0].Config.Labels.'com.riskb.project' -ne 'B01') { throw 'Container ownership mismatch.' }
docker start $name | Out-Null
for ($i=0;$i -lt 30;$i++) {
    docker exec $name pg_isready -U risk_b -d risk_b 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep -Seconds 1
}
$available = docker exec $name psql -U risk_b -d risk_b -Atc "SELECT count(*) FROM pg_available_extensions WHERE name='vector'"
if ($LASTEXITCODE -eq 0 -and $available.Trim() -eq '1') { return }
if ($info[0].Config.Image -ne 'postgres:15') { throw 'Unexpected database image; automatic upgrade refused.' }
$volume = @($info[0].Mounts | Where-Object { $_.Name -eq 'risk-b01-pgdata' -and $_.Destination -eq '/var/lib/postgresql/data' -and $_.Type -eq 'volume' })
if ($volume.Count -ne 1) { throw 'Unexpected data volume; automatic upgrade refused.' }
$previous = 'risk-b01-postgres-before-b04'
if ($names -contains $previous) { throw 'A previous migration container exists; inspect before continuing.' }
docker pull $image
if ($LASTEXITCODE -ne 0) { throw 'Could not fetch pgvector image.' }
$countSql = "SELECT 'records',count(*) FROM source_records UNION ALL SELECT 'knowledge',count(*) FROM knowledge_items;"
$before = @(docker exec $name psql -U risk_b -d risk_b -Atc $countSql)
if ($LASTEXITCODE -ne 0) { throw 'Pre-upgrade record check failed.' }
# Keep one stopped configuration rollback until the same named volume validates.
docker stop $name | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Could not stop project database.' }
docker rename $name $previous
if ($LASTEXITCODE -ne 0) { throw 'Could not retain container configuration.' }
try {
    docker run -d --name $name --label com.riskb.project=B01 --env-file (Join-Path $root '.local\postgres.env') -p 127.0.0.1:55439:5432 -v risk-b01-pgdata:/var/lib/postgresql/data $image | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'New database container failed.' }
    $ready = $false
    for ($i=0;$i -lt 30;$i++) {
        docker exec $name pg_isready -U risk_b -d risk_b 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $ready=$true;break }
        Start-Sleep -Seconds 1
    }
    if (!$ready) { throw 'New database did not become ready.' }
    $after = @(docker exec $name psql -U risk_b -d risk_b -Atc $countSql)
    if ($LASTEXITCODE -ne 0 -or [string]::Join('|',$before) -ne [string]::Join('|',$after)) { throw 'Record counts differ after upgrade.' }
    docker exec $name psql -U risk_b -d risk_b -v ON_ERROR_STOP=1 -c 'CREATE EXTENSION IF NOT EXISTS vector;' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Vector extension unavailable.' }
    docker rm $previous | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Could not remove superseded container configuration.' }
    Write-Host 'Dedicated database upgraded; volume and record counts preserved.'
} catch {
    docker stop $name 2>$null | Out-Null
    docker rm $name 2>$null | Out-Null
    docker rename $previous $name
    docker start $name | Out-Null
    throw
}

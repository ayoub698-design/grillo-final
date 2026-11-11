# Segment screenshots of one page (reduced motion, eager images, scrolled via ?scroll=N).
# Usage: powershell -File scripts\seg.ps1 -Dir trace -Page index.html -Total 9000 [-Step 1800] [-Width 1440]
param([string]$Dir, [string]$Page = 'index.html', [int]$Total = 6000, [int]$Step = 1800, [int]$Width = 1440)
$root = Split-Path -Parent $PSScriptRoot
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$out = Join-Path $root "scripts\_shots\seg-$Dir"
New-Item -ItemType Directory -Force $out | Out-Null
$name = ($Page -replace '[^a-zA-Z0-9]+', '-').Trim('-')
$base = 'file:///' + ((Join-Path $root "dist\$Dir\$Page") -replace '\\', '/')
for ($y = 0; $y -lt $Total; $y += $Step) {
  $prof = Join-Path $env:TEMP ('edge-seg-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
  $file = Join-Path $out ("$name-{0:D5}.png" -f $y)
  $url = $base + '?scroll=' + $y
  $a = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', "--user-data-dir=$prof", "--window-size=$Width,$Step", '--virtual-time-budget=9000', '--force-prefers-reduced-motion', "--screenshot=$file", $url)
  Start-Process -FilePath $edge -ArgumentList $a -Wait -NoNewWindow -RedirectStandardError (Join-Path $env:TEMP 'edge-seg-err.txt')
  Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue
  $file
}

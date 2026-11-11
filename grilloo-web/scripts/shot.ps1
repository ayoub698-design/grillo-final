# Captures d'écran headless (Edge) d'un serveur local.
# Usage : powershell -File scripts\shot.ps1 -Base http://localhost:3101 -Out <dossier> -Pages '/galerie/|1440x900','/galerie/produits/|1440x2000'
#   -Reduce : force prefers-reduced-motion (les éléments révélés au scroll s'affichent tout de suite).
# Largeur < 500 px : peu fiable en headless ; pour le mobile, utiliser -Mobile (capture dans une iframe de 390 px).
param([string]$Base = 'http://localhost:3000', [string]$Out, [string[]]$Pages, [switch]$Reduce, [switch]$Mobile)
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$prof = Join-Path $env:TEMP ('edge-shot-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Force $Out | Out-Null
foreach ($p in $Pages) {
  $path, $size = $p.Split('|'); $w, $h = $size.Split('x')
  $name = (($path -replace '[^a-zA-Z0-9]+', '-').Trim('-')) ; if (-not $name) { $name = 'root' }
  $file = Join-Path $Out "$name-$w.png"
  $url = "$Base$path"; if ($url.Contains('?')) { $url += '&eager' } else { $url += '?eager' }
  if ($Mobile) {
    $wrap = Join-Path $Out "_m-$name.html"
    Set-Content $wrap "<!doctype html><body style='margin:0'><iframe src='$url' style='width:390px;height:${h}px;border:0'></iframe></body>" -Encoding UTF8
    $url = 'file:///' + ($wrap -replace '\\', '/'); $w = 400
  }
  $a = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', "--user-data-dir=$prof", "--window-size=$w,$h", '--virtual-time-budget=12000', '--blink-settings=lazyLoadEnabled=false', "--screenshot=$file")
  if ($Reduce) { $a += '--force-prefers-reduced-motion' }
  $a += $url
  Start-Process -FilePath $edge -ArgumentList $a -Wait -NoNewWindow -RedirectStandardError (Join-Path $env:TEMP 'edge-shot-err.txt')
  $file
}
Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue

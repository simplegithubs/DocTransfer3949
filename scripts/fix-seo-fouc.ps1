# Fix all pre-rendered SEO pages in dist/ to hide the article content
# This prevents the flash of unstyled content (FOUC) on all pages

$distDir = Join-Path $PSScriptRoot ".." "dist"
$files = Get-ChildItem -Path $distDir -Recurse -Filter "index.html"
$fixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Match pattern: <div id="root"><article>...</article></div>
    # But NOT already fixed ones that have seo-fallback
    if ($content -match '<div id="root"><article>' -and $content -notmatch 'seo-fallback') {
        $content = $content -replace '<div id="root"><article>', '<div id="root"><div class="seo-fallback" style="display:none"><article>'
        $content = $content -replace '</article></div>', '</article></div></div>'
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixed++
        Write-Host "Fixed: $($file.FullName)"
    }
    # Also match the multi-line pattern from the homepage
    elseif ($content -match '<div id="root">\s*\n\s*<article>' -and $content -notmatch 'seo-fallback') {
        $content = $content -replace '(<div id="root">)\s*\n(\s*<article>)', '$1<div class="seo-fallback" style="display:none">$2'
        $content = $content -replace '(</article>)(</div>)', '$1</div>$2'
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixed++
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "`nTotal files fixed: $fixed"

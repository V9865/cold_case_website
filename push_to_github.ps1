$git = "C:\Program Files\Git\cmd\git.exe"

# ══════════════════════════════════════════════════════════
#  UPDATE THIS with your actual GitHub repo URL:
$REPO_URL = "https://github.com/vijaysimhareddy-g/cold-case-deploy.git"
# ══════════════════════════════════════════════════════════

Write-Host "=== Initializing Git ===" -ForegroundColor Cyan
& $git init

Write-Host "=== Configuring user ===" -ForegroundColor Cyan
& $git config user.name "vijaysimhareddy-g"
& $git config user.email "vijaysimhareddy@users.noreply.github.com"

Write-Host "=== Staging all files ===" -ForegroundColor Cyan
& $git add -A

Write-Host "=== Committing ===" -ForegroundColor Cyan
& $git commit -m "Cold Case Vegas - deployment-ready version"

Write-Host "=== Renaming branch to main ===" -ForegroundColor Cyan
& $git branch -M main

Write-Host "=== Adding remote ===" -ForegroundColor Cyan
& $git remote add origin $REPO_URL

Write-Host "=== Pushing to GitHub ===" -ForegroundColor Cyan
& $git push -u origin main

Write-Host ""
Write-Host "=== DONE! Pushed to $REPO_URL ===" -ForegroundColor Green
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

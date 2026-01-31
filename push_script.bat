@echo off
set REPO_URL=https://github.com/amanyatan/CLOUD-.git
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main -f

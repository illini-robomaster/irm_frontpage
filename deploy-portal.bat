@echo off
REM Quick deployment script for RoboMaster Portal
REM This will open Git Bash and execute the deployment

echo ========================================
echo RoboMaster 2026 Portal Deployment
echo ========================================
echo.
echo This will:
echo 1. Add all portal files to git
echo 2. Commit with detailed message
echo 3. Push to GitHub
echo 4. Auto-deploy to illinirobomaster.com in ~5 minutes
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

REM Try to find Git Bash
set GITBASH=

if exist "C:\Program Files\Git\bin\bash.exe" (
    set GITBASH=C:\Program Files\Git\bin\bash.exe
) else if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
    set GITBASH=C:\Program Files (x86)\Git\bin\bash.exe
) else (
    echo ERROR: Git Bash not found!
    echo Please install Git from https://git-scm.com/download/win
    echo Or run deploy-portal.sh manually in Git Bash
    pause
    exit /b 1
)

echo.
echo Starting deployment with Git Bash...
echo.

REM Run the shell script
"%GITBASH%" deploy-portal.sh

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Next steps:
echo 1. Your changes will appear on illinirobomaster.com in ~5 minutes
echo 2. See DEPLOYMENT_GUIDE.md for backend server setup
echo.
pause

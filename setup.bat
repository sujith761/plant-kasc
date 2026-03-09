@echo off
echo ========================================
echo Plant Disease Prediction - Quick Setup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo [OK] Python found:
python --version

echo.
echo ========================================
echo Setting up Backend...
echo ========================================

cd backend
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)
echo Installing dependencies...
call npm install
cd ..

echo.
echo ========================================
echo Setting up Frontend...
echo ========================================

cd frontend
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)
echo Installing dependencies...
call npm install
cd ..

echo.
echo ========================================
echo Setting up AI API...
echo ========================================

cd ai-model\api
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)
echo Installing dependencies...
pip install -r requirements.txt
cd ..\..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update backend\.env with your MongoDB URI (already configured)
echo 2. Run the following commands in separate terminals:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm start
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm run dev
echo.
echo    Terminal 3 (AI API - Optional):
echo    cd ai-model\api
echo    python app.py
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo For detailed instructions, see SETUP.md
echo ========================================
pause

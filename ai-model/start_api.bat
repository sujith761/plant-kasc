@echo off
echo ============================================================
echo   Plant Disease AI - Setup & Run
echo ============================================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.9+
    echo https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Navigate to api directory
cd /d "%~dp0api"

:: Create virtual env if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate virtual env
call venv\Scripts\activate.bat

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo ============================================================
echo   Starting Flask API Server (port 5001)
echo ============================================================
echo   DEV mode: predictions are simulated (no trained model needed)
echo   To train a real model, run: python ../download_dataset.py
echo   Then: cd ../training && python train_model.py
echo ============================================================
echo.

python app.py

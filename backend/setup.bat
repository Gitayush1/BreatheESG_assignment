@echo off
echo ========================================
echo BreatheESG Backend Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo Step 2: Running database migrations...
python manage.py migrate
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations
    pause
    exit /b 1
)
echo.

echo Step 3: Setting up demo data...
python manage.py setup_demo_data
if %errorlevel% neq 0 (
    echo ERROR: Failed to setup demo data
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Demo credentials:
echo   Username: analyst@breatheesg.com
echo   Password: demo2026
echo.
echo To start the server, run:
echo   python manage.py runserver
echo.
pause

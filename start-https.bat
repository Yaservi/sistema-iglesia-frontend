@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo    Sistema Iglesia Frontend - HTTPS Starter
echo ===================================================
echo.

REM Navigate to the project directory (in case the script is run from elsewhere)
cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if Angular CLI is installed
where ng >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo WARNING: Angular CLI is not found in PATH.
    echo Attempting to use local Angular CLI...

    if exist "node_modules\.bin\ng.cmd" (
        set NG_CMD=node_modules\.bin\ng.cmd
    ) else (
        echo ERROR: Angular CLI is not installed.
        echo Please install Angular CLI using: npm install -g @angular/cli
        echo.
        pause
        exit /b 1
    )
) else (
    set NG_CMD=ng
)

REM Create SSL directory if it doesn't exist
if not exist "ssl" mkdir ssl

echo Starting Angular application with HTTPS...
echo.

REM Check if custom certificates exist
set USE_CUSTOM_CERT=0
if exist "ssl\server.crt" if exist "ssl\server.key" (
    set USE_CUSTOM_CERT=1
    echo Using custom SSL certificates from the ssl directory.
) else (
    echo No custom SSL certificates found.
    echo Angular CLI will auto-generate self-signed certificates.
)

echo.
echo Application will be available at: https://localhost:4200
echo API endpoint is at: https://localhost:44347
echo.
echo Press Ctrl+C to stop the server when done.
echo.

REM Run Angular with HTTPS enabled and proxy configuration
if !USE_CUSTOM_CERT! equ 1 (
    echo Running: !NG_CMD! serve --proxy-config proxy.conf.json --ssl true --ssl-cert "ssl\server.crt" --ssl-key "ssl\server.key" --host 0.0.0.0 --port 4200
    !NG_CMD! serve --proxy-config proxy.conf.json --ssl true --ssl-cert "ssl\server.crt" --ssl-key "ssl\server.key" --host 0.0.0.0 --port 4200
) else (
    echo Running: !NG_CMD! serve --proxy-config proxy.conf.json --ssl true --host 0.0.0.0 --port 4200
    !NG_CMD! serve --proxy-config proxy.conf.json --ssl true --host 0.0.0.0 --port 4200
)

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to start the Angular application.
    echo Please check the error messages above.
)

echo.
pause

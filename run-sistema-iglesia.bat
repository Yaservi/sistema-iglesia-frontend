@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo    Sistema Iglesia Frontend - Launcher
echo ===================================================
echo.

:menu
echo Please select an option:
echo.
echo 1. Start application with HTTPS
echo 2. Test API connection
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    call start-https.bat
    goto end
) else if "%choice%"=="2" (
    call test-api-connection.bat
    echo.
    goto menu
) else if "%choice%"=="3" (
    goto end
) else (
    echo.
    echo Invalid choice. Please try again.
    echo.
    goto menu
)

:end
echo.
echo Thank you for using Sistema Iglesia Frontend.
echo.

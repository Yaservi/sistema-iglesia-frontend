@echo off
setlocal

echo ===================================================
echo    API Connection Test
echo ===================================================
echo.

echo Testing connection to API at https://localhost:44347...
echo.

REM Use PowerShell to make an HTTPS request
powershell -Command "& {try { $response = Invoke-WebRequest -Uri 'https://localhost:44347/swagger/index.html' -UseBasicParsing -TimeoutSec 10; Write-Host 'Connection successful! Status code:' $response.StatusCode; } catch { Write-Host 'Connection failed:' $_.Exception.Message }}"

echo.
echo If the connection was successful, you should see a status code 200.
echo If it failed, make sure the API server is running.
echo.
echo Note: If you see SSL/TLS errors, this is normal when using self-signed certificates.
echo.

pause

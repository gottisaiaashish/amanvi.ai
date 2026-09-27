@echo off
title Amanvi AI - Install to Windows Startup
echo =========================================================
echo   Installing Amanvi Guardian Sentinel to Windows Startup...
echo =========================================================

set SCRIPT_DIR=%~dp0
set ROOT_DIR=%SCRIPT_DIR%..\
set VBS_RUNNER=%SCRIPT_DIR%run-hidden.vbs
set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

:: Create VBScript to run Backend, Ngrok tunnel, and Guardian silently in background on boot
echo Set WshShell = CreateObject("WScript.Shell") > "%VBS_RUNNER%"
echo WshShell.CurrentDirectory = "%ROOT_DIR%backend" >> "%VBS_RUNNER%"
echo WshShell.Run "node src/index.js", 0, False >> "%VBS_RUNNER%"
echo WScript.Sleep 1500 >> "%VBS_RUNNER%"
echo WshShell.CurrentDirectory = "%ROOT_DIR%" >> "%VBS_RUNNER%"
echo WshShell.Run "ngrok http 5000", 0, False >> "%VBS_RUNNER%"
echo WScript.Sleep 1000 >> "%VBS_RUNNER%"
echo WshShell.CurrentDirectory = "%SCRIPT_DIR%" >> "%VBS_RUNNER%"
echo WshShell.Run "node guardian-agent.js", 0, False >> "%VBS_RUNNER%"

:: Copy VBS to Startup Folder
copy /Y "%VBS_RUNNER%" "%STARTUP_FOLDER%\AmanviGuardian.vbs"

echo.
echo [SUCCESS] Amanvi Laptop Guardian installed to Windows Startup!
echo Whenever your laptop boots/powers on, it will automatically:
echo  1. Start Backend and Cloud Tunnel
echo  2. Protect the screen with Amanvi Security Lock
echo  3. Send instant alert notification to your Amanvi Mobile App
echo  4. Wait for your Mobile Face Unlock confirmation
echo.
pause

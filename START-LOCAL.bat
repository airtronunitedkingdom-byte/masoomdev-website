@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:3000"
  py -3 local-preview.py
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:3000"
  python local-preview.py
  goto :end
)
echo Python 3 is required for the local preview.
echo Install Python 3, then run START-LOCAL.bat again.
pause
:end

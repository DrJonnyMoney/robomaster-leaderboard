@echo off
echo Starting Robomaster Challenge Leaderboard...

:: Navigate to your project directory
cd C:\Users\jonny\Projects\robotics-leaderboard\backend

:: Activate Conda environment
call C:\Users\jonny\miniconda3\Scripts\activate.bat leaderboard

:: Run the FastAPI application
start /b python main.py

timeout /t 5

start http://localhost:8000

echo Server running in background. Close this window to stop the server.

pause
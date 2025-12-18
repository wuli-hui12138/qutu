@echo off
echo ==========================================
echo   FunPic Box - One Click Setup ^& Build
echo ==========================================

echo [1/4] Installing Frontend Dependencies...
call npm install

echo.
echo [2/4] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo [3/4] Building Frontend...
call npm run build

echo.
echo [4/4] Building Backend...
cd backend
call npm run build
cd ..

echo.
echo ==========================================
echo   All tasks completed successfully!
echo ==========================================
pause

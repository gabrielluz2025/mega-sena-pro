@echo off
title Mega Sena PRO - Iniciar
color 0A

echo ============================================
echo  INICIANDO SERVIDOR MEGA SENA PRO
echo ============================================
echo.

echo Parando processos antigos...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo Iniciando servidor...
start "SERVIDOR MEGA SENA" cmd /k "node server.js"
timeout /t 4 >nul

echo Abrindo navegador...
start http://localhost:8080/pro.html

echo.
echo ============================================
echo  SISTEMA INICIADO
echo ============================================
pause

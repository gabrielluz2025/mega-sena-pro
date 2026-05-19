@echo off
title Mega Sena PRO - Parar Servidor
chcp 65001 >nul
color 0C

cls
echo ============================================================
echo  PARANDO SERVIDOR MEGA SENA PRO
echo ============================================================
echo.

echo Procurando processos Node.js...
tasklist /FI "IMAGENAME eq node.exe" 2>nul | findstr node.exe >nul
if %errorlevel% == 0 (
    echo.
    echo Node.js encontrado! Parando...
    taskkill /F /IM node.exe
    echo.
    echo ✅ Servidor PARADO com sucesso!
) else (
    echo ℹ️ Nenhum servidor Node.js rodando.
)

echo.
echo ============================================================
echo  Agora você pode iniciar um novo servidor com:
echo  - iniciar.bat        (primeira vez)
echo  - reiniciar.bat      (reiniciar)
echo ============================================================
pause

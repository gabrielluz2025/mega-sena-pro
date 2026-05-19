@echo off
title Mega Sena PRO - Iniciar Sistema
chcp 65001 >nul
color 0A

cls
echo ============================================
echo  MEGA SENA PRO - Sistema de Persistencia
echo ============================================
echo.
echo Iniciando servidor Node.js em nova janela...
echo.
echo Dados serao salvos em: dados_sistema\
echo.
echo ============================================
echo.

:: Verificar se ja existe servidor rodando
tasklist /FI "IMAGENAME eq node.exe" 2>nul | findstr node.exe >nul
if %errorlevel% == 0 (
    echo ⚠️  ATENCAO: Ja existe um servidor rodando!
    echo.
    echo Para reiniciar com codigo atualizado, use:
    echo    reiniciar_servidor.bat
    echo.
    pause
    exit
)

:: Iniciar servidor em nova janela (com cmd /k para manter aberta)
start "Mega Sena PRO Server" cmd /k "node server.js"
echo Servidor iniciado em nova janela! Aguardando 5 segundos...
timeout /t 5 /nobreak >nul

echo Abrindo navegador...
start http://localhost:8080/pro.html
echo.
echo ✅ Navegador aberto! Sistema pronto para usar.
echo.
echo ============================================
echo  IMPORTANTE:
echo  - O servidor esta rodando em OUTRA janela
echo  - Esta janela pode ser fechada (servidor continua)
echo  - Para parar o servidor: execute parar_servidor.bat
echo  - Para reiniciar: execute reiniciar_servidor.bat
echo ============================================
echo.
pause

@echo off
title EMERGENCIA - Mega Sena PRO
chcp 65001 >nul
color 0C

cls
echo ##########################################################
echo  #  MODO EMERGENCIA - FORCAR REINICIO TOTAL
echo ##########################################################
echo.

echo [1/5] Matando TODOS os processos Node.js...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM node.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo      ✅ Todos os processos Node.js mortos
echo.

echo [2/5] Liberando porta 8080...
netstat -ano | findstr :8080 >nul
if %errorlevel% == 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        taskkill /F /PID %%a 2>nul
    )
)
timeout /t 2 /nobreak >nul
echo      ✅ Porta 8080 liberada
echo.

echo [3/5] Verificando arquivos...
if not exist "server.js" (
    echo      ❌ ERRO: server.js nao encontrado!
    pause
    exit
)
if not exist "pro.html" (
    echo      ❌ ERRO: pro.html nao encontrado!
    pause
    exit
)
echo      ✅ Arquivos OK
echo.

echo [4/5] Criando diretorio de dados...
if not exist "dados_sistema" mkdir dados_sistema
echo      ✅ Diretorio pronto
echo.

echo [5/5] Iniciando servidor...
echo.
echo ----------------------------------------------------------
echo  O servidor vai abrir em uma NOVA JANELA.
echo  NAO FECHE essa nova janela enquanto usar o sistema!
echo ----------------------------------------------------------
echo.

:: Iniciar com cmd /k para manter a janela aberta
start "SERVIDOR MEGA SENA - NAO FECHE" cmd /k "node server.js"

timeout /t 5 /nobreak >nul

echo.
echo ✅ Servidor iniciado!
echo.
echo Abrindo navegador em 3 segundos...
timeout /t 3 /nobreak >nul

start http://localhost:8080/pro.html

echo.
echo ##########################################################
echo  #  SISTEMA INICIADO!
echo  #
echo  #  Agora teste em: http://localhost:8080/api/existe-checkpoint
echo  #  Deve mostrar: {"existe":false} ou {"existe":true}
echo ##########################################################
echo.
pause

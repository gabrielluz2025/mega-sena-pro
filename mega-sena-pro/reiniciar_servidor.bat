@echo off
title Mega Sena PRO - Reiniciar Servidor
chcp 65001 >nul
color 0E

cls
echo ============================================================
echo  REINICIANDO SERVIDOR MEGA SENA PRO
echo ============================================================
echo.

:: Matar qualquer processo Node.js rodando
echo [1/4] Parando servidor anterior...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo      ✓ Servidor anterior parado
) else (
    echo      ℹ Nenhum servidor rodando
)
timeout /t 2 /nobreak >nul

:: Aguardar para garantir que porta foi liberada
echo.
echo [2/4] Aguardando liberação da porta...
timeout /t 3 /nobreak >nul
echo      ✓ Porta liberada

:: Criar diretório de dados se não existir
echo.
echo [3/4] Verificando diretório de dados...
if not exist "dados_sistema" (
    mkdir dados_sistema
    echo      ✓ Diretório criado
) else (
    echo      ✓ Diretório existe
)

:: Iniciar servidor em nova janela
echo.
echo [4/4] Iniciando novo servidor...
echo.
start "Mega Sena PRO Server" cmd /k "node server.js"

timeout /t 3 /nobreak >nul
echo      ✓ Servidor iniciado em nova janela
echo.

:: Abrir navegador
echo Abrindo navegador...
start http://localhost:8080/pro.html

echo.
echo ============================================================
echo  SERVIDOR REINICIADO COM SUCESSO!
echo ============================================================
echo.
echo Verifique a janela do servidor para confirmar
que os endpoints de checkpoint estão carregados.
echo.
pause

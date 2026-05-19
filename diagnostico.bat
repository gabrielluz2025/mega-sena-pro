@echo off
title DIAGNOSTICO - Mega Sena PRO
chcp 65001 >nul
color 0C
cls

echo ============================================================
echo  DIAGNOSTICO DO SERVIDOR MEGA SENA PRO
echo ============================================================
echo.

:: 1. Verificar se Node.js está instalado
echo [1] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo     ❌ Node.js NAO esta instalado!
    echo     Instale em: https://nodejs.org
    pause
    exit
) else (
    for /f "tokens=*" %%a in ('node --version') do echo     ✅ Node.js: %%a
)
echo.

:: 2. Matar TODOS os processos Node.js
echo [2] Parando TODOS os servidores Node.js...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM node.exe 2>nul
taskkill /F /IM node.exe 2>nul
echo     ✅ Todos os processos Node.js parados
echo.
timeout /t 3 /nobreak >nul

:: 3. Verificar porta 8080
echo [3] Verificando porta 8080...
netstat -ano | findstr :8080 >nul
if %errorlevel% == 0 (
    echo     ⚠️ Porta 8080 ainda ocupada!
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo     Forcando fechamento do PID: %%a
        taskkill /F /PID %%a 2>nul
    )
) else (
    echo     ✅ Porta 8080 livre
)
echo.
timeout /t 2 /nobreak >nul

:: 4. Verificar arquivos
echo [4] Verificando arquivos do servidor...
if exist "server.js" (
    echo     ✅ server.js encontrado
) else (
    echo     ❌ server.js NAO encontrado!
)

if exist "pro.html" (
    echo     ✅ pro.html encontrado
) else (
    echo     ❌ pro.html NAO encontrado!
)
echo.

:: 5. Criar diretorio de dados
echo [5] Criando diretorio de dados...
if not exist "dados_sistema" mkdir dados_sistema
echo     ✅ dados_sistema pronto
echo.

:: 6. Testar servidor manualmente
echo [6] Testando endpoints...
echo     Iniciando servidor em modo teste (5 segundos)...
start /MIN cmd /c "node server.js & timeout /t 5 & taskkill /F /IM node.exe"
timeout /t 3 /nobreak >nul

echo.
echo     Testando endpoint de checkpoint...
curl -s http://localhost:8080/api/existe-checkpoint >nul 2>&1
if %errorlevel% == 0 (
    echo     ✅ Endpoint respondeu!
) else (
    echo     ❌ Endpoint NAO respondeu (verifique abaixo)
)
echo.

:: 7. Mostrar logs
echo ============================================================
echo  LOGS DO SERVIDOR (ultimas linhas de server.js):
echo ============================================================
echo.
type server.js | findstr "app.get\|app.post\|app.delete\|app.listen" | tail -20
echo.

:: 8. Iniciar servidor normalmente
echo ============================================================
echo  INICIANDO SERVIDOR CORRETAMENTE
echo ============================================================
echo.
echo O servidor sera iniciado em uma NOVA jANELA.
echo Aguarde 5 segundos apos abrir e teste em:
echo http://localhost:8080/testar_checkpoint.html
echo.
pause

start "Mega Sena PRO - CORRIGIDO" cmd /k "node server.js"
timeout /t 2 /nobreak >nul
start http://localhost:8080/testar_checkpoint.html

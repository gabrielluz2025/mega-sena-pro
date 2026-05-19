@echo off
cd /d "%~dp0"

echo.
echo ============================================
echo  ENVIAR PARA GITHUB - MEGA SENA PRO
echo ============================================
echo.

:: Verificar repositorio
if not exist .git (
    echo [ERRO] Repositorio nao encontrado!
    echo Execute INICIAR_E_SUBIR.bat primeiro
    pause
    exit /b 1
)

:: Verificar remote
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] GitHub nao configurado!
    echo Execute CONFIGURAR_GITHUB.bat primeiro
    pause
    exit /b 1
)

echo [*] Verificando mudancas...
git status --short
echo.

echo [*] Adicionando arquivos modificados...
git add .
echo.

echo [*] Criando commit...
git commit -m "Atualizacao Mega Sena PRO v2"
if %errorlevel% neq 0 (
    echo [INFO] Sem mudancas novas para commitar
)
echo.

echo [*] Enviando para GitHub...
git push origin main 2>nul
if %errorlevel% neq 0 (
    git push origin master
)

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  [SUCESSO] ENVIADO!
    echo ============================================
    echo.
    git remote -v
    echo.
    echo Aguardando atualizacao no Render.com...
    echo.
) else (
    echo.
    echo [ERRO] Falha ao enviar!
    echo Verifique sua conexao e permissoes.
    echo.
)

pause

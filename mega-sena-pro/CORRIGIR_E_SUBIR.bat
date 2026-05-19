@echo off
cd /d "%~dp0"

echo.
echo ============================================
echo  CORRIGIR E SUBIR - MEGA SENA PRO
echo ============================================
echo.

echo [*] Removendo configuracao errada...
git remote remove origin
echo [OK] Remote removido
echo.

echo ============================================
echo  INFORME SEU USUARIO DO GITHUB
echo ============================================
echo.
echo Exemplos de usuarios validos:
echo   - xgame
echo   - joao123
echo   - maria_silva
echo.
echo NAO digite o token aqui!
echo O token sera pedido como SENHA depois.
echo.

set /p USUARIO="Digite seu usuario do GitHub: "

if "%USUARIO%"=="" (
    echo [ERRO] Usuario nao informado!
    pause
    exit /b 1
)

echo.
echo [*] Configurando remote correto...
git remote add origin https://github.com/%USUARIO%/mega-sena-pro.git
echo.

echo [OK] Remote configurado:
git remote -v
echo.

echo ============================================
echo  ENVIANDO PARA GITHUB
echo ============================================
echo.
echo Quando pedir senha, digite seu TOKEN!
echo.

git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [Tentando com master...]
    git push -u origin master
)

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  [SUCESSO] ENVIADO!
    echo ============================================
    echo.
    echo Repositorio: https://github.com/%USUARIO%/mega-sena-pro
    echo.
) else (
    echo.
    echo ============================================
    echo  [ERRO] Verifique:
    echo ============================================
    echo.
    echo 1. Repositorio existe no GitHub?
    echo    Crie em: https://github.com/new
    echo.
    echo 2. Token esta correto?
    echo    Gere em: https://github.com/settings/tokens
    echo.
    echo 3. Usuario esta correto?
    echo    Seu usuario: %USUARIO%
    echo.
)

pause

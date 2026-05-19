@echo off
cd /d "%~dp0"

echo.
echo ============================================
echo  MEGA SENA PRO v2 - SUBIR PARA GITHUB
echo ============================================
echo.

:: Testar git
git --version
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Git nao encontrado!
    echo Instale em https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo Preparando arquivos...
echo.

:: Adicionar
git add pro.html server.js data.json concursos.json package.json render.yaml .gitignore

echo.
echo Criando commit...
git commit -m "Mega Sena PRO v2 - Unificado"

echo.
echo Enviando para GitHub...
git push origin main
if %errorlevel% neq 0 (
    git push origin master
)

echo.
echo ============================================
echo Processo concluido!
echo ============================================
echo.
pause

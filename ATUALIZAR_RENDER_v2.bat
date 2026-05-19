@echo off
title ATUALIZAR RENDER - Mega Sena PRO
chcp 65001 >nul
color 0A

cls
echo ============================================
echo  ATUALIZAR RENDER.COM (Via GitHub)
echo ============================================
echo.
echo NAO FECHE ESTA JANELA!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

cls
echo ============================================
echo  VERIFICANDO GIT...
echo ============================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo  ❌ ERRO: Git nao esta instalado!
    echo ============================================
    echo.
    echo Opcao 1: Instalar Git
    echo   https://git-scm.com/download/win
    echo.
    echo Opcao 2: Upload manual pelo site
    echo   1. Acesse: https://github.com/gabrielluz2025/mega-sena-pro
    echo   2. Clique em "Add file" -^> "Upload files"
    echo   3. Arraste o arquivo pro.html
    echo   4. Clique em "Commit changes"
    echo.
    echo O Render atualiza automaticamente em 1-2 minutos!
    echo.
    echo ============================================
    echo.
    echo Pressione qualquer tecla para sair...
    pause >nul
    exit
)

echo ✅ Git encontrado!
echo.
echo ============================================
echo  VERIFICANDO REPOSITORIO...
echo ============================================
echo.

if not exist ".git" (
    echo ❌ ERRO: Repositorio Git nao encontrado!
    echo.
    echo Execute primeiro: SUBIR_GITHUB_v2.bat
    echo.
    echo Ou faca upload manual pelo site do GitHub.
    echo.
    pause
    exit
)

echo ✅ Repositorio encontrado!
echo.

cls
echo ============================================
echo  ENVIANDO PARA O GITHUB...
echo ============================================
echo.
echo Arquivos a enviar:
dir /b *.html *.js *.json *.bat *.md 2>nul | findstr /v "SUBIR_GITHUB ATUALIZAR" | head -20
echo.

git add .
if %errorlevel% neq 0 (
    echo ❌ ERRO no git add
    pause
    exit
)

echo.
echo Criando commit...
git commit -m "Atualizacao: Checkpoint + 3 estrategias + Modal corrigido"
if %errorlevel% neq 0 (
    echo ℹ️  Nada para commitar (pode ja estar atualizado)
)

echo.
echo Enviando para GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERRO no push!
    echo.
    echo Possiveis causas:
    echo - Senha/token expirado
    echo - Problema de conexao
    echo - Repositorio nao configurado
    echo.
    echo Tente fazer manualmente pelo site.
    pause
    exit
)

cls
echo ============================================
echo  ✅ SUCESSO!
echo ============================================
echo.
echo ✅ Codigo enviado para GitHub!
echo.
echo 🔄 O Render.com vai atualizar automaticamente
echo    em 1-2 minutos...
echo.
echo 🌐 Acesse:
echo    https://mega-sena-pro.onrender.com/pro.html
echo.
echo ============================================
echo.
echo Pressione qualquer tecla para fechar...
pause >nul

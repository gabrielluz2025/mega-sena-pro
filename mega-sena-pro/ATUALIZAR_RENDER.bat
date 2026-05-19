@echo off
title Atualizar no Render - Mega Sena PRO
chcp 65001 >nul
color 0A

cls
echo ============================================
echo  ATUALIZAR NO RENDER (Via GitHub)
echo ============================================
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo Verificando git...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo  ⚠️  Git nao encontrado!
    echo ============================================
    echo.
    echo Faca upload manual pelo site:
    echo 1. Acesse: https://github.com/gabrielluz2025/mega-sena-pro
    echo 2. Clique em "Add file" -^> "Upload files"
    echo 3. Arraste os arquivos modificados
    echo 4. Clique em "Commit changes"
    echo.
    echo O Render atualiza automaticamente em 1-2 minutos!
    echo.
    pause
    exit
)

echo ✅ Git encontrado!
echo.

REM Verificar se tem repositorio
if not exist ".git" (
    echo ❌ Repositorio nao encontrado!
    echo Execute SUBIR_GITHUB_v2.bat primeiro
    pause
    exit
)

echo 📤 Enviando alteracoes para GitHub...
echo.
git add .
git commit -m "Checkpoint inteligente + 3 estrategias + Modal ranking corrigido"
git push origin main

if %errorlevel% == 0 (
    echo.
    echo ============================================
    echo  ✅ SUCESSO!
    echo ============================================
    echo.
    echo Codigo enviado para GitHub!
    echo.
    echo O Render.com vai atualizar automaticamente
    echo em 1-2 minutos...
    echo.
    echo Aguarde e acesse:
    echo https://mega-sena-pro.onrender.com/pro.html
) else (
    echo.
    echo ============================================
    echo  ❌ ERRO ao enviar!
    echo ============================================
    echo.
    echo Tente fazer manualmente pelo site do GitHub
)

echo.
pause

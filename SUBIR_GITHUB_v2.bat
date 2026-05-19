@echo off
title Subir para GitHub - Mega Sena PRO
chcp 65001 >nul
color 0A

cls
echo ============================================
echo  SUBIR CODIGO PARA O GITHUB
echo ============================================
echo.
echo NAO FECHE ESTA JANELA!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

cls
echo Verificando se git esta instalado...
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ============================================
    echo  ❌ ERRO: Git nao esta instalado!
    echo ============================================
    echo.
    echo Voce precisa instalar o Git primeiro:
    echo.
    echo 1. Acesse: https://git-scm.com/download/win
    echo 2. Baixe e instale (proximo, proximo, proximo...)
    echo 3. Reinicie o computador
    echo 4. Execute este script novamente
    echo.
    echo ============================================
    echo.
    echo Pressione qualquer tecla para sair...
    pause >nul
    exit
)

echo ✅ Git encontrado!
git --version
echo.

if exist ".git" (
    echo ℹ️ Repositório ja existe!
    echo Fazendo atualizacao...
    echo.
    
    git add .
    git commit -m "Atualizacao automatica - %date% %time%"
    git push origin main
    
    if %errorlevel% == 0 (
        echo.
        echo ============================================
        echo  ✅ SUCESSO!
        echo ============================================
        echo.
        echo Codigo atualizado no GitHub!
    ) else (
        echo.
        echo ============================================
        echo  ❌ ERRO no push!
        echo ============================================
        echo.
        echo Possiveis causas:
        echo - Problema de conexao com internet
        echo - Token de autenticacao expirado
        echo - Repositório remoto nao configurado
        echo.
        echo Tente fazer manualmente pelo site do GitHub.
    )
) else (
    echo 🆕 Criando NOVO repositório...
    echo.
    
    set /p usuario="Digite seu usuario do GitHub (ex: joao123): "
    echo.
    set /p repo="Digite nome do repositorio (ex: mega-sena-pro): "
    echo.
    
    echo ============================================
    echo  Configurando...
    echo ============================================
    echo.
    
    git init
    if %errorlevel% neq 0 (
        echo ❌ Erro ao inicializar git
        pause
        exit
    )
    
    git add .
    git commit -m "Mega Sena PRO - Primeira versao"
    
    echo.
    echo Conectando ao GitHub...
    git remote add origin https://github.com/%usuario%/%repo%.git
    
    git branch -M main
    
    echo.
    echo Enviando para o GitHub...
    echo (pode pedir login e senha...)
    git push -u origin main
    
    if %errorlevel% == 0 (
        echo.
        echo ============================================
        echo  ✅ SUCESSO!
        echo ============================================
        echo.
        echo Seu codigo esta em:
        echo https://github.com/%usuario%/%repo%
        echo.
        echo Agora va para o Render.com!
    ) else (
        echo.
        echo ============================================
        echo  ❌ ERRO ao enviar!
        echo ============================================
        echo.
        echo Possiveis solucoes:
        echo 1. Crie o repositorio primeiro no site do GitHub
        echo 2. Verifique seu usuario e nome do repositorio
        echo 3. Use upload manual pelo site
        echo.
        echo Link para criar: https://github.com/new
    )
)

echo.
echo ============================================
echo.
echo Pressione qualquer tecla para fechar...
pause >nul

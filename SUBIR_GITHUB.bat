@echo off
title Subir para GitHub - Mega Sena PRO
chcp 65001 >nul
color 0A

cls
echo ============================================
echo  SUBIR CODIGO PARA O GITHUB
echo ============================================
echo.

REM Verificar se git está instalado
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git nao esta instalado!
    echo.
    echo Baixe em: https://git-scm.com/download/win
    echo.
    pause
    exit
)

echo ✅ Git encontrado!
echo.

REM Verificar se já tem repositório
if exist ".git" (
    echo ℹ️ Repositório já existe. Fazendo push...
    git add .
    git commit -m "Atualizacao automatica"
    git push origin main
    if %errorlevel% == 0 (
        echo.
        echo ✅ Codigo enviado com sucesso!
    ) else (
        echo.
        echo ⚠️ Erro no push. Verifique sua conexao.
    )
) else (
    echo 🆕 Criando novo repositório...
    echo.
    
    set /p usuario="Digite seu usuario do GitHub: "
    set /p repo="Digite o nome do repositorio (ex: mega-sena-pro): "
    
    git init
    git add .
    git commit -m "Mega Sena PRO - Primeira versao"
    git remote add origin https://github.com/%usuario%/%repo%.git
    git branch -M main
    git push -u origin main
    
    if %errorlevel% == 0 (
        echo.
        echo ✅ SUCESSO!
        echo.
        echo Seu codigo esta em:
        echo https://github.com/%usuario%/%repo%
        echo.
        echo Agora va para o Render.com e faca o deploy!
        echo Veja o arquivo DEPLOY.md para instrucoes.
    ) else (
        echo.
        echo ❌ ERRO ao enviar para o GitHub.
        echo Verifique se:
        echo - O repositorio ja existe no GitHub
        echo - Seu usuario esta correto
        echo - Voce tem permissao de escrita
    )
)

echo.
pause

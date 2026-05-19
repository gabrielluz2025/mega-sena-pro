@echo off
cd /d "%~dp0"

echo.
echo ============================================
echo  CONFIGURAR GITHUB - MEGA SENA PRO
echo ============================================
echo.

:: Verificar se tem repositorio
if not exist .git (
    echo [ERRO] Repositorio Git nao encontrado!
    echo Execute INICIAR_E_SUBIR.bat primeiro
    pause
    exit /b 1
)

echo [*] Verificando configuracao atual...
git remote -v
echo.

echo ============================================
echo  INSTRUCOES IMPORTANTES
echo ============================================
echo.
echo Antes de continuar, voce precisa:
echo.
echo 1. Criar um repositorio NOVO no GitHub
echo    Acesse: https://github.com/new
echo.
echo 2. Defina o nome do repositorio:
echo    Sugestao: mega-sena-pro
echo.
echo 3. DEIXE MARCADO: "Add a README file"
echo    (isso inicializa o repositorio)
echo.
echo 4. Clique em "Create repository"
echo.
echo ============================================
echo.
echo Pressione qualquer tecla quando estiver pronto...
pause >nul

echo.
echo [*] Configurando conexao com GitHub...
echo.

:: Remover remote antigo se existir
git remote remove origin 2>nul

:: Perguntar usuario
set /p USUARIO="Digite seu usuario do GitHub: "

if "%USUARIO%"=="" (
    echo [ERRO] Usuario nao informado!
    pause
    exit /b 1
)

echo.
echo [*] Configurando remote...
git remote add origin https://github.com/%USUARIO%/mega-sena-pro.git

echo.
echo [OK] Remote configurado!
echo.
echo ============================================
echo  AGORA VAMOS ENVIAR!
echo ============================================
echo.
echo [*] Enviando arquivos para GitHub...
echo.

:: Tentar push
git push -u origin main 2>nul
if %errorlevel% neq 0 (
    git push -u origin master
)

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  [SUCESSO] ENVIADO!
    echo ============================================
    echo.
    echo Seu codigo esta em:
    echo https://github.com/%USUARIO%/mega-sena-pro
    echo.
    echo Agora conecte ao Render.com para deploy!
    echo.
) else (
    echo.
    echo ============================================
    echo  [ERRO] Falha no envio
    echo ============================================
    echo.
    echo Possiveis causas:
    echo 1. Repositorio nao existe no GitHub
    echo 2. Token de acesso necessario
    echo.
    echo Solucao:
    echo - Crie o repositorio em https://github.com/new
    echo - Ou gere um token em https://github.com/settings/tokens
    echo.
)

pause

@echo off
cd /d "%~dp0"

echo.
echo ============================================
echo  MEGA SENA PRO v2 - INICIAR E SUBIR
echo ============================================
echo.

:: Verificar git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Git nao encontrado!
    echo Instale em: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [OK] Git encontrado
echo.

:: VERIFICAR SE TEM REPOSITORIO
if not exist .git (
    echo [*] Criando repositorio Git...
    git init
    echo.
    echo [OK] Repositorio criado!
    echo.
)

:: CONFIGURAR GIT
git config user.email "megasena@pro.com" >nul 2>&1
git config user.name "Mega Sena PRO" >nul 2>&1

:: VERIFICAR SE TEM REMOTE
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo  CONFIGURAR GITHUB PELA PRIMEIRA VEZ
    echo ============================================
    echo.
    echo Voce precisa configurar o repositorio remoto.
    echo.
    echo 1. Crie um repositorio em: https://github.com/new
    echo    Nome sugerido: mega-sena-pro
    echo.
    echo 2. Digite seu usuario do GitHub:
    set /p USUARIO="Usuario GitHub: "
    echo.
    
    if "%USUARIO%"=="" (
        echo [ERRO] Usuario nao informado!
        pause
        exit /b 1
    )
    
    echo [*] Configurando remote...
    git remote add origin https://github.com/%USUARIO%/mega-sena-pro.git
    
    if %errorlevel% equ 0 (
        echo [OK] Remote configurado!
    ) else (
        echo [ERRO] Falha ao configurar remote!
        pause
        exit /b 1
    )
    echo.
)

echo [*] Preparando arquivos...
git add pro.html server.js data.json concursos.json package.json render.yaml .gitignore
echo [OK] Arquivos adicionados
echo.

echo [*] Criando commit...
git commit -m "Mega Sena PRO v2 - Sistema Unificado com IA" -m "- Dashboard IA unificada" -m "- 19 estrategias" -m "- Persistencia Render" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Commit criado!
) else (
    echo [INFO] Sem mudancas novas para commitar
)
echo.

echo [*] Enviando para GitHub...
echo (Pode pedir login/token na primeira vez)
echo.
git push -u origin main 2>nul
if %errorlevel% neq 0 (
    git push -u origin master
)

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  [SUCESSO] TUDO ENVIADO!
    echo ============================================
    echo.
    echo Seu codigo esta no GitHub!
    echo O Render.com vai atualizar automaticamente.
    echo.
    echo Proximos passos:
    echo 1. Acesse https://github.com/seu-usuario/mega-sena-pro
    echo 2. Conecte ao Render.com (se ainda nao fez)
    echo 3. Pronto! Seu sistema esta online!
    echo.
) else (
    echo.
    echo ============================================
    echo  [ERRO] Falha ao enviar
    echo ============================================
    echo.
    echo Possiveis solucoes:
    echo 1. Crie o repositorio no GitHub primeiro
    echo 2. Verifique seu login/token
    echo 3. Ou use: git push origin main --force
    echo.
)

pause

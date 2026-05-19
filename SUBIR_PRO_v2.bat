@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================
echo  MEGA SENA PRO v2 - SUBIR PARA GITHUB
echo ============================================
echo.

:: Verificar se git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Git nao encontrado!
    echo.
    echo Instale o Git em: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git encontrado
echo.

:: Configurar git
git config --global user.email "megasena@pro.com" >nul 2>&1
git config --global user.name "Mega Sena PRO" >nul 2>&1

:: Inicializar repositório se nao existir
if not exist .git (
    echo [*] Inicializando repositorio...
    git init
    echo.
)

echo [*] Preparando arquivos...
echo.

:: Adicionar arquivos principais
git add pro.html
git add server.js
git add data.json
git add concursos.json
git add package.json
git add render.yaml
git add .gitignore

echo [OK] Arquivos adicionados
echo.

:: Criar commit
git commit -m "Mega Sena PRO v2 - Sistema Unificado" -m "Dashboard IA unificada com 4 abas" -m "IA treina com todos os concursos" -m "Persistencia no Render.com"

if %errorlevel% equ 0 (
    echo [OK] Commit criado com sucesso!
) else (
    echo [INFO] Nada de novo para commitar (ja esta atualizado)
)
echo.

:: Verificar se tem remote configurado
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Remote do GitHub nao configurado!
    echo.
    echo Para configurar, execute:
    echo git remote add origin https://github.com/SEU_USUARIO/mega-sena-pro.git
    echo.
    echo Ou use o script SUBIR_GITHUB_v2.bat primeiro.
    echo.
    pause
    exit /b 1
)

echo [*] Enviando para GitHub...
echo.
git push origin main 2>nul || git push origin master 2>nul

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  [SUCESSO] Arquivos enviados!
    echo ============================================
    echo.
    echo O Render.com vai atualizar automaticamente.
    echo.
    echo Arquivos enviados:
    echo - pro.html (sistema principal)
    echo - server.js (backend)
    echo - data.json (estatisticas)
    echo - concursos.json (historico)
    echo - package.json (dependencias)
    echo - render.yaml (configuracao)
    echo.
) else (
    echo.
    echo ============================================
    echo  [ERRO] Falha ao enviar!
    echo ============================================
    echo.
    echo Possiveis causas:
    echo 1. Nao fez login no GitHub
    echo 2. Token expirado
    echo 3. Repositorio nao existe
    echo.
    echo Solucao:
    echo Execute primeiro: SUBIR_GITHUB_v2.bat
    echo.
)

echo Pressione qualquer tecla para fechar...
pause >nul

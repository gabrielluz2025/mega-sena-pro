@echo off
chcp 65001 >nul
echo.
echo ============================================
echo 🚀 SUBIR MEGA SENA PRO v2 PARA GITHUB
echo ============================================
echo.

cd /d "%~dp0"

echo 📋 Verificando arquivos...
echo.

:: Verificar se git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não encontrado! Instale o Git primeiro.
    pause
    exit /b 1
)

echo ✅ Git encontrado
echo.

:: Configurar git (se necessário)
git config --global user.email "megasena@pro.com" >nul 2>&1
git config --global user.name "Mega Sena PRO" >nul 2>&1

:: Inicializar repositório se não existir
if not exist .git (
    echo 🆕 Inicializando repositório...
    git init
    echo.
)

echo 📦 Preparando arquivos...
echo.

:: Adicionar apenas arquivos necessários
echo ➕ Adicionando: pro.html
git add pro.html

echo ➕ Adicionando: server.js
git add server.js

echo ➕ Adicionando: data.json
git add data.json

echo ➕ Adicionando: concursos.json
git add concursos.json

echo ➕ Adicionando: package.json
git add package.json

echo ➕ Adicionando: render.yaml
git add render.yaml

echo ➕ Adicionando: .gitignore
git add .gitignore

echo.
echo 🗑️ Removendo arquivos desnecessários do track...
git rm --cached pro_v2.html >nul 2>&1
git rm --cached index.html >nul 2>&1
git rm --cached PROMPT_SISTEMA_GEMINI.md >nul 2>&1
git rm --cached SINCRONIZACAO_RENDER.md >nul 2>&1
git rm --cached MUDANCAS_REALIZADAS.md >nul 2>&1
echo ✅ Arquivos de desenvolvimento removidos do track
echo.

:: Commit
echo 💾 Criando commit...
git commit -m "Mega Sena PRO v2 - Sistema Unificado com IA Persistente" -m "- Dashboard IA unificada (Dashboard + Globo + Concursos)" -m "- 19 estratégias com treinamento contínuo" -m "- Persistência no Render.com" -m "- Sugestão baseada no último concurso"
if %errorlevel% neq 0 (
    echo ⚠️ Nada para commitar (possivelmente já está atualizado)
)
echo.

:: Verificar remote
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Remote não configurado!
    echo.
    echo Configure o remote com:
    echo git remote add origin https://github.com/SEU_USUARIO/mega-sena-pro.git
    echo.
    pause
    exit /b 1
)

echo ⬆️ Enviando para GitHub...
git push origin main || git push origin master
echo.

if %errorlevel% equ 0 (
    echo ✅ SUCESSO! Arquivos enviados para GitHub!
    echo.
    echo 🌐 Agora o Render.com vai atualizar automaticamente.
    echo.
) else (
    echo ❌ Erro ao enviar. Verifique suas credenciais.
)

echo.
echo ============================================
echo Pressione qualquer tecla para sair...
echo ============================================
pause >nul

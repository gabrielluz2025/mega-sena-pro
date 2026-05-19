@echo off
chcp 65001 >nul
title Mega Sena Nexus v5.0 - Development Server

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     🚀 MEGA SENA NEXUS v5.0 - Development Server          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar se estamos na pasta correta
if not exist "package.json" (
    echo ❌ ERRO: package.json não encontrado!
    echo Por favor, execute este arquivo na raiz do projeto.
    pause
    exit /b 1
)

echo ✅ Pasta correta detectada
echo.

REM Instalar cross-env se não tiver
echo 📦 Verificando dependências globais...
npm list -g cross-env >nul 2>&1
if errorlevel 1 (
    echo ⚙️  Instalando cross-env...
    npm install -g cross-env
)

echo.
echo 🔄 Iniciando servidor de desenvolvimento...
echo 📍 URL: http://localhost:5173
echo 📍 API: http://localhost:3000/api/trpc
echo.
echo ⏹️  Pressione CTRL+C para parar o servidor
echo.

REM Iniciar o servidor
npx cross-env NODE_ENV=development tsx watch server/_core/index.ts

pause

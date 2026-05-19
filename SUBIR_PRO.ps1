# Script PowerShell para subir Mega Sena PRO v2
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  MEGA SENA PRO v2 - SUBIR PARA GITHUB" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se git está instalado
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Git não encontrado"
    }
    Write-Host "[OK] $gitVersion" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "[ERRO] Git não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale o Git em: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione ENTER para sair"
    exit 1
}

Write-Host ""

# Configurar git
git config --global user.email "megasena@pro.com" 2>$null
git config --global user.name "Mega Sena PRO" 2>$null

# Inicializar repositório se não existir
if (-not (Test-Path .git)) {
    Write-Host "[*] Inicializando repositório..." -ForegroundColor Yellow
    git init
    Write-Host ""
}

# Preparar arquivos
Write-Host "[*] Preparando arquivos..." -ForegroundColor Yellow
Write-Host ""

$arquivos = @('pro.html', 'server.js', 'data.json', 'concursos.json', 'package.json', 'render.yaml', '.gitignore')

foreach ($arq in $arquivos) {
    if (Test-Path $arq) {
        git add $arq 2>$null
        Write-Host "  ✓ $arq" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $arq (não encontrado)" -ForegroundColor Red
    }
}

Write-Host ""

# Criar commit
Write-Host "[*] Criando commit..." -ForegroundColor Yellow
git commit -m "Mega Sena PRO v2 - Sistema Unificado" -m "Dashboard IA com 4 abas unificadas" -m "IA treina com todos os concursos" -m "Persistência no Render.com" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Commit criado!" -ForegroundColor Green
} else {
    Write-Host "[INFO] Nada de novo para commitar" -ForegroundColor Yellow
}

Write-Host ""

# Verificar remote
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[AVISO] Remote do GitHub não configurado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute primeiro o script: SUBIR_GITHUB_v2.bat" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione ENTER para sair"
    exit 1
}

Write-Host "[*] Enviando para GitHub..." -ForegroundColor Yellow
Write-Host ""

try {
    git push origin main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git push origin master 2>$null
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "============================================" -ForegroundColor Green
        Write-Host "  SUCESSO! Arquivos enviados!" -ForegroundColor Green
        Write-Host "============================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "O Render.com vai atualizar automaticamente." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Arquivos enviados:" -ForegroundColor White
        foreach ($arq in $arquivos) {
            if (Test-Path $arq) {
                Write-Host "  • $arq" -ForegroundColor Gray
            }
        }
        Write-Host ""
    } else {
        throw "Push falhou"
    }
} catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "  ERRO ao enviar!" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis causas:" -ForegroundColor Yellow
    Write-Host "  1. Não fez login no GitHub" -ForegroundColor White
    Write-Host "  2. Token expirado" -ForegroundColor White
    Write-Host "  3. Repositório não existe" -ForegroundColor White
    Write-Host ""
    Write-Host "Solução: Execute SUBIR_GITHUB_v2.bat primeiro" -ForegroundColor Cyan
    Write-Host ""
}

Read-Host "Pressione ENTER para fechar"

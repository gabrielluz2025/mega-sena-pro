@echo off
title Testar Mega Sena PRO
chcp 65001 >nul
color 0B

cls
echo ============================================
echo  TESTE RAPIDO - Mega Sena PRO
echo ============================================
echo.

echo Verificando se servidor esta rodando...
curl -s http://localhost:8080/api/existe-checkpoint > teste_resultado.txt 2>&1

if %errorlevel% == 0 (
    echo ✅ Servidor ESTA respondendo!
    echo.
    echo Resultado:
    type teste_resultado.txt
    echo.
    echo ============================================
    echo  Tudo OK! Pode usar o sistema.
    echo ============================================
) else (
    echo ❌ Servidor NAO esta respondendo!
    echo.
    echo Possiveis causas:
    echo  - Servidor nao foi iniciado
    echo  - Porta 8080 ocupada
    echo  - Erro no server.js
    echo.
    echo Solucao: execute EMERGENCIA.bat
    echo ============================================
)

del teste_resultado.txt 2>nul
echo.
pause

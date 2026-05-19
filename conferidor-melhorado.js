/**
 * Módulo de Conferidor Melhorado
 * Adiciona conferência em massa, notificações e cálculo de premiação
 */

// ============================================================
// CONFERÊNCIA AVANÇADA
// ============================================================

/**
 * Confere um bilhete contra um resultado com análise completa
 */
function conferirBilheteAvancado(numerosJogo, numerosResultado) {
    if (!numerosJogo || !numerosResultado || numerosJogo.length !== 6 || numerosResultado.length !== 6) {
        return null;
    }
    
    const jogoSet = new Set(numerosJogo);
    const acertos = numerosResultado.filter(n => jogoSet.has(n));
    
    const resultado = {
        acertos: acertos.length,
        numerosAcertados: acertos.sort((a, b) => a - b),
        numerosFaltando: numerosJogo.filter(n => !jogoSet.has(n)).sort((a, b) => a - b),
        premiacao: calcularPremiacao(acertos.length),
        percentualAcerto: Math.round((acertos.length / 6) * 100),
        analise: analisarBilhete(numerosJogo, numerosResultado, acertos)
    };
    
    return resultado;
}

/**
 * Calcula o tipo de premiação
 */
function calcularPremiacao(acertos) {
    const tabelaPremios = {
        6: { nome: 'SENA', descricao: '🎉 PARABÉNS! Você acertou a SENA!', cor: 'gold', efeito: true },
        5: { nome: 'QUINA', descricao: '🎊 Excelente! Você acertou a QUINA!', cor: 'emerald', efeito: true },
        4: { nome: 'QUADRA', descricao: '✨ Bom! Você acertou a QUADRA!', cor: 'blue', efeito: false },
        3: { nome: 'TERNO', descricao: '👍 Você acertou o TERNO', cor: 'slate', efeito: false },
        2: { nome: 'DUQUE', descricao: 'Você acertou o DUQUE', cor: 'slate', efeito: false },
        1: { nome: 'UM ACERTO', descricao: 'Um número acertado', cor: 'slate', efeito: false },
        0: { nome: 'NENHUM ACERTO', descricao: 'Nenhum número acertado', cor: 'slate', efeito: false }
    };
    
    return tabelaPremios[acertos] || tabelaPremios[0];
}

/**
 * Analisa características do bilhete
 */
function analisarBilhete(numerosJogo, numerosResultado, acertos) {
    const analise = {
        pares: 0,
        impares: 0,
        dezenas: {},
        quadrantes: { q1: 0, q2: 0, q3: 0, q4: 0 },
        somaTotal: 0,
        atrasoMedio: 0
    };
    
    numerosJogo.forEach(num => {
        analise.somaTotal += num;
        if (num % 2 === 0) analise.pares++;
        else analise.impares++;
        
        const dezena = Math.ceil(num / 10);
        analise.dezenas[dezena] = (analise.dezenas[dezena] || 0) + 1;
        
        if (num <= 15) analise.quadrantes.q1++;
        else if (num <= 30) analise.quadrantes.q2++;
        else if (num <= 45) analise.quadrantes.q3++;
        else analise.quadrantes.q4++;
    });
    
    // Calcular atraso médio dos números acertados
    if (acertos.length > 0 && estatisticas && estatisticas.atraso) {
        const atrasosAcertos = acertos.map(n => estatisticas.atraso[n] || 0);
        analise.atrasoMedio = Math.round(atrasosAcertos.reduce((a, b) => a + b, 0) / atrasosAcertos.length);
    }
    
    return analise;
}

// ============================================================
// CONFERÊNCIA EM MASSA
// ============================================================

/**
 * Confere múltiplos bilhetes contra um resultado
 */
function conferirMultiplosBilhetes(bilhetes, resultadoNumeros) {
    if (!Array.isArray(bilhetes) || bilhetes.length === 0) {
        return [];
    }
    
    const resultados = bilhetes.map((bilhete, idx) => {
        const resultado = conferirBilheteAvancado(bilhete.numeros || bilhete, resultadoNumeros);
        return {
            id: idx,
            bilhete: bilhete,
            resultado: resultado
        };
    });
    
    // Ordenar por acertos (descendente)
    return resultados.sort((a, b) => (b.resultado?.acertos || 0) - (a.resultado?.acertos || 0));
}

/**
 * Importa bilhetes de um arquivo CSV
 */
function importarBilhetesCSV(conteudoCSV) {
    const linhas = conteudoCSV.trim().split('\n');
    const bilhetes = [];
    
    linhas.forEach((linha, idx) => {
        if (idx === 0) return; // Pular cabeçalho
        
        const partes = linha.split(',');
        if (partes.length >= 6) {
            const numeros = partes.slice(0, 6).map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 60);
            if (numeros.length === 6) {
                bilhetes.push({
                    numeros: numeros.sort((a, b) => a - b),
                    origem: 'importado'
                });
            }
        }
    });
    
    return bilhetes;
}

// ============================================================
// NOTIFICAÇÕES E EFEITOS VISUAIS
// ============================================================

/**
 * Mostra notificação de resultado com efeitos
 */
function mostrarNotificacaoResultado(resultado) {
    const premiacao = resultado.premiacao;
    
    if (premiacao.efeito) {
        // Efeito de celebração para grandes prêmios
        triggerCelebracaoVisual();
    }
    
    // Criar notificação visual
    const notificacao = document.createElement('div');
    notificacao.className = `fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-6 rounded-2xl glass border-2 max-w-md w-11/12 animate-bounce`;
    notificacao.style.borderColor = `var(--accent-${premiacao.cor})`;
    
    notificacao.innerHTML = `
        <div class="text-center">
            <div class="text-4xl mb-2">${premiacao.efeito ? '🎉' : '📊'}</div>
            <h3 class="text-lg font-bold mb-2">${premiacao.descricao}</h3>
            <div class="text-2xl font-mono font-bold text-emerald-400 mb-3">
                ${resultado.numerosAcertados.join(', ')}
            </div>
            <div class="text-sm text-slate-400">
                ${resultado.acertos} de 6 números acertados (${resultado.percentualAcerto}%)
            </div>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notificacao.remove();
    }, 5000);
}

/**
 * Trigger de efeito visual de celebração
 */
function triggerCelebracaoVisual() {
    // Criar confetes
    for (let i = 0; i < 50; i++) {
        const confete = document.createElement('div');
        confete.style.position = 'fixed';
        confete.style.left = Math.random() * 100 + '%';
        confete.style.top = '-10px';
        confete.style.width = '10px';
        confete.style.height = '10px';
        confete.style.backgroundColor = ['#fbbf24', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e'][Math.floor(Math.random() * 5)];
        confete.style.borderRadius = '50%';
        confete.style.zIndex = '9999';
        confete.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
        
        document.body.appendChild(confete);
        
        setTimeout(() => confete.remove(), 4000);
    }
    
    // Adicionar CSS para animação de queda
    if (!document.getElementById('confete-style')) {
        const style = document.createElement('style');
        style.id = 'confete-style';
        style.innerHTML = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================================
// HISTÓRICO DE CONFERÊNCIAS
// ============================================================

var historicoConferencias = [];

/**
 * Salva uma conferência no histórico
 */
function salvarConferencia(bilhete, resultado) {
    const conferencia = {
        id: Date.now(),
        bilhete: bilhete,
        resultado: resultado,
        timestamp: new Date().toISOString()
    };
    
    historicoConferencias.unshift(conferencia);
    
    // Manter apenas as últimas 100
    if (historicoConferencias.length > 100) {
        historicoConferencias = historicoConferencias.slice(0, 100);
    }
    
    localStorage.setItem('megaSenaPro_historicoConferencias', JSON.stringify(historicoConferencias));
    
    // Sincronizar com servidor
    sincronizarConferenciasServidor();
}

/**
 * Carrega o histórico de conferências
 */
function carregarHistoricoConferencias() {
    try {
        const saved = localStorage.getItem('megaSenaPro_historicoConferencias');
        if (saved) {
            historicoConferencias = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Erro ao carregar histórico de conferências:', e);
    }
}

/**
 * Sincroniza conferências com servidor
 */
async function sincronizarConferenciasServidor() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        await fetch('/api/salvar-conferencias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conferencias: historicoConferencias }),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
    } catch (erro) {
        console.warn('⚠️ Erro ao sincronizar conferências:', erro.message);
    }
}

// ============================================================
// ESTATÍSTICAS DE CONFERÊNCIAS
// ============================================================

/**
 * Calcula estatísticas de conferências
 */
function calcularEstatisticasConferencias() {
    if (historicoConferencias.length === 0) {
        return null;
    }
    
    const stats = {
        totalConferencias: historicoConferencias.length,
        totalSenas: 0,
        totalQuinas: 0,
        totalQuadras: 0,
        melhorAcerto: 0,
        acertoMedio: 0,
        acertosPorNivel: { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 }
    };
    
    let totalAcertos = 0;
    
    historicoConferencias.forEach(conf => {
        const acertos = conf.resultado.acertos;
        totalAcertos += acertos;
        stats.melhorAcerto = Math.max(stats.melhorAcerto, acertos);
        stats.acertosPorNivel[acertos]++;
        
        if (acertos === 6) stats.totalSenas++;
        else if (acertos === 5) stats.totalQuinas++;
        else if (acertos === 4) stats.totalQuadras++;
    });
    
    stats.acertoMedio = Math.round((totalAcertos / stats.totalConferencias) * 100) / 100;
    
    return stats;
}

// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

console.log('✅ Módulo de Conferidor Melhorado carregado');

/**
 * Módulo de Automação e Performance IA
 * Responsável pelo processamento em tempo real do histórico e aceleração de sugestões
 */

// ============================================================
// PROCESSAMENTO EM TEMPO REAL DO HISTÓRICO
// ============================================================

var processamentoAtivo = false;
var estatisticasProcessamento = {
    totalProcessado: 0,
    totalAcertos: 0,
    senas: 0,
    quinas: 0,
    quadras: 0,
    erros: 0,
    taxaSucesso: 0
};

/**
 * Inicia o processamento automático e contínuo do histórico
 */
async function iniciarProcessamentoHistoricoRealtime() {
    if (processamentoAtivo) return;
    processamentoAtivo = true;
    
    console.log('🚀 Iniciando processamento do histórico em tempo real...');
    
    // Atualizar UI
    const badge = document.getElementById('headerAiStatus');
    const badgeText = document.getElementById('headerAiText');
    if(badge) { badge.classList.remove('hidden'); badge.className = 'ai-badge learning hidden md:flex'; }
    if(badgeText) badgeText.textContent = 'IA Processando Histórico...';
    
    await processarLoteHistorico();
}

/**
 * Processa um lote de concursos do histórico
 */
async function processarLoteHistorico() {
    if (!processamentoAtivo) return;
    
    const todos = historicoSorteios.concat(concursosCustomizados);
    const semSugestao = todos.filter(c => {
        const cId = c.concurso || c.id || 0;
        return !historicoSugestoesIA.find(s => s.concursoId === cId);
    });
    
    if (semSugestao.length === 0) {
        console.log('✅ Todo o histórico já foi processado.');
        const badgeText = document.getElementById('headerAiText');
        if(badgeText) badgeText.textContent = 'IA Histórico Completo ✓';
        processamentoAtivo = false;
        return;
    }
    
    const sorted = Object.entries(estatisticas.frequencia)
        .map(e => ({ numero: parseInt(e[0]), freq: e[1] }))
        .sort((a, b) => b.freq - a.freq);
        
    // Processar em lotes menores para manter a fluidez
    const tamanhoLote = 50;
    const lote = semSugestao.slice(0, tamanhoLote);
    
    for (let i = 0; i < lote.length; i++) {
        const c = lote[i];
        const cId = c.concurso || c.id || 0;
        
        // Selecionar melhor estratégia atual ou rotacionar
        const estAtual = rankingEstrategias[0] || ESTRATEGIAS[i % ESTRATEGIAS.length];
        const seed = cId * 1000 + (Date.now() % 1000);
        const numeros = gerarPrevisaoPorEstrategia(sorted, estAtual.id || 'top6', seed);
        const acertos = calcularAcertos(numeros, c.numeros);
        
        const novaSug = {
            id: Date.now() + i,
            concursoId: cId,
            numeros: numeros,
            estrategia: estAtual.nome || 'Top 6',
            acertos: acertos,
            geracao: geracaoTreinamento,
            timestamp: new Date().toISOString()
        };
        
        historicoSugestoesIA.push(novaSug);
        
        // Atualizar estatísticas de processamento
        estatisticasProcessamento.totalProcessado++;
        estatisticasProcessamento.totalAcertos += acertos;
        if (acertos === 6) estatisticasProcessamento.senas++;
        else if (acertos === 5) estatisticasProcessamento.quinas++;
        else if (acertos === 4) estatisticasProcessamento.quadras++;
        else if (acertos < 4) estatisticasProcessamento.erros++;
        
        // Atualizar UI a cada item processado para dar sensação de tempo real
        atualizarPainelPerformanceRealtime();
    }
    
    // Salvar progresso
    salvarSugestoesIA();
    
    // Agendar próximo lote (curto intervalo para ser rápido)
    setTimeout(processarLoteHistorico, 100);
}

/**
 * Atualiza o painel de performance na interface
 */
function atualizarPainelPerformanceRealtime() {
    const total = estatisticasProcessamento.totalProcessado;
    if (total === 0) return;
    
    estatisticasProcessamento.taxaSucesso = ((estatisticasProcessamento.totalAcertos / (total * 6)) * 100).toFixed(2);
    
    // Tentar encontrar elementos na UI para atualizar
    const elTotal = document.getElementById('totalProcessadoRealtime');
    const elAcertos = document.getElementById('totalAcertosRealtime');
    const elTaxa = document.getElementById('taxaSucessoRealtime');
    const elSenas = document.getElementById('totalSenasRealtime');
    const elQuinas = document.getElementById('totalQuinasRealtime');
    const elQuadras = document.getElementById('totalQuadrasRealtime');
    
    if (elTotal) elTotal.textContent = total;
    if (elAcertos) elAcertos.textContent = estatisticasProcessamento.totalAcertos;
    if (elTaxa) elTaxa.textContent = estatisticasProcessamento.taxaSucesso + '%';
    if (elSenas) elSenas.textContent = estatisticasProcessamento.senas;
    if (elQuinas) elQuinas.textContent = estatisticasProcessamento.quinas;
    if (elQuadras) elQuadras.textContent = estatisticasProcessamento.quadras;
    
    // Atualizar tabela se estiver visível
    if (document.getElementById('tab-historico').classList.contains('active')) {
        renderizarTabelaHistorico();
    }
}

// ============================================================
// ACELERAÇÃO DE SUGESTÕES (INTERVALO DE 2 MINUTOS)
// ============================================================

var intervaloSugestaoRapida = null;
const INTERVALO_SUGESTAO_MS = 120000; // 2 minutos

/**
 * Inicia o ciclo de sugestões rápidas
 */
function iniciarCicloSugestoesRapidas() {
    if (intervaloSugestaoRapida) clearInterval(intervaloSugestaoRapida);
    
    console.log('⚡ Iniciando ciclo de sugestões rápidas (2 min)...');
    
    // Primeira execução imediata
    gerarSugestaoProximoJogo();
    
    // Agendar execuções periódicas
    intervaloSugestaoRapida = setInterval(() => {
        console.log('⚡ Gerando sugestão automática (Ciclo 2 min)...');
        gerarSugestaoProximoJogo();
    }, INTERVALO_SUGESTAO_MS);
    
    isAutoUpdateActive = true;
    atualizarBotaoAutoSugestao();
}

/**
 * Para o ciclo de sugestões rápidas
 */
function pararCicloSugestoesRapidas() {
    if (intervaloSugestaoRapida) {
        clearInterval(intervaloSugestaoRapida);
        intervaloSugestaoRapida = null;
    }
    isAutoUpdateActive = false;
    atualizarBotaoAutoSugestao();
}

/**
 * Atualiza o estado do botão de auto-sugestão na UI
 */
function atualizarBotaoAutoSugestao() {
    const btn = document.getElementById('btnAutoSugestao');
    const icon = document.getElementById('iconAutoSugestao');
    const text = document.getElementById('textAutoSugestao');
    
    if (btn && icon && text) {
        if (isAutoUpdateActive) {
            btn.className = 'px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-2 text-sm animate-pulse';
            icon.className = 'fas fa-sync fa-spin';
            text.textContent = 'Auto: 2 MIN';
        } else {
            btn.className = 'px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center gap-2 text-sm';
            icon.className = 'fas fa-play';
            text.textContent = 'Auto: OFF';
        }
    }
}

// ============================================================
// INTEGRAÇÃO E OVERRIDES
// ============================================================

/**
 * Override da função original para usar o novo intervalo
 */
function toggleAutoSugestao() {
    if (isAutoUpdateActive) {
        pararCicloSugestoesRapidas();
        showToast('Auto-sugestão desativada', 'info');
    } else {
        iniciarCicloSugestoesRapidas();
        showToast('Auto-sugestão ativada (Intervalo: 2 min)', 'success');
    }
}

// Inicializar quando o módulo carregar
console.log('✅ Módulo de Automação e Performance IA carregado');

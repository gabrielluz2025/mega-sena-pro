/**
 * Módulo de Persistência Melhorada para Mega Sena Pro
 * Responsável por sincronizar o treinamento da IA com o servidor
 * Garante que os ciclos de aprendizado sejam salvos e recuperados
 */

// ============================================================
// CHECKPOINT E SINCRONIZAÇÃO COM SERVIDOR
// ============================================================

/**
 * Salva um checkpoint completo do treinamento no servidor
 * Inclui: geração atual, pesos aprendidos, histórico de evolução
 */
async function salvarCheckpointCompleto() {
    if (!conhecimentoEstrategias || !rankingEstrategias.length) return false;
    
    try {
        const checkpoint = {
            geracaoAtual: geracaoTreinamento,
            timestamp: new Date().toISOString(),
            populacao: rankingEstrategias,
            pesosAprendidos: conhecimentoEstrategias.pesosAprendidos || {},
            historicoEvolucao: historicoEvolucaoPesos,
            totalAnalises: conhecimentoEstrategias.totalAnalises || 0,
            ultimaAtualizacao: conhecimentoEstrategias.ultimaAtualizacao,
            aprendizadoPorResultado: conhecimentoEstrategias.aprendizadoPorResultado || []
        };
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/salvar-checkpoint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkpoint),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
            console.log('✅ Checkpoint salvo com sucesso! Geração:', geracaoTreinamento);
            return true;
        }
    } catch (erro) {
        console.warn('⚠️ Erro ao salvar checkpoint no servidor:', erro.message);
    }
    
    return false;
}

/**
 * Carrega o checkpoint do servidor para recuperar o estado anterior
 */
async function carregarCheckpointServidor() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/carregar-checkpoint', {
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
            const data = await response.json();
            if (data.sucesso && data.dados) {
                console.log('✅ Checkpoint carregado! Geração:', data.dados.geracaoAtual);
                return data.dados;
            }
        }
    } catch (erro) {
        console.warn('⚠️ Erro ao carregar checkpoint do servidor:', erro.message);
    }
    
    return null;
}

/**
 * Verifica se existe checkpoint no servidor
 */
async function existeCheckpointServidor() {
    try {
        const response = await fetch('/api/existe-checkpoint');
        const data = await response.json();
        return data.existe === true;
    } catch (erro) {
        console.warn('⚠️ Erro ao verificar checkpoint:', erro.message);
        return false;
    }
}

/**
 * Restaura o estado da IA a partir de um checkpoint
 */
function restaurarCheckpoint(checkpoint) {
    if (!checkpoint) return false;
    
    try {
        geracaoTreinamento = checkpoint.geracaoAtual || 0;
        rankingEstrategias = checkpoint.populacao || [];
        conhecimentoEstrategias = {
            pesosAprendidos: checkpoint.pesosAprendidos || {},
            totalAnalises: checkpoint.totalAnalises || 0,
            ultimaAtualizacao: checkpoint.ultimaAtualizacao || new Date().toISOString(),
            aprendizadoPorResultado: checkpoint.aprendizadoPorResultado || [],
            ranking: rankingEstrategias
        };
        historicoEvolucaoPesos = checkpoint.historicoEvolucao || [];
        
        console.log('✅ Checkpoint restaurado! Geração:', geracaoTreinamento);
        return true;
    } catch (erro) {
        console.error('❌ Erro ao restaurar checkpoint:', erro);
        return false;
    }
}

// ============================================================
// PERSISTÊNCIA DE PREVISÕES
// ============================================================

/**
 * Salva o histórico de previsões (sugestões) no servidor
 */
async function salvarPrevisoes() {
    if (!historicoSugestoesProximo || historicoSugestoesProximo.length === 0) return false;
    
    try {
        const melhor = historicoSugestoesProximo[0] || null;
        
        const dados = {
            historico: historicoSugestoesProximo,
            melhor: melhor,
            geracaoAtual: geracaoTreinamento,
            timestamp: new Date().toISOString()
        };
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/salvar-previsoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
            console.log('✅ Previsões salvas no servidor!');
            return true;
        }
    } catch (erro) {
        console.warn('⚠️ Erro ao salvar previsões:', erro.message);
    }
    
    return false;
}

/**
 * Carrega o histórico de previsões do servidor
 */
async function carregarPrevisoes() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/carregar-previsoes', {
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
            const data = await response.json();
            if (data.sucesso) {
                console.log('✅ Previsões carregadas! Total:', data.total);
                return {
                    historico: data.historico || [],
                    melhor: data.melhor || null
                };
            }
        }
    } catch (erro) {
        console.warn('⚠️ Erro ao carregar previsões:', erro.message);
    }
    
    return { historico: [], melhor: null };
}

// ============================================================
// SINCRONIZAÇÃO CENTRALIZADA
// ============================================================

/**
 * Sincroniza todo o estado da IA com o servidor
 * Chamada periodicamente ou após eventos importantes
 */
async function sincronizarEstadoCompleto() {
    console.log('🔄 Sincronizando estado da IA com servidor...');
    
    const resultados = {
        checkpoint: await salvarCheckpointCompleto(),
        previsoes: await salvarPrevisoes(),
        conhecimento: await salvarConhecimentoServidor()
    };
    
    const sucesso = resultados.checkpoint || resultados.previsoes || resultados.conhecimento;
    
    if (sucesso) {
        console.log('✅ Sincronização concluída com sucesso!');
    } else {
        console.warn('⚠️ Sincronização parcial ou falha');
    }
    
    return resultados;
}

/**
 * Inicializa o sistema carregando o estado anterior do servidor
 */
async function inicializarComRecuperacao() {
    console.log('🚀 Inicializando sistema com recuperação de estado...');
    
    // 1. Tentar carregar checkpoint do servidor
    const checkpointServidor = await carregarCheckpointServidor();
    
    if (checkpointServidor) {
        // Restaurar estado do checkpoint
        const restaurado = restaurarCheckpoint(checkpointServidor);
        
        if (restaurado) {
            console.log('✅ Sistema recuperado do checkpoint!');
            // Sincronizar com localStorage também
            localStorage.setItem('megaSenaPro_conhecimento', JSON.stringify(conhecimentoEstrategias));
            localStorage.setItem('megaSenaPro_evolucao', JSON.stringify(historicoEvolucaoPesos));
            return true;
        }
    }
    
    // 2. Se não houver checkpoint, tentar carregar do localStorage
    console.log('📦 Carregando do localStorage...');
    carregarConhecimento();
    carregarDadosSalvos();
    
    return false;
}

// ============================================================
// APRIMORAMENTO DO TREINAMENTO
// ============================================================

/**
 * Versão melhorada de salvarConhecimento que também salva no servidor
 */
async function salvarConhecimentoMelhorado() {
    if (rankingEstrategias.length > 0) {
        conhecimentoEstrategias = Object.assign({}, conhecimentoEstrategias, {
            ranking: rankingEstrategias,
            totalAnalises: (conhecimentoEstrategias.totalAnalises || 0) + 1,
            ultimaAtualizacao: new Date().toISOString(),
            pesosAprendidos: conhecimentoEstrategias.pesosAprendidos || {},
            geracaoAtual: geracaoTreinamento
        });
        
        // Salvar localmente
        localStorage.setItem('megaSenaPro_conhecimento', JSON.stringify(conhecimentoEstrategias));
        
        // Salvar histórico de evolução
        historicoEvolucaoPesos.push({
            timestamp: new Date().toISOString(),
            geracao: geracaoTreinamento,
            pesos: Object.assign({}, conhecimentoEstrategias.pesosAprendidos || {})
        });
        
        if (historicoEvolucaoPesos.length > 100) {
            historicoEvolucaoPesos = historicoEvolucaoPesos.slice(-100);
        }
        
        localStorage.setItem('megaSenaPro_evolucao', JSON.stringify(historicoEvolucaoPesos));
        
        // Atualizar status
        atualizarStatusIA();
        
        // Salvar no servidor de forma assíncrona
        await sincronizarEstadoCompleto();
    }
}

/**
 * Versão melhorada de gerarSugestaoProximoJogo com melhor persistência
 */
async function gerarSugestaoProximoJogoMelhorada() {
    if (!estatisticas || !estatisticas.frequencia) {
        showToast('Aguarde carregar dados...', 'warning');
        return;
    }
    
    const sorted = Object.entries(estatisticas.frequencia)
        .map(e => ({ numero: parseInt(e[0]), freq: e[1] }))
        .sort((a, b) => b.freq - a.freq);
    
    const ultimoConcurso = Math.max.apply(null, historicoSorteios.map(h => h.concurso || h.id || 0));
    const proximoConcurso = ultimoConcurso + 1;
    const timestamp = new Date();
    const seedBase = (proximoConcurso * 10000) + (geracaoTreinamento * 1000) + (timestamp.getTime() % 10000);
    
    const sugestoesPorEstrategia = ESTRATEGIAS.map((est, idx) => {
        const seedEst = seedBase + (idx * 100);
        const numeros = gerarPrevisaoPorEstrategia(sorted, est.id, seedEst);
        const pesoAprendido = (conhecimentoEstrategias.pesosAprendidos && conhecimentoEstrategias.pesosAprendidos[est.id]) || 1.0;
        const mediaHistorica = (resultadosPorEstrategia[est.id] && resultadosPorEstrategia[est.id].mediaAcertos) || 2.0;
        
        // Melhoria: Considerar o progresso real do treinamento
        const bonusGeracao = Math.min(2.0, geracaoTreinamento * 0.1);
        const score = (parseFloat(mediaHistorica) * pesoAprendido) + bonusGeracao;
        
        // Confiança mais robusta: base maior + crescimento com gerações
        const confCalculada = Math.round((score / 8.0) * 100);
        const confiancaFinal = Math.min(99, Math.max(70 + Math.min(15, geracaoTreinamento * 0.5), confCalculada));
        
        return {
            estrategia: est.nome,
            estrategiaId: est.id,
            numeros: numeros,
            confianca: confiancaFinal,
            mediaHistorica: score,
            timestamp: timestamp.toISOString(),
            proximoConcurso: proximoConcurso,
            geracao: geracaoTreinamento,
            pesoAprendido: pesoAprendido
        };
    });
    
    sugestoesPorEstrategia.sort((a, b) => b.mediaHistorica - a.mediaHistorica);
    const melhor = sugestoesPorEstrategia[0];
    
    // Adicionar ao histórico
    historicoSugestoesProximo.unshift(Object.assign({}, melhor, { id: Date.now() }));
    if (historicoSugestoesProximo.length > 50) {
        historicoSugestoesProximo = historicoSugestoesProximo.slice(0, 50);
    }
    
    // Salvar localmente
    localStorage.setItem('megaSenaPro_sugestoesProximo', JSON.stringify(historicoSugestoesProximo));
    
    // Atualizar display
    atualizarDisplaySugestaoAtual(melhor);
    atualizarDisplayHistoricoSugestoes();
    
    // Salvar no servidor
    await salvarPrevisoes();
    
    showToast('Sugestão #' + proximoConcurso + ': ' + melhor.numeros.join(', ') + ' (Confiança: ' + melhor.confianca + '%)', 'success');
}

/**
 * Wrapper para o treinamento contínuo com sincronização
 */
async function treinamentoContinuoMelhorado() {
    if (analiseEmAndamento) {
        showToast('Análise já em andamento...', 'warning');
        return;
    }
    
    // Executar análise
    await iniciarAnalisePorEstrategia();
    
    // Salvar checkpoint após análise
    await salvarCheckpointCompleto();
    
    // Gerar nova sugestão
    await gerarSugestaoProximoJogoMelhorada();
}

// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

// Essas funções devem ser integradas ao código principal
console.log('✅ Módulo de Persistência Melhorada carregado');

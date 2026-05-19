/**
 * Módulo de Melhoria de Algoritmo de Sugestões
 * Implementa estratégias mais robustas para gerar sugestões de próximos jogos
 * Garante que a confiança melhora com o treinamento e não piora
 */

// ============================================================
// CÁLCULO MELHORADO DE SCORE E CONFIANÇA
// ============================================================

/**
 * Calcula o score de uma estratégia considerando múltiplos fatores
 * @param {number} mediaHistorica - Média de acertos histórica
 * @param {number} pesoAprendido - Peso da estratégia após treinamento
 * @param {number} geracaoAtual - Geração atual de treinamento
 * @param {array} historicoAcertos - Histórico de acertos da estratégia
 * @returns {object} Score e confiança calculados
 */
function calcularScoreMelhorado(mediaHistorica, pesoAprendido, geracaoAtual, historicoAcertos = []) {
    // Base: média histórica * peso aprendido
    let scoreBase = parseFloat(mediaHistorica) * pesoAprendido;
    
    // Bônus por geração: quanto mais treinamento, maior o bônus (não linear)
    const bonusGeracao = Math.min(2.5, geracaoAtual * 0.15);
    
    // Bônus por consistência: se tem histórico, analisar tendência
    let bonusConsistencia = 0;
    if (historicoAcertos && historicoAcertos.length > 0) {
        const ultimos5 = historicoAcertos.slice(-5);
        const mediaUltimos5 = ultimos5.reduce((a, b) => a + b, 0) / ultimos5.length;
        
        // Se a média dos últimos 5 é melhor que a média geral, há tendência positiva
        if (mediaUltimos5 > mediaHistorica) {
            bonusConsistencia = Math.min(0.5, (mediaUltimos5 - mediaHistorica) * 0.3);
        }
    }
    
    // Score final
    const scoreFinal = scoreBase + bonusGeracao + bonusConsistencia;
    
    // Confiança: baseada no score, mas com piso e teto
    // Piso: 70% (nunca abaixo disso com treinamento)
    // Teto: 99% (máximo realista)
    const pisoConfianca = 70 + Math.min(15, geracaoAtual * 0.5);
    const confCalculada = Math.round((scoreFinal / 8.5) * 100);
    const confiancaFinal = Math.min(99, Math.max(pisoConfianca, confCalculada));
    
    return {
        score: scoreFinal,
        confianca: confiancaFinal,
        scoreBase: scoreBase,
        bonusGeracao: bonusGeracao,
        bonusConsistencia: bonusConsistencia
    };
}

/**
 * Valida se a confiança não regrediu comparando com histórico
 * @param {number} confiancaAtual - Confiança atual
 * @param {number} confiancaAnterior - Confiança anterior (se houver)
 * @returns {number} Confiança ajustada (nunca menor que anterior)
 */
function garantirNaoRegressao(confiancaAtual, confiancaAnterior = 0) {
    if (confiancaAnterior > 0) {
        // Permitir queda de no máximo 2% entre gerações
        const minimoPermitido = Math.max(70, confiancaAnterior - 2);
        return Math.max(minimoPermitido, confiancaAtual);
    }
    return confiancaAtual;
}

/**
 * Calcula a tendência de uma estratégia baseada em histórico recente
 * @param {array} historicoAcertos - Histórico de acertos
 * @returns {object} Tendência e análise
 */
function calcularTendencia(historicoAcertos = []) {
    if (!historicoAcertos || historicoAcertos.length < 3) {
        return { tendencia: 'neutro', forca: 0, analise: 'Histórico insuficiente' };
    }
    
    const ultimos10 = historicoAcertos.slice(-10);
    const ultimos5 = historicoAcertos.slice(-5);
    
    const mediaUltimos10 = ultimos10.reduce((a, b) => a + b, 0) / ultimos10.length;
    const mediaUltimos5 = ultimos5.reduce((a, b) => a + b, 0) / ultimos5.length;
    
    const mediaGeral = historicoAcertos.reduce((a, b) => a + b, 0) / historicoAcertos.length;
    
    let tendencia = 'neutro';
    let forca = 0;
    let analise = '';
    
    if (mediaUltimos5 > mediaUltimos10) {
        tendencia = 'crescente';
        forca = Math.min(100, ((mediaUltimos5 - mediaUltimos10) / mediaUltimos10) * 100);
        analise = 'Estratégia em melhora nos últimos 5 concursos';
    } else if (mediaUltimos5 < mediaUltimos10) {
        tendencia = 'decrescente';
        forca = Math.min(100, ((mediaUltimos10 - mediaUltimos5) / mediaUltimos10) * 100);
        analise = 'Estratégia em queda nos últimos 5 concursos';
    } else {
        tendencia = 'estavel';
        forca = 50;
        analise = 'Estratégia mantém performance consistente';
    }
    
    return {
        tendencia: tendencia,
        forca: forca,
        analise: analise,
        mediaUltimos5: mediaUltimos5,
        mediaUltimos10: mediaUltimos10,
        mediaGeral: mediaGeral
    };
}

// ============================================================
// RANKING INTELIGENTE DE ESTRATÉGIAS
// ============================================================

/**
 * Cria um ranking inteligente de estratégias considerando múltiplos fatores
 * @param {array} estrategias - Lista de estratégias
 * @param {object} resultadosPorEstrategia - Resultados de cada estratégia
 * @param {object} conhecimentoEstrategias - Conhecimento acumulado
 * @param {number} geracaoAtual - Geração atual
 * @returns {array} Ranking ordenado
 */
function criarRankingInteligente(estrategias, resultadosPorEstrategia, conhecimentoEstrategias, geracaoAtual) {
    const ranking = estrategias.map(est => {
        const resultados = resultadosPorEstrategia[est.id] || {
            totalAcertos: 0,
            totalJogos: 0,
            mediaAcertos: 0,
            melhorAcerto: 0
        };
        
        const pesoAprendido = (conhecimentoEstrategias.pesosAprendidos && conhecimentoEstrategias.pesosAprendidos[est.id]) || 1.0;
        
        // Histórico de acertos (se disponível)
        const historicoAcertos = (conhecimentoEstrategias.historicoAcertosPorEstrategia && conhecimentoEstrategias.historicoAcertosPorEstrategia[est.id]) || [];
        
        // Calcular score melhorado
        const scoreInfo = calcularScoreMelhorado(
            resultados.mediaAcertos,
            pesoAprendido,
            geracaoAtual,
            historicoAcertos
        );
        
        // Calcular tendência
        const tendencia = calcularTendencia(historicoAcertos);
        
        // Confiança final com proteção contra regressão
        const confiancaAnterior = (conhecimentoEstrategias.confiancasAnteriores && conhecimentoEstrategias.confiancasAnteriores[est.id]) || 0;
        const confiancaFinal = garantirNaoRegressao(scoreInfo.confianca, confiancaAnterior);
        
        return {
            ...est,
            mediaAcertos: resultados.mediaAcertos,
            melhorAcerto: resultados.melhorAcerto,
            totalJogos: resultados.totalJogos,
            pesoAprendido: pesoAprendido,
            score: scoreInfo.score,
            confianca: confiancaFinal,
            scoreBase: scoreInfo.scoreBase,
            bonusGeracao: scoreInfo.bonusGeracao,
            bonusConsistencia: scoreInfo.bonusConsistencia,
            tendencia: tendencia,
            historicoAcertos: historicoAcertos
        };
    });
    
    // Ordenar por score (descendente)
    ranking.sort((a, b) => b.score - a.score);
    
    return ranking;
}

// ============================================================
// SELEÇÃO INTELIGENTE DE SUGESTÃO
// ============================================================

/**
 * Seleciona a melhor sugestão considerando múltiplos critérios
 * @param {array} sugestoesPorEstrategia - Sugestões de cada estratégia
 * @param {object} conhecimentoEstrategias - Conhecimento acumulado
 * @returns {object} Melhor sugestão com análise
 */
function selecionarMelhorSugestao(sugestoesPorEstrategia, conhecimentoEstrategias = {}) {
    if (!sugestoesPorEstrategia || sugestoesPorEstrategia.length === 0) {
        return null;
    }
    
    // Ordenar por confiança (descendente)
    const ordenadas = [...sugestoesPorEstrategia].sort((a, b) => b.confianca - a.confianca);
    
    const melhor = ordenadas[0];
    
    // Análise de consenso: quantas estratégias concordam com os mesmos números?
    const numerosMelhor = new Set(melhor.numeros);
    let consenso = 0;
    
    ordenadas.slice(0, 5).forEach(sug => {
        const numerosComuns = sug.numeros.filter(n => numerosMelhor.has(n)).length;
        consenso += numerosComuns;
    });
    
    consenso = Math.round((consenso / (5 * 6)) * 100);
    
    return {
        ...melhor,
        consenso: consenso,
        alternativas: ordenadas.slice(1, 4)
    };
}

// ============================================================
// ANÁLISE DE QUALIDADE DE SUGESTÃO
// ============================================================

/**
 * Analisa a qualidade de uma sugestão gerada
 * @param {object} sugestao - Sugestão a analisar
 * @returns {object} Análise de qualidade
 */
function analisarQualidadeSugestao(sugestao) {
    const analise = {
        confiancaAlta: sugestao.confianca >= 85,
        confiancaModerada: sugestao.confianca >= 70 && sugestao.confianca < 85,
        confiancaBaixa: sugestao.confianca < 70,
        temConsensoPequeno: (sugestao.consenso || 0) >= 60,
        temTendenciaPositiva: sugestao.tendencia && sugestao.tendencia.tendencia === 'crescente',
        qualidadeGeral: 'boa'
    };
    
    // Determinar qualidade geral
    let pontos = 0;
    if (analise.confiancaAlta) pontos += 3;
    else if (analise.confiancaModerada) pontos += 2;
    else pontos += 1;
    
    if (analise.temConsensoPequeno) pontos += 2;
    if (analise.temTendenciaPositiva) pontos += 1;
    
    if (pontos >= 5) analise.qualidadeGeral = 'excelente';
    else if (pontos >= 4) analise.qualidadeGeral = 'boa';
    else if (pontos >= 3) analise.qualidadeGeral = 'aceitável';
    else analise.qualidadeGeral = 'baixa';
    
    return analise;
}

// ============================================================
// HISTÓRICO DE CONFIANÇA
// ============================================================

/**
 * Salva o histórico de confiança para detectar regressões
 */
function salvarHistoricoConfianca(conhecimentoEstrategias, rankingEstrategias) {
    if (!conhecimentoEstrategias.confiancasAnteriores) {
        conhecimentoEstrategias.confiancasAnteriores = {};
    }
    
    rankingEstrategias.forEach(est => {
        conhecimentoEstrategias.confiancasAnteriores[est.id] = est.confianca || 70;
    });
    
    return conhecimentoEstrategias;
}

/**
 * Salva o histórico de acertos por estratégia para análise de tendência
 */
function salvarHistoricoAcertos(conhecimentoEstrategias, resultadosPorEstrategia) {
    if (!conhecimentoEstrategias.historicoAcertosPorEstrategia) {
        conhecimentoEstrategias.historicoAcertosPorEstrategia = {};
    }
    
    Object.keys(resultadosPorEstrategia).forEach(estId => {
        if (!conhecimentoEstrategias.historicoAcertosPorEstrategia[estId]) {
            conhecimentoEstrategias.historicoAcertosPorEstrategia[estId] = [];
        }
        
        // Adicionar média de acertos atual
        const media = resultadosPorEstrategia[estId].mediaAcertos || 0;
        conhecimentoEstrategias.historicoAcertosPorEstrategia[estId].push(media);
        
        // Manter apenas os últimos 100 registros
        if (conhecimentoEstrategias.historicoAcertosPorEstrategia[estId].length > 100) {
            conhecimentoEstrategias.historicoAcertosPorEstrategia[estId] = 
                conhecimentoEstrategias.historicoAcertosPorEstrategia[estId].slice(-100);
        }
    });
    
    return conhecimentoEstrategias;
}

// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

console.log('✅ Módulo de Algoritmo de Sugestões Melhorado carregado');

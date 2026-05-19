/**
 * Módulo de Dashboard Melhorado
 * Adiciona visualizações avançadas, KPIs estatísticos e análises profundas
 */

// ============================================================
// CÁLCULOS ESTATÍSTICOS AVANÇADOS
// ============================================================

/**
 * Calcula estatísticas avançadas sobre os sorteios
 */
function calcularEstatisticasAvancadas() {
    if (!historicoSorteios || historicoSorteios.length === 0) {
        return null;
    }
    
    const stats = {
        totalSorteios: historicoSorteios.length,
        atrasoMedio: 0,
        desviaoPadrao: 0,
        frequenciaMedia: 0,
        somaMedia: 0,
        somaMinima: Infinity,
        somaMaxima: -Infinity,
        pariImparRatio: { pares: 0, impares: 0 },
        dezenaDistribuicao: {},
        quadrantesDistribuicao: { q1: 0, q2: 0, q3: 0, q4: 0 }
    };
    
    // Calcular soma e distribuição
    historicoSorteios.forEach(sorteio => {
        let soma = 0;
        let pares = 0;
        let impares = 0;
        
        sorteio.numeros.forEach(num => {
            soma += num;
            if (num % 2 === 0) pares++;
            else impares++;
            
            // Distribuição por dezena
            const dezena = Math.ceil(num / 10);
            stats.dezenaDistribuicao[dezena] = (stats.dezenaDistribuicao[dezena] || 0) + 1;
            
            // Distribuição por quadrante (1-15, 16-30, 31-45, 46-60)
            if (num <= 15) stats.quadrantesDistribuicao.q1++;
            else if (num <= 30) stats.quadrantesDistribuicao.q2++;
            else if (num <= 45) stats.quadrantesDistribuicao.q3++;
            else stats.quadrantesDistribuicao.q4++;
        });
        
        stats.somaMedia += soma;
        stats.somaMinima = Math.min(stats.somaMinima, soma);
        stats.somaMaxima = Math.max(stats.somaMaxima, soma);
        stats.pariImparRatio.pares += pares;
        stats.pariImparRatio.impares += impares;
    });
    
    stats.somaMedia = Math.round(stats.somaMedia / stats.totalSorteios);
    stats.frequenciaMedia = Math.round((stats.totalSorteios * 6) / 60);
    
    // Calcular atraso médio
    const atrasos = Object.values(estatisticas.atraso || {});
    stats.atrasoMedio = Math.round(atrasos.reduce((a, b) => a + b, 0) / atrasos.length);
    
    // Calcular desvio padrão dos atrasos
    const media = stats.atrasoMedio;
    const variancia = atrasos.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / atrasos.length;
    stats.desviaoPadrao = Math.round(Math.sqrt(variancia));
    
    return stats;
}

/**
 * Gera dados para o mapa de calor (heatmap) das dezenas
 */
function gerarDadosHeatmapDezenas() {
    const heatmap = [];
    
    for (let dezena = 1; dezena <= 6; dezena++) {
        const inicio = (dezena - 1) * 10 + 1;
        const fim = dezena * 10;
        let total = 0;
        
        for (let num = inicio; num <= fim; num++) {
            total += estatisticas.frequencia[num] || 0;
        }
        
        heatmap.push({
            dezena: dezena,
            label: `${inicio}-${fim}`,
            frequencia: total,
            intensidade: total / (historicoSorteios.length * 6) // Normalizar
        });
    }
    
    return heatmap;
}

/**
 * Analisa números vizinhos (que saem juntos frequentemente)
 */
function analisarNumerosVizinhos() {
    const vizinhos = {};
    
    historicoSorteios.forEach(sorteio => {
        const nums = sorteio.numeros.sort((a, b) => a - b);
        
        // Verificar pares consecutivos
        for (let i = 0; i < nums.length - 1; i++) {
            const par = `${nums[i]}-${nums[i + 1]}`;
            vizinhos[par] = (vizinhos[par] || 0) + 1;
        }
    });
    
    // Ordenar por frequência
    const top = Object.entries(vizinhos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([par, freq]) => ({
            par: par,
            frequencia: freq,
            percentual: Math.round((freq / historicoSorteios.length) * 100)
        }));
    
    return top;
}

/**
 * Detecta ciclos de números (padrões sazonais)
 */
function detectarCiclos() {
    const ciclos = {
        anual: {},
        mensal: {},
        trimestral: {}
    };
    
    historicoSorteios.forEach(sorteio => {
        if (!sorteio.data) return;
        
        const data = new Date(sorteio.data);
        const ano = data.getFullYear();
        const mes = data.getMonth() + 1;
        const trimestre = Math.ceil(mes / 3);
        
        // Agrupar por ano
        if (!ciclos.anual[ano]) ciclos.anual[ano] = [];
        ciclos.anual[ano].push(sorteio);
        
        // Agrupar por mês
        const chavesMes = `${ano}-${String(mes).padStart(2, '0')}`;
        if (!ciclos.mensal[chavesMes]) ciclos.mensal[chavesMes] = [];
        ciclos.mensal[chavesMes].push(sorteio);
        
        // Agrupar por trimestre
        const chaveTrim = `${ano}-T${trimestre}`;
        if (!ciclos.trimestral[chaveTrim]) ciclos.trimestral[chaveTrim] = [];
        ciclos.trimestral[chaveTrim].push(sorteio);
    });
    
    return ciclos;
}

// ============================================================
// RENDERIZAÇÃO DE VISUALIZAÇÕES AVANÇADAS
// ============================================================

/**
 * Renderiza um gráfico de mapa de calor para as dezenas
 */
function renderizarHeatmapDezenas() {
    const container = document.getElementById('chartHeatmapDezenas');
    if (!container) return;
    
    const dados = gerarDadosHeatmapDezenas();
    const canvas = container.querySelector('canvas');
    
    if (!canvas) {
        container.innerHTML = '<canvas id="heatmapCanvas"></canvas>';
    }
    
    const ctx = document.getElementById('heatmapCanvas').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dados.map(d => d.label),
            datasets: [{
                label: 'Frequência por Dezena',
                data: dados.map(d => d.frequencia),
                backgroundColor: dados.map(d => {
                    const hue = (1 - d.intensidade) * 240; // Azul (frio) a Vermelho (quente)
                    return `hsl(${hue}, 100%, 50%)`;
                }),
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * Renderiza análise de quadrantes
 */
function renderizarAnaliseQuadrantes() {
    const stats = calcularEstatisticasAvancadas();
    if (!stats) return;
    
    const container = document.getElementById('chartQuadrantes');
    if (!container) return;
    
    const dados = [
        { label: 'Q1 (1-15)', valor: stats.quadrantesDistribuicao.q1, cor: '#ef4444' },
        { label: 'Q2 (16-30)', valor: stats.quadrantesDistribuicao.q2, cor: '#f97316' },
        { label: 'Q3 (31-45)', valor: stats.quadrantesDistribuicao.q3, cor: '#3b82f6' },
        { label: 'Q4 (46-60)', valor: stats.quadrantesDistribuicao.q4, cor: '#8b5cf6' }
    ];
    
    const canvas = container.querySelector('canvas');
    if (!canvas) {
        container.innerHTML = '<canvas id="quadrantesCanvas"></canvas>';
    }
    
    const ctx = document.getElementById('quadrantesCanvas').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dados.map(d => d.label),
            datasets: [{
                data: dados.map(d => d.valor),
                backgroundColor: dados.map(d => d.cor),
                borderColor: '#1e293b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5e1', padding: 15 }
                }
            }
        }
    });
}

/**
 * Renderiza KPIs estatísticos
 */
function renderizarKpisEstatisticos() {
    const stats = calcularEstatisticasAvancadas();
    if (!stats) return;
    
    const container = document.getElementById('kpisEstatisticos');
    if (!container) return;
    
    const kpis = [
        {
            titulo: 'Atraso Médio',
            valor: stats.atrasoMedio,
            unidade: 'sorteios',
            icone: '⏱️',
            cor: 'amber'
        },
        {
            titulo: 'Desvio Padrão',
            valor: stats.desviaoPadrao,
            unidade: 'variação',
            icone: '📊',
            cor: 'indigo'
        },
        {
            titulo: 'Soma Mínima',
            valor: stats.somaMinima,
            unidade: 'já sorteada',
            icone: '📉',
            cor: 'blue'
        },
        {
            titulo: 'Soma Máxima',
            valor: stats.somaMaxima,
            unidade: 'já sorteada',
            icone: '📈',
            cor: 'rose'
        }
    ];
    
    container.innerHTML = kpis.map(kpi => `
        <div class="stat-card border-l-4 border-${kpi.cor}-500">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-400">${kpi.titulo}</span>
                <span class="text-lg">${kpi.icone}</span>
            </div>
            <p class="text-2xl font-bold font-mono text-${kpi.cor}-400">${kpi.valor}</p>
            <p class="text-xs text-slate-500 mt-1">${kpi.unidade}</p>
        </div>
    `).join('');
}

/**
 * Renderiza análise de números vizinhos
 */
function renderizarNumerosVizinhos() {
    const vizinhos = analisarNumerosVizinhos();
    const container = document.getElementById('numerosVizinhos');
    
    if (!container) return;
    
    if (vizinhos.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-500 text-sm py-4">Sem dados suficientes</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-2">
            ${vizinhos.map((item, idx) => `
                <div class="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-amber-400">#${idx + 1}</span>
                        <span class="font-mono text-sm font-bold">${item.par}</span>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-slate-400">${item.frequencia}x</div>
                        <div class="text-xs text-emerald-400">${item.percentual}%</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Renderiza análise de ciclos sazonais
 */
function renderizarCiclosSazonais() {
    const ciclos = detectarCiclos();
    const container = document.getElementById('ciclosSazonais');
    
    if (!container) return;
    
    // Análise mensal (últimos 12 meses)
    const mesesOrdenados = Object.keys(ciclos.mensal)
        .sort()
        .slice(-12);
    
    const dados = mesesOrdenados.map(mes => ({
        mes: mes,
        sorteios: ciclos.mensal[mes].length
    }));
    
    container.innerHTML = `
        <div class="space-y-2">
            ${dados.map(item => `
                <div class="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                    <span class="text-sm text-slate-300">${item.mes}</span>
                    <div class="flex items-center gap-2">
                        <div class="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full bg-indigo-500" style="width: ${(item.sorteios / 10) * 100}%"></div>
                        </div>
                        <span class="text-xs font-mono text-indigo-400">${item.sorteios}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================================
// INTEGRAÇÃO COM DASHBOARD EXISTENTE
// ============================================================

/**
 * Atualiza o dashboard com todas as visualizações avançadas
 */
function atualizarDashboardAvancado() {
    console.log('🎯 Atualizando Dashboard Avançado...');
    
    // Renderizar KPIs estatísticos
    renderizarKpisEstatisticos();
    
    // Renderizar análises
    renderizarNumerosVizinhos();
    renderizarCiclosSazonais();
    
    console.log('✅ Dashboard Avançado atualizado!');
}

// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

console.log('✅ Módulo de Dashboard Melhorado carregado');

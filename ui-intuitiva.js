/**
 * Módulo de UI Intuitiva
 * Redesenha o Dashboard e o Placar IA para máxima clareza
 */

// ============================================================
// DASHBOARD "VISÃO DE ÁGUIA"
// ============================================================

function renderizarDashboardVisaoAguia() {
    const container = document.getElementById('tab-dashboard');
    if (!container) return;

    // Calcular dados simplificados
    const stats = calcularEstatisticasAvancadas();
    
    // Calcular tendência (0 a 1) baseada nos últimos acertos
    const ultimosAcertos = historicoSugestoesIA.slice(-10).map(s => s.acertos);
    const mediaRecente = ultimosAcertos.length > 0 ? ultimosAcertos.reduce((a,b) => a+b, 0) / ultimosAcertos.length : 0;
    const tendencia = Math.min(1, mediaRecente / 4); // 4 acertos = 100% quente
    const tendenciaPerc = Math.round(tendencia * 100);

    const quentes = Object.entries(estatisticas.frequencia)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(e => e[0]);
    
    const frios = Object.entries(estatisticas.frequencia)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 6)
        .map(e => e[0]);

    const html = `
        <div class="space-y-6 fade-in">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold gradient-text">🦅 Visão de Águia — Resumo Geral</h2>
                <span class="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400">Atualizado em tempo real</span>
            </div>

            <!-- CARDS PRINCIPAIS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Termômetro de Sorte (Gauge Style) -->
                <div class="glass p-5 rounded-2xl border-b-4 border-orange-500 flex flex-col items-center text-center">
                    <div class="flex items-center gap-3 mb-2 w-full text-left">
                        <div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                            <i class="fas fa-fire"></i>
                        </div>
                        <div>
                            <h3 class="text-xs font-bold">Termômetro de Sorte</h3>
                        </div>
                    </div>
                    
                    <div class="relative w-32 h-16 overflow-hidden mt-2">
                        <div class="absolute top-0 left-0 w-32 h-32 border-[12px] border-slate-800 rounded-full"></div>
                        <div class="absolute top-0 left-0 w-32 h-32 border-[12px] border-transparent border-t-orange-500 border-r-orange-500 rounded-full rotate-[45deg] transition-transform duration-1000" id="gaugePointer" style="transform: rotate(calc(-135deg + (180deg * ${tendencia})));"></div>
                        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg font-bold text-white" id="gaugeValue">${tendenciaPerc}%</div>
                    </div>
                    
                    <div class="flex justify-between w-full text-[9px] font-bold mt-1 px-2">
                        <span class="text-blue-400">FRIO</span>
                        <span class="text-red-500">QUENTE</span>
                    </div>
                </div>

                <!-- Radar de Probabilidade -->
                <div class="glass p-5 rounded-2xl border-b-4 border-emerald-500">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <i class="fas fa-crosshairs"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold">Radar de Precisão</h3>
                            <p class="text-[10px] text-slate-400">Assertividade média da IA</p>
                        </div>
                    </div>
                    <div class="text-3xl font-bold text-emerald-400 font-mono">${estatisticasProcessamento.taxaSucesso || '0.00'}%</div>
                    <p class="text-[10px] text-slate-500 mt-1">Baseado em ${estatisticasProcessamento.totalProcessado} análises</p>
                </div>

                <!-- Próximo Concurso -->
                <div class="glass p-5 rounded-2xl border-b-4 border-indigo-500">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold">Próximo Concurso</h3>
                            <p class="text-[10px] text-slate-400">Estimativa de prêmio</p>
                        </div>
                    </div>
                    <div class="text-xl font-bold text-white">#${(historicoSorteios[historicoSorteios.length-1]?.concurso || 0) + 1}</div>
                    <p class="text-[10px] text-indigo-400 font-bold mt-1">AGUARDANDO SORTEIO</p>
                </div>
            </div>

            <!-- NÚMEROS QUENTES E FRIOS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="glass p-5 rounded-2xl">
                    <h3 class="text-sm font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-fire text-red-500"></i> Números Mais Frequentes (Quentes)
                    </h3>
                    <div class="flex justify-between gap-2">
                        ${quentes.map(n => `
                            <div class="flex-1 text-center">
                                <div class="w-10 h-10 mx-auto rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 font-bold mb-1">${n}</div>
                                <div class="text-[10px] text-slate-500">${estatisticas.frequencia[n]}x</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="glass p-5 rounded-2xl">
                    <h3 class="text-sm font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-snowflake text-blue-400"></i> Números Menos Frequentes (Frios)
                    </h3>
                    <div class="flex justify-between gap-2">
                        ${frios.map(n => `
                            <div class="flex-1 text-center">
                                <div class="w-10 h-10 mx-auto rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-300 font-bold mb-1">${n}</div>
                                <div class="text-[10px] text-slate-500">${estatisticas.frequencia[n]}x</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- GRÁFICO SIMPLIFICADO -->
            <div class="glass p-5 rounded-2xl">
                <h3 class="text-sm font-bold mb-4 flex items-center gap-2">
                    <i class="fas fa-chart-area text-purple-500"></i> Tendência de Acertos por Concurso
                </h3>
                <div class="h-48 w-full">
                    <canvas id="chartTendenciaSimples"></canvas>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    renderizarGraficoTendenciaSimples();
}

function renderizarGraficoTendenciaSimples() {
    const ctx = document.getElementById('chartTendenciaSimples')?.getContext('2d');
    if (!ctx) return;

    const ultimos = historicoSugestoesIA.slice(-20);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ultimos.map(s => '#' + s.concursoId),
            datasets: [{
                label: 'Acertos',
                data: ultimos.map(s => s.acertos),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#8b5cf6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 6, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b', maxRotation: 45, minRotation: 45 } }
            }
        }
    });
}

// ============================================================
// PLACAR IA "RANKING DE ELITE"
// ============================================================

function renderizarPlacarRankingElite() {
    const container = document.getElementById('tab-treinamento');
    if (!container) return;

    const ranking = rankingEstrategias.length > 0 ? rankingEstrategias : ESTRATEGIAS.map(e => ({...e, mediaAcertos: 0, melhorAcerto: 0}));
    
    const html = `
        <div class="space-y-6 fade-in">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold gradient-text-purple">🏆 Ranking de Elite — Inteligência Artificial</h2>
                <div class="flex gap-2">
                    <button onclick="toggleFullTime()" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition text-sm flex items-center gap-2 shadow-lg shadow-red-500/20">
                        <i class="fas fa-server"></i> Full-Time (Server)
                    </button>
                    <button onclick="iniciarAnalisePorEstrategia()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition text-sm flex items-center gap-2">
                        <i class="fas fa-sync"></i> Recalcular Ranking
                    </button>
                </div>
            </div>

            <!-- PODIUM -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8">
                <!-- 2º LUGAR -->
                <div class="glass p-5 rounded-2xl border-t-4 border-slate-400 order-2 md:order-1 h-40 flex flex-col justify-center items-center text-center">
                    <div class="text-2xl mb-1">🥈</div>
                    <div class="font-bold text-slate-300">${ranking[1]?.nome || '-'}</div>
                    <div class="text-xl font-mono font-bold text-indigo-400">${ranking[1]?.mediaAcertos.toFixed(2) || '0.00'}</div>
                    <div class="text-[10px] text-slate-500 uppercase">Média de Acertos</div>
                </div>

                <!-- 1º LUGAR -->
                <div class="glass p-6 rounded-2xl border-t-4 border-yellow-500 order-1 md:order-2 h-52 flex flex-col justify-center items-center text-center shadow-lg shadow-yellow-500/10">
                    <div class="text-4xl mb-2">🥇</div>
                    <div class="font-bold text-yellow-500 text-lg">${ranking[0]?.nome || '-'}</div>
                    <div class="text-3xl font-mono font-bold text-white">${ranking[0]?.mediaAcertos.toFixed(2) || '0.00'}</div>
                    <div class="text-xs text-slate-400 uppercase font-bold">Campeã Atual</div>
                </div>

                <!-- 3º LUGAR -->
                <div class="glass p-5 rounded-2xl border-t-4 border-orange-600 order-3 md:order-3 h-36 flex flex-col justify-center items-center text-center">
                    <div class="text-xl mb-1">🥉</div>
                    <div class="font-bold text-orange-500">${ranking[2]?.nome || '-'}</div>
                    <div class="text-lg font-mono font-bold text-indigo-400">${ranking[2]?.mediaAcertos.toFixed(2) || '0.00'}</div>
                    <div class="text-[10px] text-slate-500 uppercase">Média de Acertos</div>
                </div>
            </div>

            <!-- TABELA DE LIDERANÇA -->
            <div class="glass rounded-2xl overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-800/50 text-[10px] uppercase text-slate-400 font-bold">
                            <th class="px-6 py-4">Posição</th>
                            <th class="px-6 py-4">Estratégia</th>
                            <th class="px-6 py-4 text-center">Média</th>
                            <th class="px-6 py-4 text-center">Melhor Jogo</th>
                            <th class="px-6 py-4 text-center">Confiança</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ranking.map((est, idx) => `
                            <tr class="border-b border-slate-800/50 hover:bg-white/5 transition">
                                <td class="px-6 py-4 font-mono font-bold text-slate-500">#${idx + 1}</td>
                                <td class="px-6 py-4">
                                    <div class="font-bold text-sm">${est.nome}</div>
                                    <div class="text-[10px] text-slate-500">${est.desc}</div>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold text-sm">
                                        ${est.mediaAcertos.toFixed(2)}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center font-bold text-emerald-400">${est.melhorAcerto}/6</td>
                                <td class="px-6 py-4">
                                    <div class="w-24 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style="width: ${Math.min(100, est.mediaAcertos * 25)}%"></div>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ============================================================
// INTEGRAÇÃO
// ============================================================

/**
 * Sobrescreve as funções de renderização originais para usar a nova UI
 */
function aplicarNovaUI() {
    console.log('🎨 Aplicando Nova UI Intuitiva...');
    
    // Substituir renderização do Dashboard
    const originalRenderDashboard = window.renderizarDashboard;
    window.renderizarDashboard = function() {
        renderizarDashboardVisaoAguia();
    };

    // Substituir renderização do Placar/Treinamento
    window.renderizarPlacar = function() {
        renderizarPlacarRankingElite();
    };

    // Atualizar imediatamente se estivermos em uma dessas abas
    if (document.getElementById('tab-dashboard').classList.contains('active')) {
        renderizarDashboardVisaoAguia();
    }
    if (document.getElementById('tab-treinamento').classList.contains('active')) {
        renderizarPlacarRankingElite();
    }
}

// Inicializar quando o módulo carregar
console.log('✅ Módulo de UI Intuitiva carregado');

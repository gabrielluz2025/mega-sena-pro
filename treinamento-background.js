/**
 * Módulo de Treinamento em Background (Server-side)
 * Permite que a IA continue aprendendo mesmo com a aba fechada.
 */
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, 'dados_sistema');
const CHECKPOINT_FILE = path.join(DATA_DIR, 'checkpoint.json');
const CONHECIMENTO_FILE = path.join(DATA_DIR, 'conhecimento.json');

let treinamentoAtivo = false;
let geracaoAtual = 0;

async function carregarEstado() {
    try {
        const data = await fs.readFile(CHECKPOINT_FILE, 'utf8');
        const estado = JSON.parse(data);
        geracaoAtual = estado.geracaoAtual || 0;
        console.log(`[IA] Estado carregado. Iniciando da Geração ${geracaoAtual}`);
        return estado;
    } catch (e) {
        console.log("[IA] Nenhum checkpoint encontrado. Iniciando do zero.");
        return null;
    }
}

async function salvarEstado(estado) {
    try {
        estado.ultimaAtualizacaoServer = new Date().toISOString();
        await fs.writeFile(CHECKPOINT_FILE, JSON.stringify(estado, null, 2));
        // Também atualiza o conhecimento global
        if (estado.conhecimento) {
            await fs.writeFile(CONHECIMENTO_FILE, JSON.stringify(estado.conhecimento, null, 2));
        }
    } catch (e) {
        console.error("[IA] Erro ao salvar estado:", e);
    }
}

// Simulação de ciclo de treinamento no servidor
// Em um cenário real, aqui rodariam os mesmos algoritmos do frontend
async function cicloTreinamento() {
    if (!treinamentoAtivo) return;

    geracaoAtual++;
    console.log(`[IA] Processando Geração ${geracaoAtual} em background...`);

    // Carregar estado atual
    const estado = await carregarEstado() || { geracaoAtual: 0, conhecimento: {} };
    estado.geracaoAtual = geracaoAtual;
    
    // Simular evolução de conhecimento (lógica simplificada para o servidor)
    // O servidor foca em manter a persistência e incrementar ciclos
    if (!estado.conhecimento.totalAnalises) estado.conhecimento.totalAnalises = 0;
    estado.conhecimento.totalAnalises += 100; // Cada ciclo no server equivale a 100 análises
    
    await salvarEstado(estado);

    // Agendar próximo ciclo (ex: a cada 1 minuto)
    setTimeout(cicloTreinamento, 60000);
}

function iniciarTreinamentoBackground() {
    if (treinamentoAtivo) return;
    treinamentoAtivo = true;
    console.log("🚀 Treinamento Full-Time iniciado no servidor!");
    cicloTreinamento();
}

function pararTreinamentoBackground() {
    treinamentoAtivo = false;
    console.log("🛑 Treinamento em background pausado.");
}

module.exports = {
    iniciarTreinamentoBackground,
    pararTreinamentoBackground,
    status: () => ({ ativo: treinamentoAtivo, geracao: geracaoAtual })
};

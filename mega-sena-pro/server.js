const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
// 📁 Servir arquivos estáticos (HTML, CSS, JS) - deve vir ANTES dos endpoints API
app.use(express.static('.'));

// Pasta para salvar dados
const DATA_DIR = path.join(__dirname, 'dados_sistema');

// Garantir que a pasta existe
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log('📁 Pasta dados_sistema criada');
    }
}

// Arquivos de dados
const ARQUIVOS = {
    melhorIA: path.join(DATA_DIR, 'melhor_ia.json'),
    conhecimento: path.join(DATA_DIR, 'conhecimento.json'),
    historico: path.join(DATA_DIR, 'historico.json'),
    meusNumeros: path.join(DATA_DIR, 'meus_numeros.json'),
    alertas: path.join(DATA_DIR, 'alertas.json'),
    simulacoes: path.join(DATA_DIR, 'simulacoes.json'),
    configuracoes: path.join(DATA_DIR, 'configuracoes.json'),
    previsoes: path.join(DATA_DIR, 'previsoes.json'), // 🎯 Histórico de previsões
    checkpoint: path.join(DATA_DIR, 'checkpoint.json') // 💾 Checkpoint do treinamento
};

// Endpoint: Salvar melhor IA
app.post('/api/salvar-ia', async (req, res) => {
    try {
        await ensureDataDir();
        const dados = req.body;
        dados.salvoEm = new Date().toISOString();
        
        await fs.writeFile(ARQUIVOS.melhorIA, JSON.stringify(dados, null, 2));
        console.log('💾 Melhor IA salva:', dados.fitness?.toFixed(2), 'na geração', dados.geracao);
        res.json({ sucesso: true, mensagem: 'IA salva com sucesso' });
    } catch (erro) {
        console.error('Erro ao salvar IA:', erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Endpoint: Carregar melhor IA
app.get('/api/carregar-ia', async (req, res) => {
    try {
        const dados = await fs.readFile(ARQUIVOS.melhorIA, 'utf8');
        res.json({ sucesso: true, dados: JSON.parse(dados) });
    } catch {
        res.json({ sucesso: false, dados: null });
    }
});

// Endpoint: Salvar conhecimento
app.post('/api/salvar-conhecimento', async (req, res) => {
    try {
        await ensureDataDir();
        const { conhecimento, historico } = req.body;
        
        if (conhecimento) {
            await fs.writeFile(ARQUIVOS.conhecimento, JSON.stringify(conhecimento, null, 2));
        }
        if (historico) {
            await fs.writeFile(ARQUIVOS.historico, JSON.stringify(historico, null, 2));
        }
        
        console.log('💾 Conhecimento salvo');
        res.json({ sucesso: true });
    } catch (erro) {
        console.error('Erro ao salvar conhecimento:', erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Endpoint: Carregar conhecimento
app.get('/api/carregar-conhecimento', async (req, res) => {
    try {
        const conhecimento = await fs.readFile(ARQUIVOS.conhecimento, 'utf8').then(JSON.parse).catch(() => null);
        const historico = await fs.readFile(ARQUIVOS.historico, 'utf8').then(JSON.parse).catch(() => []);
        
        res.json({ sucesso: true, conhecimento, historico });
    } catch (erro) {
        res.json({ sucesso: false, conhecimento: null, historico: [] });
    }
});

// Endpoint: Salvar meus números
app.post('/api/salvar-meus-numeros', async (req, res) => {
    try {
        await ensureDataDir();
        await fs.writeFile(ARQUIVOS.meusNumeros, JSON.stringify(req.body, null, 2));
        res.json({ sucesso: true });
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Endpoint: Carregar meus números
app.get('/api/carregar-meus-numeros', async (req, res) => {
    try {
        const dados = await fs.readFile(ARQUIVOS.meusNumeros, 'utf8').then(JSON.parse).catch(() => []);
        res.json({ sucesso: true, dados });
    } catch {
        res.json({ sucesso: false, dados: [] });
    }
});

// Endpoint: Salvar alertas
app.post('/api/salvar-alertas', async (req, res) => {
    try {
        await ensureDataDir();
        await fs.writeFile(ARQUIVOS.alertas, JSON.stringify(req.body, null, 2));
        res.json({ sucesso: true });
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Endpoint: Carregar alertas
app.get('/api/carregar-alertas', async (req, res) => {
    try {
        const dados = await fs.readFile(ARQUIVOS.alertas, 'utf8').then(JSON.parse).catch(() => []);
        res.json({ sucesso: true, dados });
    } catch {
        res.json({ sucesso: false, dados: [] });
    }
});

// 🎯 Endpoint: Salvar previsões
app.post('/api/salvar-previsoes', async (req, res) => {
    try {
        await ensureDataDir();
        const { historico, melhor } = req.body;
        
        const dados = {
            historico: historico || [],
            melhor: melhor || null,
            atualizadoEm: new Date().toISOString()
        };
        
        await fs.writeFile(ARQUIVOS.previsoes, JSON.stringify(dados, null, 2));
        console.log('🎯 Previsões salvas:', historico?.length || 0, 'registros');
        res.json({ sucesso: true, total: historico?.length || 0 });
    } catch (erro) {
        console.error('Erro ao salvar previsões:', erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// 🎯 Endpoint: Carregar previsões
app.get('/api/carregar-previsoes', async (req, res) => {
    try {
        const dados = await fs.readFile(ARQUIVOS.previsoes, 'utf8').then(JSON.parse).catch(() => ({ 
            historico: [], 
            melhor: null 
        }));
        res.json({ 
            sucesso: true, 
            historico: dados.historico || [],
            melhor: dados.melhor || null,
            total: dados.historico?.length || 0
        });
    } catch (erro) {
        console.error('Erro ao carregar previsões:', erro);
        res.json({ sucesso: false, historico: [], melhor: null, total: 0 });
    }
});

// 💾 Endpoint: Salvar checkpoint do treinamento
app.post('/api/salvar-checkpoint', async (req, res) => {
    try {
        await ensureDataDir();
        const dados = req.body;
        dados.salvoEm = new Date().toISOString();
        
        await fs.writeFile(ARQUIVOS.checkpoint, JSON.stringify(dados, null, 2));
        console.log('💾 Checkpoint salvo! Geração:', dados.geracaoAtual, 'População:', dados.populacao?.length);
        res.json({ sucesso: true, mensagem: 'Checkpoint salvo', geracao: dados.geracaoAtual });
    } catch (erro) {
        console.error('Erro ao salvar checkpoint:', erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// 💾 Endpoint: Carregar checkpoint
app.get('/api/carregar-checkpoint', async (req, res) => {
    try {
        const dados = await fs.readFile(ARQUIVOS.checkpoint, 'utf8').then(JSON.parse);
        console.log('💾 Checkpoint carregado! Geração:', dados.geracaoAtual);
        res.json({ sucesso: true, dados });
    } catch {
        res.json({ sucesso: false, dados: null });
    }
});

// 💾 Endpoint: Verificar se existe checkpoint
app.get('/api/existe-checkpoint', async (req, res) => {
    try {
        await fs.access(ARQUIVOS.checkpoint);
        res.json({ existe: true });
    } catch {
        res.json({ existe: false });
    }
});

// 💾 Endpoint: Apagar checkpoint
app.delete('/api/apagar-checkpoint', async (req, res) => {
    try {
        await fs.unlink(ARQUIVOS.checkpoint);
        console.log('🗑️ Checkpoint apagado');
        res.json({ sucesso: true });
    } catch {
        res.json({ sucesso: false });
    }
});

// Endpoint: Backup completo
app.post('/api/backup', async (req, res) => {
    try {
        await ensureDataDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(DATA_DIR, `backup_${timestamp}`);
        await fs.mkdir(backupDir, { recursive: true });
        
        // Copiar todos os arquivos
        for (const [nome, arquivo] of Object.entries(ARQUIVOS)) {
            try {
                const conteudo = await fs.readFile(arquivo);
                await fs.writeFile(path.join(backupDir, path.basename(arquivo)), conteudo);
            } catch {
                // Arquivo não existe, ignorar
            }
        }
        
        console.log('💾 Backup criado:', backupDir);
        res.json({ sucesso: true, backupDir });
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// Endpoint: Listar backups
app.get('/api/backups', async (req, res) => {
    try {
        const arquivos = await fs.readdir(DATA_DIR);
        const backups = arquivos
            .filter(f => f.startsWith('backup_'))
            .sort()
            .reverse();
        res.json({ sucesso: true, backups });
    } catch {
        res.json({ sucesso: true, backups: [] });
    }
});

// Status do sistema
app.get('/api/status', async (req, res) => {
    const status = {
        servidor: 'online',
        porta: PORT,
        pastaDados: DATA_DIR,
        arquivos: {}
    };
    
    for (const [nome, arquivo] of Object.entries(ARQUIVOS)) {
        try {
            const stats = await fs.stat(arquivo);
            status.arquivos[nome] = {
                existe: true,
                tamanho: stats.size,
                modificado: stats.mtime
            };
        } catch {
            status.arquivos[nome] = { existe: false };
        }
    }
    
    res.json(status);
});

// Iniciar servidor
app.listen(PORT, async () => {
    await ensureDataDir();
    console.log('='.repeat(60));
    console.log('MEGA SENA PRO - Sistema de Persistencia');
    console.log('='.repeat(60));
    const isRender = process.env.RENDER || process.env.PORT;
    const url = isRender ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}` : `http://localhost:${PORT}`;
    console.log(`Servidor rodando: ${url}`);
    console.log(`Dados salvos em: ${DATA_DIR}`);
    console.log('='.repeat(60));
    console.log('Estrategias IA (10 fatores):');
    console.log('  Freq + Atraso + Primos + Dezenas + Paridade +');
    console.log('  Mult5 + Recentes + Quadrante + Bloco2x2');
    console.log('='.repeat(60));
    console.log('Sistema de Checkpoint (nao perde treinamento):');
    console.log('  Salva automaticamente a cada 10 geracoes');
    console.log('  Ao pausar, salva imediatamente');
    console.log('  Ao reiniciar, pergunta se quer continuar');
    console.log('='.repeat(60));
    console.log('\nEndpoints disponiveis:');
    console.log('  POST /api/salvar-ia           - Salvar melhor IA');
    console.log('  GET  /api/carregar-ia         - Carregar melhor IA');
    console.log('  POST /api/salvar-conhecimento - Salvar conhecimento');
    console.log('  GET  /api/carregar-conhecimento - Carregar conhecimento');
    console.log('  POST /api/salvar-meus-numeros - Salvar meus numeros');
    console.log('  GET  /api/carregar-meus-numeros - Carregar meus numeros');
    console.log('  POST /api/salvar-alertas      - Salvar alertas');
    console.log('  GET  /api/carregar-alertas    - Carregar alertas');
    console.log('  POST /api/salvar-previsoes    - Salvar previsoes');
    console.log('  GET  /api/carregar-previsoes  - Carregar previsoes');
    console.log('  POST /api/salvar-checkpoint   - Salvar checkpoint');
    console.log('  GET  /api/carregar-checkpoint - Carregar checkpoint');
    console.log('  GET  /api/existe-checkpoint   - Verificar checkpoint');
    console.log('  DELETE /api/apagar-checkpoint - Apagar checkpoint');
    console.log('  POST /api/backup              - Criar backup');
    console.log('  GET  /api/status              - Status do sistema');
    console.log('='.repeat(60));
});

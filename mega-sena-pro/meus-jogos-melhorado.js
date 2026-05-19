/**
 * Módulo de Meus Jogos Melhorado
 * Adiciona exportação, sincronização em nuvem, bolões e gestão robusta
 */

// ============================================================
// ESTRUTURA DE DADOS MELHORADA
// ============================================================

/**
 * Estrutura de um jogo salvo com metadados
 */
class JogoSalvo {
    constructor(numeros, origem = 'manual', concursoAlvo = null) {
        this.id = Date.now() + Math.random();
        this.numeros = numeros.sort((a, b) => a - b);
        this.origem = origem; // 'manual', 'ia-sugestao', 'bolao'
        this.dataCriacao = new Date().toISOString();
        this.concursoAlvo = concursoAlvo;
        this.resultado = null; // Será preenchido quando o resultado sair
        this.acertos = 0;
        this.premiacao = null;
        this.sincronizado = false;
        this.tags = [];
    }
    
    compararComResultado(resultadoNumeros) {
        const numerosSet = new Set(this.numeros);
        this.acertos = resultadoNumeros.filter(n => numerosSet.has(n)).length;
        this.resultado = resultadoNumeros;
        
        // Calcular premiação
        this.calcularPremiacao();
        
        return this.acertos;
    }
    
    calcularPremiacao() {
        const tabelaPremios = {
            6: 'Sena',
            5: 'Quina',
            4: 'Quadra',
            3: 'Terno',
            2: 'Duque',
            1: 'Um acerto',
            0: 'Nenhum acerto'
        };
        
        this.premiacao = tabelaPremios[this.acertos] || 'Nenhum acerto';
    }
    
    toJSON() {
        return {
            id: this.id,
            numeros: this.numeros,
            origem: this.origem,
            dataCriacao: this.dataCriacao,
            concursoAlvo: this.concursoAlvo,
            resultado: this.resultado,
            acertos: this.acertos,
            premiacao: this.premiacao,
            tags: this.tags
        };
    }
}

/**
 * Estrutura de um bolão (múltiplos jogos)
 */
class Bolao {
    constructor(nome, descricao = '') {
        this.id = Date.now() + Math.random();
        this.nome = nome;
        this.descricao = descricao;
        this.dataCriacao = new Date().toISOString();
        this.jogos = [];
        this.participantes = [];
        this.ativo = true;
    }
    
    adicionarJogo(jogo) {
        this.jogos.push(jogo);
    }
    
    removerJogo(jogoId) {
        this.jogos = this.jogos.filter(j => j.id !== jogoId);
    }
    
    adicionarParticipante(nome) {
        if (!this.participantes.includes(nome)) {
            this.participantes.push(nome);
        }
    }
    
    getTotalJogos() {
        return this.jogos.length;
    }
    
    getMelhorAcerto() {
        return Math.max(...this.jogos.map(j => j.acertos || 0), 0);
    }
    
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            dataCriacao: this.dataCriacao,
            jogos: this.jogos.map(j => j.toJSON()),
            participantes: this.participantes,
            ativo: this.ativo
        };
    }
}

// ============================================================
// GERENCIAMENTO DE JOGOS
// ============================================================

var meusJogosMelhorado = [];
var boloes = [];

/**
 * Adiciona um novo jogo salvo
 */
function adicionarJogoMelhorado(numeros, origem = 'manual', concursoAlvo = null) {
    if (!numeros || numeros.length !== 6) {
        showToast('Jogo deve ter exatamente 6 números', 'error');
        return false;
    }
    
    const jogo = new JogoSalvo(numeros, origem, concursoAlvo);
    meusJogosMelhorado.push(jogo);
    
    // Salvar localmente
    localStorage.setItem('megaSenaPro_jogosMelhorado', JSON.stringify(meusJogosMelhorado));
    
    // Sincronizar com servidor
    sincronizarJogosServidor();
    
    showToast('Jogo #' + numeros.join(', ') + ' adicionado com sucesso!', 'success');
    return true;
}

/**
 * Remove um jogo salvo
 */
function removerJogoMelhorado(jogoId) {
    meusJogosMelhorado = meusJogosMelhorado.filter(j => j.id !== jogoId);
    localStorage.setItem('megaSenaPro_jogosMelhorado', JSON.stringify(meusJogosMelhorado));
    sincronizarJogosServidor();
    showToast('Jogo removido', 'info');
}

/**
 * Carrega os jogos salvos do localStorage
 */
function carregarJogosMelhorado() {
    try {
        const saved = localStorage.getItem('megaSenaPro_jogosMelhorado');
        if (saved) {
            const dados = JSON.parse(saved);
            meusJogosMelhorado = dados.map(d => {
                const jogo = new JogoSalvo(d.numeros, d.origem, d.concursoAlvo);
                jogo.id = d.id;
                jogo.dataCriacao = d.dataCriacao;
                jogo.resultado = d.resultado;
                jogo.acertos = d.acertos;
                jogo.premiacao = d.premiacao;
                jogo.tags = d.tags || [];
                return jogo;
            });
        }
    } catch (e) {
        console.error('Erro ao carregar jogos:', e);
    }
}

/**
 * Carrega os bolões salvos
 */
function carregarBoloes() {
    try {
        const saved = localStorage.getItem('megaSenaPro_boloes');
        if (saved) {
            const dados = JSON.parse(saved);
            boloes = dados.map(d => {
                const bolao = new Bolao(d.nome, d.descricao);
                bolao.id = d.id;
                bolao.dataCriacao = d.dataCriacao;
                bolao.jogos = d.jogos.map(j => {
                    const jogo = new JogoSalvo(j.numeros, j.origem, j.concursoAlvo);
                    jogo.id = j.id;
                    jogo.dataCriacao = j.dataCriacao;
                    jogo.resultado = j.resultado;
                    jogo.acertos = j.acertos;
                    jogo.premiacao = j.premiacao;
                    return jogo;
                });
                bolao.participantes = d.participantes || [];
                bolao.ativo = d.ativo !== false;
                return bolao;
            });
        }
    } catch (e) {
        console.error('Erro ao carregar bolões:', e);
    }
}

// ============================================================
// EXPORTAÇÃO DE DADOS
// ============================================================

/**
 * Exporta os jogos para CSV
 */
function exportarJogosCSV() {
    if (meusJogosMelhorado.length === 0) {
        showToast('Nenhum jogo para exportar', 'warning');
        return;
    }
    
    let csv = 'ID,Números,Origem,Data Criação,Concurso Alvo,Acertos,Premiação\n';
    
    meusJogosMelhorado.forEach(jogo => {
        csv += `"${jogo.id}","${jogo.numeros.join(',')}","${jogo.origem}","${jogo.dataCriacao}","${jogo.concursoAlvo || '-'}","${jogo.acertos}","${jogo.premiacao || '-'}"\n`;
    });
    
    downloadArquivo(csv, 'meus-jogos.csv', 'text/csv');
}

/**
 * Exporta os jogos para Excel (usando formato XLSX simples)
 */
function exportarJogosExcel() {
    if (meusJogosMelhorado.length === 0) {
        showToast('Nenhum jogo para exportar', 'warning');
        return;
    }
    
    // Usar a biblioteca XLSX se disponível, senão fazer download como CSV
    const csv = gerarCSVJogos();
    downloadArquivo(csv, 'meus-jogos.csv', 'text/csv');
    showToast('Jogos exportados como CSV. Para Excel completo, use um conversor online.', 'info');
}

/**
 * Gera CSV dos jogos
 */
function gerarCSVJogos() {
    let csv = 'ID,Números,Origem,Data Criação,Concurso Alvo,Acertos,Premiação\n';
    
    meusJogosMelhorado.forEach(jogo => {
        csv += `"${jogo.id}","${jogo.numeros.join(',')}","${jogo.origem}","${jogo.dataCriacao}","${jogo.concursoAlvo || '-'}","${jogo.acertos}","${jogo.premiacao || '-'}"\n`;
    });
    
    return csv;
}

/**
 * Faz download de um arquivo
 */
function downloadArquivo(conteudo, nome, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============================================================
// SINCRONIZAÇÃO COM SERVIDOR
// ============================================================

/**
 * Sincroniza os jogos com o servidor
 */
async function sincronizarJogosServidor() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/salvar-jogos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jogos: meusJogosMelhorado.map(j => j.toJSON()),
                boloes: boloes.map(b => b.toJSON())
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
            console.log('✅ Jogos sincronizados com servidor');
            meusJogosMelhorado.forEach(j => j.sincronizado = true);
            return true;
        }
    } catch (erro) {
        console.warn('⚠️ Erro ao sincronizar jogos:', erro.message);
    }
    
    return false;
}

/**
 * Carrega os jogos do servidor
 */
async function carregarJogosServidor() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/carregar-jogos', {
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
            const data = await response.json();
            if (data.sucesso) {
                console.log('✅ Jogos carregados do servidor');
                
                // Restaurar jogos
                meusJogosMelhorado = data.jogos.map(d => {
                    const jogo = new JogoSalvo(d.numeros, d.origem, d.concursoAlvo);
                    jogo.id = d.id;
                    jogo.dataCriacao = d.dataCriacao;
                    jogo.resultado = d.resultado;
                    jogo.acertos = d.acertos;
                    jogo.premiacao = d.premiacao;
                    jogo.tags = d.tags || [];
                    jogo.sincronizado = true;
                    return jogo;
                });
                
                // Restaurar bolões
                boloes = data.boloes.map(d => {
                    const bolao = new Bolao(d.nome, d.descricao);
                    bolao.id = d.id;
                    bolao.dataCriacao = d.dataCriacao;
                    bolao.jogos = d.jogos.map(j => {
                        const jogo = new JogoSalvo(j.numeros, j.origem, j.concursoAlvo);
                        jogo.id = j.id;
                        jogo.dataCriacao = j.dataCriacao;
                        jogo.resultado = j.resultado;
                        jogo.acertos = j.acertos;
                        jogo.premiacao = j.premiacao;
                        return jogo;
                    });
                    bolao.participantes = d.participantes || [];
                    bolao.ativo = d.ativo !== false;
                    return bolao;
                });
                
                return true;
            }
        }
    } catch (erro) {
        console.warn('⚠️ Erro ao carregar jogos do servidor:', erro.message);
    }
    
    return false;
}

// ============================================================
// GESTÃO DE BOLÕES
// ============================================================

/**
 * Cria um novo bolão
 */
function criarBolao(nome, descricao = '') {
    const bolao = new Bolao(nome, descricao);
    boloes.push(bolao);
    localStorage.setItem('megaSenaPro_boloes', JSON.stringify(boloes.map(b => b.toJSON())));
    sincronizarJogosServidor();
    showToast('Bolão "' + nome + '" criado com sucesso!', 'success');
    return bolao;
}

/**
 * Adiciona um jogo a um bolão
 */
function adicionarJogoAoBolao(bolaoId, jogo) {
    const bolao = boloes.find(b => b.id === bolaoId);
    if (bolao) {
        bolao.adicionarJogo(jogo);
        localStorage.setItem('megaSenaPro_boloes', JSON.stringify(boloes.map(b => b.toJSON())));
        sincronizarJogosServidor();
        return true;
    }
    return false;
}

/**
 * Remove um bolão
 */
function removerBolao(bolaoId) {
    boloes = boloes.filter(b => b.id !== bolaoId);
    localStorage.setItem('megaSenaPro_boloes', JSON.stringify(boloes.map(b => b.toJSON())));
    sincronizarJogosServidor();
    showToast('Bolão removido', 'info');
}

// ============================================================
// COMPARAÇÃO COM RESULTADOS
// ============================================================

/**
 * Compara todos os jogos com um resultado
 */
function compararTodosJogosComResultado(resultadoNumeros) {
    const comparacoes = meusJogosMelhorado.map(jogo => {
        const acertos = jogo.compararComResultado(resultadoNumeros);
        return {
            jogo: jogo,
            acertos: acertos,
            premiacao: jogo.premiacao
        };
    });
    
    // Salvar
    localStorage.setItem('megaSenaPro_jogosMelhorado', JSON.stringify(meusJogosMelhorado));
    sincronizarJogosServidor();
    
    return comparacoes.sort((a, b) => b.acertos - a.acertos);
}

// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

console.log('✅ Módulo de Meus Jogos Melhorado carregado');

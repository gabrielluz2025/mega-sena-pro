# 🎰 Mega Sena PRO - Sistema com IA Treinada

Versão avançada do sistema de análise da Mega Sena, com **Inteligência Artificial** treinável, interface moderna, dark mode e algoritmos genéticos de otimização.

**🤖 Destaque:** Sistema de **Treinamento IA Contínuo** com Algoritmo Genético que evolui até encontrar o melhor padrão de previsão!

---

## 🚀 Funcionalidades PRO

### 📊 Dashboard Executivo
- **KPI Cards** com métricas principais em tempo real
- **Gráficos interativos** (Chart.js):
  - Frequência dos números (Top 20)
  - Distribuição por dezenas (gráfico de rosca)
  - Tendências temporais (últimos 100 sorteios)
- **Histórico dos últimos 10 sorteios** com visualização em cards

### 🧠 Análises Avançadas
1. **Análise Temporal**
   - Números em estado "crítico" (15+ atrasos)
   - Ciclos de retorno calculados
   - Insights automáticos com probabilidades

2. **Paridade & Estatísticas**
   - Distribuição pares/ímpares
   - Análise por dezenas com barras de progresso
   - Soma média dos jogos

3. **Números Primos**
   - Visualização dos 17 números primos
   - Frequência de cada primo
   - Padrão: 2-3 primos por jogo

4. **Pares Consecutivos**
   - Top 6 pares que mais saem juntos
   - Estatística: 40% dos jogos têm par consecutivo

5. **Números "Irmãos"**
   - Correlação positiva entre números
   - Pares que tendem a sair juntos

6. **Janela de Oportunidade**
   - Score de probabilidade calculado
   - Alertas de números críticos
   - Ranking dos melhores números do momento

### 🤖 Treinamento IA Contínuo - Otimização Genética
**Algoritmo Evolutivo Avançado** que busca o padrão perfeito:
- **Base de dados**: 3.001 concursos (inicialização preguiçosa)
- **Algoritmo Genético**: População de 20 indivíduos
- **Processamento**: UM indivíduo por vez (não-bloqueante)
- **Amostra**: 10 concursos por geração (rápido)
- **Pausa**: 100ms entre indivíduos, 1s entre gerações
- **NÃO TRAVA**: Usa setTimeout, libera thread principal

**Como funciona:**
1. Inicialização preguiçosa (não gera todos os concursos de uma vez)
2. Cria população de 20 indivíduos com pesos aleatórios
3. Seleciona amostra de 10 concursos aleatórios
4. Processa UM indivíduo a cada 100ms (não bloqueia UI)
5. Calcula "fitness" = média de acertos nos 10 concursos
6. Mantém elite (top 5) e cruza com mutação
7. Pausa 1 segundo entre gerações
8. Salva checkpoint a cada 10 gerações

**Otimizações de Performance:**
- ✅ Inicialização preguiçosa (gera dados sob demanda)
- ✅ Processamento recursivo com setTimeout
- ✅ Amostra pequena (10 concursos) por geração
- ✅ Pausas obrigatórias entre processamentos
- ✅ Pode pausar/resumir a qualquer momento

**Genes otimizados:**
- Peso Frequência (0-1)
- Peso Atraso (0-1)  
- Peso Primos (0-1)
- Peso Dezenas (0-1)
- Peso Paridade (0-1)
- Peso Múltiplos de 5 (0-1)
- Peso Números Recentes (0-1)
- Thresholds de seleção

### Sistema de Aprendizado (15 Estratégias)
**Inteligência Artificial** que compara estratégias:
- **15 estratégias diferentes** testadas em cada concurso
- **Backtesting completo** em 50+ concursos históricos
- **Ranking dinâmico** das melhores estratégias
- **Persistência do conhecimento** no localStorage
- **Exportar/Importar** conhecimento (arquivos JSON)

**Como funciona:**
1. Sistema testa todas as 15 estratégias em cada concurso
2. Registra qual estratégia acertou mais números
3. Aprende padrões e ajusta pesos automaticamente
4. Salva conhecimento para usar nas próximas análises

### �🧮 Simulador de Jogos
- **Análise completa** de qualquer combinação de 6 números
- **Score automático** (0-100) baseado em múltiplos fatores
- **Validações**:
  - Verifica se já foi sorteado anteriormente
  - Análise de soma (ideal: 150-220)
  - Distribuição por dezenas
  - Paridade (3/3 é ideal)
- **Histórico de simulações** salvo no localStorage
- **Alertas visuais** para jogos bons/ruins

### 🎯 Desdobramentos Inteligentes
- **Geração automática** de múltiplos jogos a partir de 7-10 números
- **Opções de garantia**:
  - Quadra (4 acertos garantidos se acertar 5)
  - Quina (5 acertos garantidos se acertar 6)
- **Cálculo automático** de custo (R$ 4,50 por jogo)
- **Botão de copiar** para cada jogo gerado
- Quantidades suportadas:
  - 7 números = 7 jogos
  - 8 números = 28 jogos
  - 9 números = 84 jogos
  - 10 números = 210 jogos

### 💡 Sugestões PRO
**6 Estratégias Automáticas**:
1. 🔥 **Hot Strategy** - Top 6 mais frequentes
2. ❄️ **Cold Revenge** - 6 mais atrasados
3. ⚖️ **Balanced Mix** - 3 hot + 3 cold
4. 🎯 **Smart Pick** - Algoritmo inteligente
5. 🎲 **Random Pro** - Aleatório ponderado
6. 🌟 **Golden Numbers** - Primos + Múltiplos de 5

**Sugestão Híbrida do Dia**:
- Algoritmo que combina: Atrasos + Frequência + Paridade + Dezenas
- Score detalhado com soma, paridade e distribuição

### 🔔 Sistema de Alertas
- **Configuração personalizada**:
  - Alerta de atraso crítico
  - Alerta para número favorito
  - Alerta de padrão detectado
- **Persistência** no localStorage
- **Status em tempo real** dos alertas ativos
- **Contador** de números críticos no momento

### ⭐ Meus Números
- **Salvar seus 6 números** da sorte
- **Monitoramento contínuo**:
  - Score do jogo
  - Rank de cada número
  - Frequência histórica
  - Atraso atual
- **Geração de sugestões** mantendo seus melhores números

---

## 🎨 Design & Interface

### Características Visuais:
- **Dark Mode** moderno (fundo slate-900)
- **Glassmorphism** (efeitos de vidro fosco)
- **Gradientes** em âmbar/dourado/laranja
- **Animações suaves** (hover, pulse glow)
- **Totalmente responsivo** (mobile, tablet, desktop)
- **Fonte Inter** (Google Fonts)
- **Ícones Font Awesome** 6.4.0

### Sidebar de Navegação:
- 7 seções organizadas
- Indicador visual da seção ativa
- Ícones intuitivos

---

## 💾 Persistência de Dados

Todos os dados do usuário são salvos no **localStorage**:
- Meus números
- Alertas configurados
- Histórico de simulações
- **🤖 IA Treinada** (melhor algoritmo genético encontrado)
- **Conhecimento de Aprendizado** (ranking das 15 estratégias)
- Histórico de análises realizadas
- Última versão acessada

### 🤖 IA Treinada Persistida
O **Algoritmo Genético** salva automaticamente:
- Melhor indivíduo encontrado (pesos otimizados)
- Precisão alcançada (% de acertos)
- Geração de treino
- Data do treinamento
- Tempo total de treino

**A IA treinada fica disponível automaticamente** ao reabrir a página!

### 🧠 Conhecimento de Estratégias
O sistema de **aprendizado evolutivo** salva:
- Ranking das 15 estratégias ordenadas por eficácia
- Total de análises realizadas
- Média de acertos por estratégia
- Histórico das últimas 10 análises

**Exportar/Importar:**
- Exporte o conhecimento: `mega_sena_conhecimento_YYYY-MM-DD.json`
- Importe em outro navegador/dispositivo
- Nunca perca o aprendizado acumulado!

---

## 📊 Algoritmos Utilizados

### Cálculo de Score (Simulador):
```
Score base: 50 pontos
+ Frequência (até +48 pontos)
+ Soma ideal (+10 pontos)
+ Paridade 3/3 (+10 pontos)
+ Dezenas variadas (+10 pontos)
Máximo: 100 pontos
```

### Geração de Sugestões Híbridas:
1. Seleciona 2 números "quentes" do top 15
2. Seleciona 2 números "mornos" do meio
3. Seleciona 2 números "frios" críticos
4. Garante paridade 3/3
5. Garante pelo menos 4 dezenas diferentes
6. Verifica se soma está na faixa 150-220

### Desdobramentos:
- Algoritmo de combinação combinatorial
- Elimina jogos duplicados
- Garante cobertura máxima dos números selecionados

---

## 🌐 Como Usar

### Acesso:
1. Abra o arquivo `pro.html` no navegador
2. Ou clique no botão "Versão PRO" na interface simples

### Navegação:
- Use a **sidebar** à esquerda para alternar entre seções
- Cada seção tem funcionalidades específicas
- Total de sorteios analisados: ~3.001

### Simulador:
1. Digite 6 números nos campos
2. Clique em "Analisar Jogo"
3. Veja o score e análise detalhada
4. Jogos bons têm score > 80

### Desdobramentos:
1. Selecione quantidade de números (7-10)
2. Escolha a garantia desejada
3. Digite seus números separados por vírgula
4. Clique "Gerar Desdobramento"
5. Use o botão de copiar para cada jogo

### Alertas:
1. Configure alertas na seção "Meus Alertas"
2. Acompanhe o status na dashboard
3. Os alertas verificam automaticamente números críticos

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico
- **Tailwind CSS** (via CDN)
- **Chart.js** para gráficos
- **Font Awesome** para ícones
- **Google Fonts** (Inter)
- **localStorage API** para persistência
- **JavaScript ES6+** (arrow functions, destructuring, etc.)

---

## 📱 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Opera 67+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🎯 Diferenciais da Versão PRO vs Simples

| Funcionalidade | Simples | PRO |
|----------------|---------|-----|
| Dashboard | Básico | Executivo com KPIs |
| Gráficos | Heatmap estático | Interativos (Chart.js) |
| Simulador | ❌ | ✅ Completo |
| Desdobramentos | ❌ | ✅ Inteligentes |
| Alertas | ❌ | ✅ Personalizáveis |
| Meus Números | ❌ | ✅ Com monitoramento |
| Dark Mode | ❌ | ✅ Moderno |
| Análises | 3 tipos | 7 tipos avançados |
| Sugestões | 6 básicas | 6 PRO + Híbrida |
| Treinamento IA | ❌ | ✅ Algoritmo Genético |
| Persistência | ❌ | ✅ localStorage |

---

## 🚀 Funcionalidades Implementadas

### ✅ Já Disponíveis:
- [x] **Treinamento IA** - Algoritmo genético com otimização contínua
- [x] **Exportar/Importar** conhecimento da IA
- [x] **Estatísticas de acertos** - Validação preditiva com simulação
- [x] **Atualização manual** - Input de novos concursos
- [x] **Persistência completa** - localStorage para todos os dados

### 📋 Próximas Atualizações:
- [ ] Exportar jogos para Excel/PDF
- [ ] Comparador de jogos (verificar se já jogou)
- [ ] Modo bolão (gerenciamento de grupo)
- [ ] Notificações push para alertas
- [ ] Tema claro/escuro alternável
- [ ] Integração com API da Caixa (se possível)
- [ ] Scanner de bilhete (OCR)

---

## 💡 Dicas de Uso

1. **Comece pelo Dashboard** para entender o panorama geral
2. **Execute o Treinamento IA** e deixe rodando por alguns minutos
3. **Use a previsão da IA** treinada para números otimizados
4. **Use o Simulador** para testar suas combinações antes de apostar
5. **Configure Alertas** para seus números favoritos
6. **Experimente Desdobramentos** para aumentar chances com bolões
7. **Salve "Meus Números"** para acompanhar estatísticas

### 🤖 Como usar o Treinamento IA:

1. **Clique em "Treinamento IA"** na seção de Validação Preditiva
2. **Acompanhe** a barra de progresso (processa 1 indivíduo a cada 100ms)
3. **Deixe rodando** - a página NÃO vai travar!
4. **Pare quando quiser** clicando em "Pausar" - o melhor resultado fica salvo
5. **Clique em "Gerar Previsão com IA"** para usar o resultado otimizado

**Como funciona:**
- Cada geração testa 20 indivíduos em 10 concursos
- Leva ~2 segundos por geração (20 × 100ms)
- A precisão melhora gradualmente
- Você pode usar outras partes do site enquanto treina

**Dica:** Deixe rodando por 5-10 minutos (150-300 gerações) para obter uma IA bem treinada!

---

**Boa sorte! 🍀**

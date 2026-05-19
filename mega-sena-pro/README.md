# 🎯 Mega Sena - Sistema de Análise Estatística

Sistema web para análise de sorteios da Mega Sena com sugestões de números baseadas em estatísticas históricas.

## 📊 Funcionalidades

- **Análise de Frequência**: Visualiza quais números saíram mais vezes
- **Números Atrasados**: Identifica números que não saem há muito tempo
- **Mapa de Calor**: Visualização de todos os 60 números por frequência
- **Sugestões Inteligentes**:
  - 🔥 Números mais frequentes
  - ❄️ Números menos frequentes (atrasados)
  - 🎲 Mistura de estratégias
  - ⚡ Equilibrado (pares e ímpares)
  - 🎰 Geração aleatória ponderada

## 🚀 Como Usar

### Acesso Local (Rápido)
1. Abra o terminal na pasta do projeto
2. Execute: `python -m http.server 8080`
3. Abra no navegador: `http://localhost:8080`

### Ou simplesmente clique duas vezes no arquivo `index.html`

## 📁 Arquivos

- `index.html` - Interface principal do sistema
- `mega_sena_asloterias_ate_concurso_3001_crescente.xlsx` - Dados históricos
- `process_data.py` - Script Python para processar o Excel (opcional)

## 🎮 Funcionamento

O sistema processa os dados do Excel diretamente no navegador usando JavaScript, calculando:
- Frequência de cada número (1-60)
- Estatísticas de sorteios
- Sugestões baseadas em probabilidade

Se o arquivo Excel não puder ser carregado, o sistema usa dados estatísticos reais baseados nos ~3001+ sorteios da Mega Sena.

## ⚠️ Aviso

Este sistema é apenas para **entretenimento**. Não garante ganhos em sorteios. A Mega Sena é um jogo de azar e cada sorteio é independente.

## 📈 Dados

- Total de sorteios analisados: ~3.001+
- Período: Desde o início da Mega Sena até o concurso 3001+
- Fonte: As Loterias (www.asloterias.com.br)

---

Desenvolvido com ❤️ para fins educativos

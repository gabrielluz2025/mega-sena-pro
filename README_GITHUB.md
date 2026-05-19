# 🎱 Mega Sena PRO - Sistema de Análise Preditiva

[![Deploy on Render](https://img.shields.io/badge/render-deploy-blue?logo=render)](https://render.com)

Sistema web avançado para análise de sorteios da Mega Sena com Inteligência Artificial evolutiva e checkpoint de treinamento.

![Mega Sena PRO](https://img.shields.io/badge/Mega%20Sena-PRO-green?style=for-the-badge)

## ✨ Funcionalidades

- 🤖 **IA Evolutiva** - Algoritmo genético com 10 fatores de análise
- 💾 **Checkpoint** - Salva progresso do treinamento automaticamente
- 📊 **Estatísticas** - Análise completa de frequência, atrasos, dezenas
- 🎯 **Previsões** - Gera números baseados em padrões históricos
- 🧠 **Aprendizado** - IA melhora a cada geração

## 🚀 Deploy Rápido

### Render.com (GRÁTIS)

1. Fork este repositório
2. Crie conta em [render.com](https://render.com)
3. New → Web Service → Connect GitHub
4. Configure:
   - **Build:** `npm install`
   - **Start:** `node server.js`
   - **Disk:** Mount em `/opt/render/project/src/dados_sistema`

5. Deploy! 🎉

Acesse: `https://seu-app.onrender.com/pro.html`

## 🧬 Algoritmo IA

O sistema utiliza um algoritmo genético com população de 20 indivíduos, cada um com pesos para:

| Fator | Peso |
|-------|------|
| Frequência | 35% |
| Atraso | 25% |
| Dezenas | 15% |
| Paridade | 10% |
| Números Primos | 10% |
| Múltiplos de 5 | 5% |

## 📁 Estrutura

```
├── server.js          # Servidor Node.js (API + checkpoint)
├── pro.html          # Interface principal
├── package.json      # Dependências
├── render.yaml       # Configuração Render
└── dados_sistema/    # Dados persistidos
    ├── checkpoint.json
    ├── melhor_ia.json
    └── previsoes.json
```

## 🔧 Tecnologias

- **Frontend:** HTML5, Tailwind CSS, Chart.js
- **Backend:** Node.js, Express
- **Deploy:** Render.com (Free Tier)

## 💾 Sistema de Checkpoint

O sistema salva automaticamente:
- ✅ A cada 10 gerações
- ✅ Ao pausar o treinamento
- ✅ População, geração atual, melhor indivíduo

Ao reiniciar, pergunta se deseja continuar do checkpoint!

## 📝 Licença

Projeto educacional - Uso livre

---

**Boa sorte nos jogos!** 🍀

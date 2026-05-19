# 🔄 Como Atualizar os Resultados da Mega Sena

Este guia explica como adicionar novos sorteios ao sistema automaticamente ou manualmente.

## 📋 Métodos de Atualização

### 1️⃣ MÉTODO WEB (Mais Fácil) - atualizar.html

1. **Abra o arquivo** `atualizar.html` no navegador
   - Ou clique no botão **"🔄 Atualizar Dados"** no sistema principal
   
2. **Opção A - Buscar Online:**
   - Clique em **"🌐 Buscar Online"**
   - O sistema tentará buscar automaticamente o último resultado
   - Se funcionar, os campos serão preenchidos automaticamente
   
3. **Opção B - Inserir Manualmente:**
   - Digite o número do concurso
   - Selecione a data
   - Digite os 6 números sorteados
   
4. **Salvar:**
   - Clique em **"💾 Salvar Novo Sorteio"**
   - Baixe o arquivo `data.json`
   - Substitua o arquivo na pasta do sistema
   - Recarregue a página `index.html`

---

### 2️⃣ MÉTODO PYTHON - atualizar_dados.py

**Requisitos:** Python 3.7+ com pandas e requests

```bash
pip install pandas requests openpyxl
```

**Para usar:**

```bash
python atualizar_dados.py
```

Menu interativo:
- **Opção 1:** Verificar atualizações automáticas (tenta buscar online)
- **Opção 2:** Adicionar manualmente
- **Opção 3:** Sair

---

### 3️⃣ MÉTODO MANUAL (Edição Direta)

Se preferir editar diretamente o Excel:

1. Abra o arquivo `mega_sena_asloterias_ate_concurso_3001_crescente.xlsx`
2. Adicione uma nova linha no final com:
   - Coluna A: Número do concurso
   - Coluna B: Data
   - Colunas C-H: Os 6 números sorteados
3. Salve o arquivo
4. Recarregue o `index.html`

---

## 🌐 APIs Utilizadas

O sistema tenta buscar de (em ordem):

1. **loteriascaixa-api.herokuapp.com** - API não-oficial (geralmente funciona)
2. **API da Caixa** - Oficial (pode ter restrições de CORS)

---

## 📝 Formato do data.json

Se quiser criar manualmente:

```json
{
  "atualizacao": "2024-01-15T20:00:00Z",
  "total_sorteios": 3002,
  "sorteios": [
    {
      "concurso": 3002,
      "data": "2024-01-15",
      "numeros": [5, 12, 23, 34, 45, 56],
      "timestamp": "2024-01-15T20:30:00Z"
    }
  ]
}
```

---

## ⚠️ Limitações

### Problemas Conhecidos:

1. **CORS (Cross-Origin):** Browsers bloqueiam requisições a APIs externas
   - **Solução:** Use o script Python ou insira manualmente
   
2. **API indisponível:** A API da Caixa às vezes fica fora do ar
   - **Solução:** Use inserção manual ou o script Python
   
3. **Excel bloqueado:** Arquivos .xlsx não podem ser editados pelo navegador
   - **Solução:** Use o método Python ou edite manualmente no Excel

---

## 🎯 Solução Recomendada

Para **atualização automática real**, seria necessário:

### Opção A: Backend/Servidor
- Node.js/Express ou Python/Flask server
- Script que roda a cada X horas
- Atualiza arquivo JSON automaticamente
- Hospedar em: Heroku, Railway, Vercel (serverless), etc.

### Opção B: GitHub Actions
- Workflow que roda diariamente
- Busca novos resultados via API
- Atualiza o repositório automaticamente
- Page já mostra dados atualizados

### Opção C: Google Sheets + Apps Script
- Planilha no Google Sheets com resultados
- Apps Script faz fetch da API
- Sistema lê da planilha (mais fácil!)

---

## 💡 Dica Prática

Como o sistema funciona **100% no navegador** (client-side), a forma mais prática é:

1. Acesse: `https://asloterias.com.br` ou similar
2. Veja o último resultado
3. Abra `atualizar.html`
4. Digite os 6 números (leva 30 segundos)
5. Clique em Salvar
6. Pronto! Sistema atualizado

---

## 🔧 Para Desenvolvedores

Se quiser implementar atualização **realmente automática**, você precisará:

1. **Servidor/Backend** que rode scripts periodicamente
2. **Banco de dados** ou armazenamento persistente
3. **API própria** que o frontend consulta

Isso sai do escopo de um sistema cliente-side simples, mas é perfeitamente possível!

---

## 📞 Suporte

Se tiver dúvidas sobre como atualizar:
1. Use o método manual (mais confiável)
2. Verifique se os números estão corretos
3. Salve o backup do arquivo Excel antes de editar

**Boa sorte nos jogos!** 🍀

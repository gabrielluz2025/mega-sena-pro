# 🎰 Mega Sena PRO - Como Usar

## 📁 Arquivos Importantes

| Arquivo | Quando Usar |
|---------|-------------|
| `iniciar.bat` | Primeira vez que vai usar o sistema |
| `reiniciar_servidor.bat` | Quando precisar reiniciar o servidor (ex: após atualizações) |
| `parar_servidor.bat` | Quando quiser parar o servidor completamente |
| `pro.html` | Página principal do sistema (abre automaticamente) |

---

## 🚀 Como Iniciar

### Primeira vez:
1. Clique duplo em **`iniciar.bat`**
2. Aguarde o servidor iniciar
3. O navegador abre automaticamente

### Reiniciar (após travamentos/atualizações):
1. Execute **`reiniciar_servidor.bat`**
2. Ele para o servidor antigo e inicia novo
3. Aguarde e teste no navegador

### Parar completamente:
1. Execute **`parar_servidor.bat`**
2. Isso mata o processo Node.js
3. Sistema para de funcionar

---

## 🧠 Como Funciona

### O Servidor Node.js:
- Roda em uma **janela CMD separada**
- Continua rodando mesmo se fechar o `iniciar.bat`
- Para parar: feche a janela do Node.js OU execute `parar_servidor.bat`

### O Checkpoint (Salvamento):
- **A cada 10 gerações**: salva automaticamente
- **Ao pausar**: salva imediatamente
- **Na pasta**: `dados_sistema/checkpoint.json`
- **Ao reabrir**: pergunta se quer continuar

---

## 💾 Testar se Checkpoint Funciona

1. Abra: `http://localhost:8080/pro.html`
2. Clique: **"Treinar Aqui"**
3. Treine até G10+ (aguarde)
4. Clique: **"Pausar"** (salva checkpoint)
5. Feche o navegador
6. Reabra: `http://localhost:8080/pro.html`
7. Clique: **"Treinar Aqui"**
8. Deve aparecer: **"💾 CHECKPOINT ENCONTRADO!"**

---

## ❓ Problemas Comuns

### "Página sem resposta" / Travou:
- Feche a aba do navegador
- Execute `reiniciar_servidor.bat`
- Reabra o sistema
- O checkpoint deve estar salvo!

### "Erro 404" nos endpoints:
- O servidor está com código antigo
- Execute `parar_servidor.bat`
- Depois `reiniciar_servidor.bat`

### Checkpoint não carrega:
- Verifique se arquivo existe: `dados_sistema/checkpoint.json`
- Se não existir, treine e pause para criar
- Teste em: `http://localhost:8080/api/existe-checkpoint`

---

## 🔧 Dicas

- **Sempre pause antes de fechar** → salva checkpoint
- **Checkpoint salva TUDO** → geração, população, previsões
- **Nunca perca treinamento** → checkpoint é automático
- **Se travar** → reinicie servidor, continue de onde parou

---

## 📞 Teste Rápido

Abra no navegador:
```
http://localhost:8080/api/existe-checkpoint
```

**Deve retornar:**
```json
{"existe":true}
```
ou
```json
{"existe":false}
```

Se retornar erro HTML → servidor precisa ser reiniciado!

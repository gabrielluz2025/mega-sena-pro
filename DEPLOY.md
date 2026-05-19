# 🚀 DEPLOY NO RENDER.COM - PASSO A PASSO

## ✅ O que você vai conseguir:
- Sistema online 24/7
- Acesso de qualquer lugar (PC, celular, tablet)
- Checkpoint funcionando (salva no servidor)
- URL pública: `https://mega-sena-pro.onrender.com` (exemplo)

---

## 📋 PRÉ-REQUISITOS:
1. Conta no GitHub (grátis): https://github.com
2. Conta no Render (grátis): https://render.com
3. Git instalado no PC (ou use GitHub Desktop)

---

## 🎯 PASSO 1: Criar Repositório no GitHub

### Opção A - Pelo site:
1. Acesse: https://github.com/new
2. Nome: `mega-sena-pro`
3. Deixe como "Público"
4. Clique: **"Create repository"**

### Opção B - Pelo comando (se tiver git instalado):
```bash
cd "c:\Users\xgame\Downloads\MEGA SENA"
git init
git add .
git commit -m "Mega Sena PRO v1.0"
git remote add origin https://github.com/SEU-USUARIO/mega-sena-pro.git
git push -u origin main
```

**Substitua "SEU-USUARIO" pelo seu nome de usuário do GitHub!**

---

## 🎯 PASSO 2: Conectar no Render.com

1. Acesse: https://dashboard.render.com
2. Clique: **"New"** → **"Web Service"**
3. Selecione: **"Build and deploy from a Git repository"**
4. Clique em **"Connect GitHub"** e autorize
5. Procure e selecione: `mega-sena-pro`

---

## 🎯 PASSO 3: Configurar o Deploy

Preencha assim:

| Campo | Valor |
|-------|-------|
| **Name** | mega-sena-pro |
| **Region** | Oregon (US West) |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free |

Clique em: **"Advanced"** e adicione:
- **Disk Name:** `dados`
- **Mount Path:** `/opt/render/project/src/dados_sistema`
- **Disk Size:** `1 GB`

Clique: **"Create Web Service"**

---

## 🎯 PASSO 4: Aguardar (3-5 minutos)

O Render vai:
1. Baixar o código do GitHub
2. Instalar dependências (npm install)
3. Iniciar o servidor
4. Mostrar URL pública

**Quando aparecer "Your service is live" = PRONTO!** ✅

---

## 🎯 PASSO 5: Acessar o Sistema

A URL vai ser algo como:
```
https://mega-sena-pro.onrender.com
```

Abra no navegador e adicione `/pro.html`:
```
https://mega-sena-pro.onrender.com/pro.html
```

**PRONTO!** 🎉 O sistema está online!

---

## ⚠️ IMPORTANTE - Limitações do Plano Grátis:

| Limite | Descrição |
|--------|-----------|
| **Sleep** | Depois de 15 minutos sem uso, "dorme" |
| **Wake up** | Ao acessar, demora 30-60 segundos para "acordar" |
| **Disco** | 1 GB de armazenamento (suficiente!) |
| **Tráfego** | 100 GB/mês (mais que suficiente) |

**Dica:** O checkpoint vai funcionar normalmente, mas se o servidor "dormir", o checkpoint ainda está salvo no disco!

---

## 🔄 ATUALIZAR O SISTEMA (depois de alterar algo):

Se você fizer alterações no código:

```bash
cd "c:\Users\xgame\Downloads\MEGA SENA"
git add .
git commit -m "Atualizacao"
git push origin main
```

O Render atualiza **automaticamente** em 1-2 minutos!

---

## 🆘 SOLUÇÃO DE PROBLEMAS:

### Erro "Build failed":
- Verifique se `package.json` está no repositório
- Verifique se `server.js` está no repositório

### Erro "Port already in use":
- O Render define a porta automaticamente
- Não precisa mudar nada!

### Checkpoint não salva:
- Verifique se o Disk está configurado corretamente
- Path deve ser: `/opt/render/project/src/dados_sistema`

### Página não abre:
- Adicione `/pro.html` no final da URL
- Exemplo: `https://seu-app.onrender.com/pro.html`

---

## 📞 Precisa de ajuda?

Abra o terminal no Render (aba "Shell") e digite:
```bash
cat dados_sistema/checkpoint.json
```

Isso mostra se o checkpoint está sendo salvo!

---

## 🎉 PARABÉNS!

Seu Mega Sena PRO agora está:
- ✅ Online 24/7
- ✅ Acessível de qualquer lugar
- ✅ Com checkpoint funcionando
- ✅ Totalmente GRÁTIS!

**Boa sorte nos jogos!** 🍀🚀

# 🎯 Estratégia 17: Clusters Numéricos

## 📋 Conceito

Detecta **grupos de números próximos** no histórico recente e dá peso aos **vizinhos** desses clusters.

### 🧠 Lógica:
Se no último sorteio saiu `[10, 11, 12]`, formou um **cluster**.
A estratégia identifica isso e dá peso aos vizinhos: `9` e `13`.

---

## 🎰 Como Funciona

### Passo 1: Analisar Últimos 10 Concursos
```javascript
últimosConcursos = baseDadosReais.slice(-10)
```

### Passo 2: Detectar Clusters
Ordena os números e verifica diferenças:
```
Números: [10, 11, 12, 25, 26, 50]
Ordenados: [10, 11, 12, 25, 26, 50]
           ↑↑↑  ← Cluster detectado! (diferença = 1)
              ↑↑ ← Outro cluster! (diferença = 1)
```

### Passo 3: Pontuar
| Situação | Pontuação |
|----------|-----------|
| Número no cluster | `(4 - diferença) × peso × 3` |
| Vizinho esquerdo | `peso × 2` |
| Vizinho direito | `peso × 2` |
| Frequência base | `(30 - rank) × 0.3` |

### Passo 4: Retornar Top 6
Ordena por pontuação e retorna os 6 melhores.

---

## 📊 Exemplo Prático

### Sorteio Anterior:
```
[10, 11, 12, 25, 26, 50]
```

### Clusters Detectados:
- **Cluster 1:** `[10, 11, 12]` (diferenças: 1, 1)
- **Cluster 2:** `[25, 26]` (diferença: 1)

### Vizinhos Priorizados:
- De `10-11-12`: números `9` e `13`
- De `25-26`: números `24` e `27`

### Pontuação Resultante:
```
10, 11, 12: +9 pts cada (cluster forte)
25, 26: +6 pts cada (cluster médio)
9, 13, 24, 27: +4 pts cada (vizinhos)
```

---

## 🆚 Comparativo: Mapeamento de Coordenadas vs Clusters Numéricos

| Aspecto | Mapeamento de Coordenadas | Clusters Numéricos |
|---------|---------------------------|-------------------|
| Dados necessários | Posição X,Y no carregador | Apenas números sorteados |
| Disponibilidade | ❌ Caixa não publica | ✅ Temos no histórico |
| Implementação | Impossível | ✅ Fácil |
| Validável | ❌ Não | ✅ Sim |
| Precisão | Teórica | Prática |

---

## 🔄 Ciclo de Aprendizado

```
Dia 1: Detecta cluster [10,11,12]
   ↓
Estratégia dá peso a 9 e 13
   ↓
Próximo sorteio: sai [9, 14, 23, 34, 45, 51]
   ↓
Acertou 9! Estratégia ganha pontos no ranking
   ↓
IA aprende: vizinhos de clusters funcionam!
```

---

## 💻 Implementação Técnica

```javascript
'clusters': () => {
    const pontuacao = new Map();
    
    // Últimos 10 concursos
    const ultimosConcursos = baseDadosReais.slice(-10);
    
    ultimosConcursos.forEach((concurso, idx) => {
        const numeros = concurso.numeros;
        const pesoRecente = (10 - idx) / 10;
        
        const ordenados = [...numeros].sort((a, b) => a - b);
        
        // Detectar clusters
        for (let i = 0; i < ordenados.length - 1; i++) {
            const atual = ordenados[i];
            const proximo = ordenados[i + 1];
            const diferenca = proximo - atual;
            
            if (diferenca <= 3) { // Cluster!
                // Pontuar números do cluster
                pontuacao.set(atual, pontuacao.get(atual) + (4 - diferenca) * pesoRecente * 3);
                pontuacao.set(proximo, pontuacao.get(proximo) + (4 - diferenca) * pesoRecente * 3);
                
                // Pontuar vizinhos
                if (atual - 1 >= 1) pontuacao.set(atual - 1, pontuacao.get(atual - 1) + pesoRecente * 2);
                if (proximo + 1 <= 60) pontuacao.set(proximo + 1, pontuacao.get(proximo + 1) + pesoRecente * 2);
            }
        }
    });
    
    // Retornar top 6
    return ranqueados.slice(0, 6).map(r => r.numero);
}
```

---

## 🎉 Status

- ✅ **17ª estratégia** implementada
- ✅ **Viável e validável** com dados disponíveis
- ✅ **Pronta para testar**

---

## 📋 Todas as Estratégias (17 total)

1. Top Frequentes
2. Frequentes + Atrasados
3. Primos + Frequentes
4. Dezenas Balanceadas
5. Fibonacci
6. Pares + Ímpares
7. Meio da Tabela
8. Atrasados Recentes
9. Múltiplos de 5
10. Top 3 + Aleatórios
11. Sequência Crescente
12. Números Irmãos
13. Quadrante Mix
14. Soma Balanceada
15. Análise Preditiva
16. **Ciclo de Atraso** ← Nova
17. **Clusters Numéricos** ← Nova

---

## 🚀 Próximos Passos

1. Execute `ATUALIZAR_RENDER.bat`
2. Aguarde deploy no Render (1-2 min)
3. Acesse: https://mega-sena-pro.onrender.com/pro.html
4. Clique: "Análise Completa"
5. Veja onde "Clusters Numéricos" se posiciona no ranking!

**Pronto!** 🎰🧠

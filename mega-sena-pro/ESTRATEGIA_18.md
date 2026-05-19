# 🎯 Estratégia 18: Mapeamento de Coordenadas de Inércia (MCI)

## 📋 Conceito

Mapeia a **posição física** das bolas no carregador (grade 10x6) e analisa padrões de movimentação mecânica baseado nas coordenadas X,Y.

---

## 🗺️ Mapeamento da Grade 10x6

### Fórmula de Coordenadas:
```javascript
X (Coluna 1-10): (numero - 1) % 10 + 1
Y (Linha 1-6):  Math.floor((numero - 1) / 10) + 1
```

### Visualização:
```
        X→  1    2    3    4    5    6    7    8    9    10
      Y↓
      1   01   02   03   04   05   06   07   08   09   10
      2   11   12   13   14   15   16   17   18   19   20
      3   21   22   23   24   25   26   27   28   29   30
      4   31   32   33   34   35   36   37   38   39   40
      5   41   42   43   44   45   46   47   48   49   50
      6   51   52   53   54   55   56   57   58   59   60
```

---

## 🧠 Lógica da Estratégia

### 1. **Análise dos Últimos 3 Concursos**
Analisa padrões recentes (2957, 2958, 2959) para detectar:
- Quais **camadas (Y)** estão sendo mais sorteadas
- Quais **colunas (X)** estão sendo mais sorteadas
- **Clusters espaciais** de coordenadas próximas

### 2. **Peso por Camada (Y)**
```javascript
// Se linhas 5-6 (topo) predominaram:
Y=5 (41-50): peso alto
Y=6 (51-60): peso alto

// Fórmula:
pesoCamada[y] = 1 + (frequencia * 3)  // Peso 1-4
```

**Lógica:** Bolas de certas camadas podem ter inércia diferente no globo.

### 3. **Análise de Coluna Central (X)**
```javascript
// Colunas centrais (4,5,6,7) têm bônus:
X=4,5,6,7: bonusCentral = 0.5

// Fórmula:
pesoColuna[x] = 1 + (frequencia * 2) + bonusCentral
```

**Lógica:** Colunas centrais podem ser mais afetadas pelo mecanismo das pás.

### 4. **Proximidade Física (Clusters Espaciais)**
Calcula **distância euclidiana** entre coordenadas:
```javascript
distancia = √((x1-x2)² + (y1-y2)²)

// Se distancia <= 2: zona quente
pontos += (3 - distancia) * pesoTemporal * 2
```

**Exemplo:**
- Número 23 (X=3, Y=3) próximo a 24 (X=4, Y=3)
- Distância = √((3-4)² + (3-3)²) = 1
- Pontuação alta por proximidade

### 5. **Zonas de Inércia**
```javascript
// Números em zonas duplamente quentes:
if (zonaQuenteX && zonaQuenteY) {
    pontos += 3;  // Bônus extra
}
```

---

## 🔄 Alternativa Híbrida

Se a correlação física for **baixa** (score médio < 2):
```javascript
console.log('🔄 MCI: Correlação física baixa, ativando híbrido com Clusters');

// Cruza com Estratégia 17 (Clusters Numéricos)
// Adiciona peso de vizinhos aritméticos como backup
```

**Garantia:** A sugestão final sempre será robusta, mesmo com dados físicos limitados.

---

## 📊 Assinatura de Fluxo

O sistema gera uma "assinatura" das zonas quentes:
```javascript
{
    camadasQuentes: [5, 6],      // Topo predominante
    colunasQuentes: [4, 5, 6, 7], // Centro predominante
    scoreMedio: "2.45"            // Correlação física média
}
```

---

## 🎰 Exemplo Prático

### Concurso 2958: [07, 09, 14, 35, 42, 49]

**Coordenadas:**
```
07: X=7, Y=1  (coluna central, linha topo)
09: X=9, Y=1  (coluna direita, linha topo)
14: X=4, Y=2  (coluna central, linha 2)
35: X=5, Y=4  (coluna central, linha 4)
42: X=2, Y=5  (coluna esquerda, linha 5)
49: X=9, Y=5  (coluna direita, linha 5)
```

**Clusters Detectados:**
- Nenhum cluster espacial forte
- Predominância: colunas centrais (4,5,7) + linhas 5 e topo

**Sugestão para próximo:**
- Priorizar: X=4,5,6,7 e Y=5,6
- Exemplo: 43(X=3,Y=5)? Não, X=3 não é central
- Exemplo: 46(X=6,Y=5)? Sim! Zona quente dupla!
- Exemplo: 52(X=2,Y=6)? Não, X=2 é lateral
- Exemplo: 57(X=7,Y=6)? Sim! Coluna central + linha 6!

---

## 💻 Implementação

```javascript
'coordenadas': () => {
    function getPhysicalCoordinates(numero) {
        const x = (numero - 1) % 10 + 1;
        const y = Math.floor((numero - 1) / 10) + 1;
        return { x, y, numero };
    }
    
    // Análise dos últimos 3 concursos
    const ultimos3Concursos = baseDadosReais.slice(-3);
    
    // Calcular pesos de camada e coluna
    const pesoCamada = {};
    const pesoColuna = {};
    
    // Calcular proximidade física
    // Gerar assinatura de fluxo
    // Retornar top 6
}
```

---

## 🆚 Comparativo

| Aspecto | Estratégia 17 (Clusters) | Estratégia 18 (Coordenadas) |
|---------|--------------------------|----------------------------|
| Base | Vizinhos aritméticos | Vizinhos espaciais |
| Dados | Apenas números | Coordenadas X,Y |
| Lógica | Números próximos se tocam | Bolas próximas no carregador |
| Híbrido | Não | Sim (com Clusters) |

---

## 📋 Todas as Estratégias (18 total)

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
16. **Ciclo de Atraso** ⭐
17. **Clusters Numéricos** ⭐
18. **Mapeamento Coordenadas** ⭐

---

## 🚀 Próximos Passos

1. Execute `ATUALIZAR_RENDER.bat`
2. Aguarde deploy no Render
3. Acesse: https://mega-sena-pro.onrender.com/pro.html
4. Clique: "Análise Completa"
5. Veja onde "Mapeamento Coordenadas" se posiciona!

**Pronto!** 🎰🗺️

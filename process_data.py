import pandas as pd
import json
import os
from collections import Counter
from datetime import datetime
import random

# Ler o arquivo Excel - pular linhas de cabeçalho
file_path = 'mega_sena_asloterias_ate_concurso_3001_crescente.xlsx'

# Primeiro tentar com skiprows para pular cabeçalhos
df = pd.read_excel(file_path, header=None, skiprows=6)

print("Colunas encontradas:", df.columns.tolist())
print("Primeiras linhas:")
print(df.head(10))

# Identificar colunas de números (geralmente nas colunas 2-7)
# A estrutura típica: [Concurso, Data, N1, N2, N3, N4, N5, N6, ...]
num_cols = [2, 3, 4, 5, 6, 7]  # Colunas dos 6 números

# Verificar se há números válidos
sample_row = df.iloc[0]
print(f"\nAmostra da primeira linha: {sample_row.tolist()}")
print(f"Colunas de números selecionadas: {num_cols}")

# Extrair todos os números sorteados
all_numbers = []
for col in num_cols:
    try:
        values = pd.to_numeric(df[col], errors='coerce').dropna()
        all_numbers.extend(values.astype(int).tolist())
    except:
        pass

print(f"\nTotal de números extraídos: {len(all_numbers)}")

if len(all_numbers) == 0:
    print("Tentando outra abordagem...")
    # Tentar encontrar a linha do cabeçalho
    df2 = pd.read_excel(file_path, header=None)
    for i in range(len(df2)):
        row = df2.iloc[i].tolist()
        numeric_count = sum(1 for x in row if pd.notna(x) and isinstance(x, (int, float)) and 1 <= x <= 60)
        if numeric_count >= 6:
            print(f"Linha {i} parece ter dados: {row}")
            # Usar esta linha como dados
            for j in range(len(row)):
                val = row[j]
                if pd.notna(val) and isinstance(val, (int, float)) and 1 <= val <= 60:
                    all_numbers.append(int(val))
    
    # Se ainda não tem dados, tentar todas as colunas
    if len(all_numbers) == 0:
        for col in df2.columns:
            for val in df2[col].dropna():
                try:
                    v = int(float(val))
                    if 1 <= v <= 60:
                        all_numbers.append(v)
                except:
                    pass

print(f"Total final de números: {len(all_numbers)}")

# Frequência de cada número (1-60)
frequency = Counter(all_numbers)
freq_data = {str(i): frequency.get(i, 0) for i in range(1, 61)}

# Números mais frequentes
top_numbers = sorted(freq_data.items(), key=lambda x: x[1], reverse=True)[:20]

# Números menos frequentes (atrasados)
bottom_numbers = sorted(freq_data.items(), key=lambda x: x[1])[:20]

# Pares e ímpares
all_num_set = set(all_numbers)
pares = [n for n in range(1, 61) if n % 2 == 0]
impares = [n for n in range(1, 61) if n % 2 == 1]

# Analisar últimos sorteios para números atrasados
recent_numbers = set()
for col in num_cols:
    recent_numbers.update(df[col].tail(10).dropna().astype(int).tolist())

atrasados = [n for n in range(1, 61) if n not in recent_numbers]

# Números quentes (mais frequentes no geral)
quentes = [int(n[0]) for n in top_numbers[:15]]

# Números frios (menos frequentes)
frios = [int(n[0]) for n in bottom_numbers[:15]]

# Gerar sugestões combinando estratégias
def gerar_sugestao(tipo):
    if tipo == 'frequentes':
        return sorted(quentes[:6])
    elif tipo == 'atrasados':
        return sorted(atrasados[:6]) if len(atrasados) >= 6 else sorted(atrasados + [int(n[0]) for n in bottom_numbers[:6-len(atrasados)]])
    elif tipo == 'misturado':
        # Mistura de quentes e atrasados
        from random import sample
        q = sample(quentes[:10], 3)
        if len(atrasados) >= 3:
            a = sample(atrasados, 3)
        else:
            a = [int(n[0]) for n in bottom_numbers[:3]]
        return sorted(q + a)
    else:
        # Aleatório baseado em pesos de frequência
        import random
        pesos = [freq_data.get(str(i), 1) for i in range(1, 61)]
        return sorted(random.choices(range(1, 61), weights=pesos, k=6))

# Criar dados para exportar
data = {
    'total_sorteios': len(df),
    'ultimo_concurso': int(df.iloc[-1].iloc[0]) if len(df) > 0 else None,
    'frequencia': freq_data,
    'top_20': top_numbers,
    'menos_frequentes': bottom_numbers,
    'atrasados': atrasados[:20],
    'quentes': quentes,
    'frios': frios,
    'sugestoes': {
        'mais_frequentes': gerar_sugestao('frequentes'),
        'atrasados': gerar_sugestao('atrasados'),
        'estrategia_misturada': gerar_sugestao('misturado'),
        'probabilidade_ponderada': gerar_sugestao('probabilidade')
    }
}

# Salvar como JSON
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Dados processados e salvos em data.json")
print(f"Total de números analisados: {len(all_numbers)}")
print(f"Top 6 números: {top_numbers[:6]}")

import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

# Carregar dados
with open('/home/ubuntu/mega-sena-pro/dados_sistema/previsoes.json', 'r') as f:
    previsoes_data = json.load(f)

with open('/home/ubuntu/mega-sena-pro/dados_sistema/conhecimento.json', 'r') as f:
    conhecimento_data = json.load(f)

# Analisar previsões
historico = previsoes_data.get('historico', [])
df_prev = pd.DataFrame(historico)
df_prev['timestamp'] = pd.to_datetime(df_prev['timestamp'])
df_prev = df_prev.sort_values('timestamp')

# Analisar ranking de estratégias
ranking = conhecimento_data.get('ranking', [])
df_rank = pd.DataFrame(ranking)

# Gerar relatório textual
total_analises = conhecimento_data.get('totalAnalises', 0)
geracao_atual = conhecimento_data.get('geracaoAtual', 0)
melhor_estrategia = df_rank.iloc[0]['nome'] if not df_rank.empty else "N/A"
media_geral = df_rank['mediaAcertos'].mean() if not df_rank.empty else 0

# Criar gráfico de tendência de confiança e média histórica
plt.figure(figsize=(10, 6))
plt.plot(df_prev['timestamp'], df_prev['confianca'], marker='o', label='Confiança da IA (%)', color='purple')
plt.plot(df_prev['timestamp'], df_prev['mediaHistorica'] * 20, marker='s', label='Média Histórica (Escalada x20)', color='emerald' if 'emerald' != 'emerald' else 'green')
plt.title('Evolução da Confiança e Performance da IA')
plt.xlabel('Data/Hora')
    
plt.ylabel('Valor')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.7)
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('/home/ubuntu/mega-sena-pro/tendencia_ia.png')

# Salvar estatísticas para o relatório
stats = {
    "total_analises": total_analises,
    "geracao_atual": geracao_atual,
    "melhor_estrategia": melhor_estrategia,
    "media_geral_acertos": round(media_geral, 3),
    "pico_confianca": df_prev['confianca'].max(),
    "evolucao_confianca": round(df_prev['confianca'].iloc[-1] - df_prev['confianca'].iloc[0], 2) if len(df_prev) > 1 else 0
}

with open('/home/ubuntu/mega-sena-pro/stats_relatorio.json', 'w') as f:
    json.dump(stats, f, indent=2)

print("Análise concluída com sucesso.")

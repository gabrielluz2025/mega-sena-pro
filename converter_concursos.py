#!/usr/bin/env python3
"""
Converte o arquivo Excel da Mega Sena em JSON com todos os concursos
"""
import pandas as pd
import json

def converter_excel_para_json():
    try:
        # Ler o arquivo Excel - pular as primeiras 5 linhas (cabeçalho AsLoterias)
        df = pd.read_excel('mega_sena_asloterias_ate_concurso_3001_crescente.xlsx', header=5)
        
        print(f"Colunas encontradas: {list(df.columns)}")
        print(f"Total de linhas: {len(df)}")
        
        # Exibir primeiras 10 linhas para entender a estrutura
        print("\nPrimeiras 10 linhas:")
        print(df.head(10))
        
        concursos = []
        
        for idx, row in df.iterrows():
            try:
                # Pegar valores das colunas pelo índice
                valores = row.values
                
                # Verificar se tem dados válidos
                if pd.isna(valores[0]):
                    continue
                
                # Concurso é geralmente na coluna 0
                concurso = int(valores[0]) if not pd.isna(valores[0]) else None
                
                # Data na coluna 1
                data = str(valores[1])[:10] if len(valores) > 1 and not pd.isna(valores[1]) else None
                
                # Números nas colunas 2-7
                numeros = []
                for i in range(2, 8):
                    if i < len(valores) and not pd.isna(valores[i]):
                        try:
                            numeros.append(int(valores[i]))
                        except:
                            pass
                
                if concurso and len(numeros) == 6:
                    concursos.append({
                        'concurso': concurso,
                        'data': data,
                        'numeros': sorted(numeros)
                    })
                    
            except Exception as e:
                print(f"Erro na linha {idx}: {e}")
                continue
        
        # Salvar como JSON
        with open('concursos.json', 'w', encoding='utf-8') as f:
            json.dump(concursos, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ {len(concursos)} concursos convertidos com sucesso!")
        print(f"Arquivo salvo: concursos.json")
        
        # Mostrar os 5 primeiros
        print("\nPrimeiros 5 concursos:")
        for c in concursos[:5]:
            print(f"  Concurso {c['concurso']}: {c['numeros']} - {c['data']}")
        
    except Exception as e:
        print(f"Erro: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    converter_excel_para_json()

import pandas as pd
import requests
import json
from datetime import datetime
import os

"""
Sistema de atualização automática dos resultados da Mega Sena
"""

class MegaSenaUpdater:
    def __init__(self, excel_file='mega_sena_asloterias_ate_concurso_3001_crescente.xlsx'):
        self.excel_file = excel_file
        self.api_url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/home/ultimos-resultados"
        # ou usar API alternativa
        self.backup_api = "https://loteriascaixa-api.herokuapp.com/api/mega-sena/"
        
    def buscar_ultimo_resultado_api(self):
        """Busca o último resultado via API da Caixa"""
        try:
            print("🌐 Buscando último resultado na API...")
            
            # Tentar API principal
            response = requests.get(self.api_url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return self._parse_api_response(data)
            
            # Tentar API alternativa
            print("⚠️ API principal indisponível, tentando alternativa...")
            response = requests.get(self.backup_api, timeout=10)
            if response.status_code == 200:
                return self._parse_backup_response(response.json())
                
        except Exception as e:
            print(f"❌ Erro ao buscar API: {e}")
            return None
    
    def _parse_api_response(self, data):
        """Processa resposta da API principal"""
        try:
            # Estrutura pode variar, adaptar conforme necessário
            ultimo = data.get('megaSena', {}).get('ultimoConcurso', {})
            return {
                'concurso': ultimo.get('numero'),
                'data': ultimo.get('dataApuracao'),
                'numeros': [
                    ultimo.get('dezena1'),
                    ultimo.get('dezena2'),
                    ultimo.get('dezena3'),
                    ultimo.get('dezena4'),
                    ultimo.get('dezena5'),
                    ultimo.get('dezena6')
                ]
            }
        except:
            return None
    
    def _parse_backup_response(self, data):
        """Processa resposta da API alternativa"""
        try:
            return {
                'concurso': data.get('concurso'),
                'data': data.get('data'),
                'numeros': data.get('dezenas', [])
            }
        except:
            return None
    
    def ler_ultimo_concurso_excel(self):
        """Lê o último concurso do arquivo Excel existente"""
        try:
            df = pd.read_excel(self.excel_file, header=None, skiprows=6)
            # Encontrar última linha com dados válidos
            for i in range(len(df) - 1, -1, -1):
                row = df.iloc[i]
                nums = [x for x in row if pd.notna(x) and isinstance(x, (int, float)) and 1 <= x <= 60]
                if len(nums) >= 6:
                    return {
                        'linha': i,
                        'concurso': int(row.iloc[0]) if pd.notna(row.iloc[0]) else None,
                        'numeros': nums[:6]
                    }
            return None
        except Exception as e:
            print(f"❌ Erro ao ler Excel: {e}")
            return None
    
    def adicionar_novo_sorteio(self, dados):
        """Adiciona um novo sorteio ao Excel"""
        try:
            print(f"\n📝 Adicionando concurso {dados['concurso']}...")
            print(f"📅 Data: {dados['data']}")
            print(f"🔢 Números: {dados['numeros']}")
            
            # Ler Excel existente
            df = pd.read_excel(self.excel_file, header=None)
            
            # Encontrar onde começam os dados (linha após cabeçalhos)
            data_start_row = 0
            for i in range(len(df)):
                row = df.iloc[i].tolist()
                valid_nums = sum(1 for x in row if pd.notna(x) and isinstance(x, (int, float)) and 1 <= x <= 60)
                if valid_nums >= 6:
                    data_start_row = i
                    break
            
            # Criar nova linha
            nova_linha = [dados['concurso'], dados['data']] + dados['numeros']
            
            # Adicionar ao DataFrame
            nova_df = pd.DataFrame([nova_linha])
            
            # Concatenar
            df_final = pd.concat([df, nova_df], ignore_index=True)
            
            # Salvar
            df_final.to_excel(self.excel_file, index=False, header=False)
            
            print(f"✅ Concurso {dados['concurso']} adicionado com sucesso!")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao adicionar: {e}")
            return False
    
    def verificar_atualizacao(self):
        """Verifica se há novos sorteios e atualiza"""
        print("🔍 Verificando atualizações...\n")
        
        # Ler último concurso do Excel
        ultimo_local = self.ler_ultimo_concurso_excel()
        if not ultimo_local:
            print("❌ Não foi possível ler o arquivo local")
            return False
        
        print(f"📊 Último concurso local: {ultimo_local['concurso']}")
        
        # Buscar último resultado online
        ultimo_online = self.buscar_ultimo_resultado_api()
        if not ultimo_online:
            print("❌ Não foi possível buscar dados online")
            return False
        
        print(f"🌐 Último concurso online: {ultimo_online['concurso']}")
        
        # Comparar
        if ultimo_online['concurso'] > ultimo_local['concurso']:
            print(f"\n🎉 Novo sorteio encontrado! Concurso {ultimo_online['concurso']}")
            return self.adicionar_novo_sorteio(ultimo_online)
        else:
            print("✅ Dados já estão atualizados!")
            return True
    
    def modo_interativo(self):
        """Modo interativo para adicionar manualmente"""
        print("\n" + "="*50)
        print("🎰 ATUALIZAÇÃO MANUAL - MEGA SENA")
        print("="*50)
        
        concurso = input("Digite o número do concurso: ")
        data = input("Digite a data (DD/MM/AAAA): ")
        
        print("\nDigite os 6 números sorteados:")
        numeros = []
        for i in range(1, 7):
            while True:
                try:
                    num = int(input(f"  Número {i}: "))
                    if 1 <= num <= 60:
                        numeros.append(num)
                        break
                    else:
                        print("    ⚠️ Número deve ser entre 1 e 60")
                except:
                    print("    ⚠️ Digite um número válido")
        
        dados = {
            'concurso': int(concurso),
            'data': data,
            'numeros': sorted(numeros)
        }
        
        confirmar = input(f"\nAdicionar concurso {concurso} com números {numeros}? (s/n): ")
        if confirmar.lower() == 's':
            self.adicionar_novo_sorteio(dados)
        else:
            print("❌ Operação cancelada")


def main():
    updater = MegaSenaUpdater()
    
    print("\n" + "="*50)
    print("🎰 SISTEMA DE ATUALIZAÇÃO - MEGA SENA")
    print("="*50)
    print("\n1️⃣ Verificar atualizações automáticas (API)")
    print("2️⃣ Adicionar sorteio manualmente")
    print("3️⃣ Sair")
    
    opcao = input("\nEscolha uma opção (1-3): ")
    
    if opcao == '1':
        updater.verificar_atualizacao()
    elif opcao == '2':
        updater.modo_interativo()
    else:
        print("👋 Até logo!")


if __name__ == "__main__":
    main()

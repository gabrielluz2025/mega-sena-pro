# Mega Sena Nexus v5.0 - TODO

## Fase 1: Banco de Dados e Esquema

- [x] Criar tabela `lotteries` para armazenar informações de loterias (Mega Sena, Quina, Lotofácil, etc.)
- [x] Criar tabela `draws` para armazenar resultados de concursos com números sorteados
- [x] Criar tabela `user_bets` para armazenar apostas pessoais dos usuários
- [x] Criar tabela `ai_strategies` para armazenar as 18+ estratégias de IA com pesos e histórico de acertos
- [x] Criar tabela `ai_suggestions` para armazenar sugestões geradas pela IA com histórico e comparação com resultados reais
- [x] Criar tabela `ai_training_log` para rastrear evolução dos pesos das estratégias
- [x] Criar tabela `user_wallet` para gestão financeira com gastos e ROI por período
- [x] Criar tabela `user_alerts` para alertas personalizados de números em atraso crítico
- [x] Executar migrações SQL no banco de dados

## Fase 2: Backend - Análise Estatística e Motor de IA

- [x] Implementar função de análise estatística: frequência de números
- [x] Implementar função de análise estatística: atraso de números
- [x] Implementar função de análise estatística: paridade (par/ímpar)
- [x] Implementar função de análise estatística: soma de números
- [x] Implementar função de análise estatística: números primos
- [x] Implementar função de análise estatística: sequência de Fibonacci
- [x] Implementar função de análise estatística: padrões geométricos
- [x] Implementar motor de IA com 18+ estratégias de predição
- [x] Implementar ranking de confiança para cada sugestão de número
- [x] Implementar explicação do raciocínio da IA (quais estratégias influenciaram cada número)
- [x] Criar tRPC procedure para obter análises estatísticas completas
- [x] Criar tRPC procedure para gerar sugestões automáticas do próximo concurso
- [x] Criar tRPC procedure para cadastrar novos resultados de concursos
- [x] Criar tRPC procedure para recuperar histórico de sugestões geradas

## Fase 3: Frontend - Design Glassmorphism 2.0 e Layout Bento Grid

- [x] Configurar tema escuro global com cores neon (verde, azul, roxo)
- [x] Implementar componentes de painel Glassmorphism 2.0 com transparência e blur
- [x] Criar layout Bento Grid responsivo para o dashboard principal
- [x] Implementar componente de header com navegação principal
- [x] Implementar componente de sidebar com menu de navegação
- [x] Criar página Home com dashboard principal em Bento Grid
- [x] Implementar painel de "Próximas Sugestões" com números e confiança
- [x] Implementar painel de "Análise de Frequência" com gráfico de números quentes/frios
- [x] Implementar painel de "Atrasos Críticos" com números em atraso
- [x] Implementar painel de "Estatísticas Gerais" com informações consolidadas

## Fase 4: IA Preditiva e Sugestões Automáticas

- [ ] Implementar estratégia 1: Análise de Frequência
- [ ] Implementar estratégia 2: Análise de Atraso
- [ ] Implementar estratégia 3: Paridade Alternada
- [ ] Implementar estratégia 4: Soma Alvo
- [ ] Implementar estratégia 5: Números Primos
- [ ] Implementar estratégia 6: Sequência de Fibonacci
- [ ] Implementar estratégia 7: Padrão Geométrico
- [ ] Implementar estratégia 8: Correlação de Pares
- [ ] Implementar estratégia 9: Ciclo de Números
- [ ] Implementar estratégia 10: Distribuição Uniforme
- [ ] Implementar estratégia 11: Análise de Gaps
- [ ] Implementar estratégia 12: Tendência de Crescimento
- [ ] Implementar estratégia 13: Números Vizinhos
- [ ] Implementar estratégia 14: Padrão de Repetição
- [ ] Implementar estratégia 15: Análise de Posição
- [ ] Implementar estratégia 16: Clustering de Números
- [ ] Implementar estratégia 17: Análise de Sequência
- [ ] Implementar estratégia 18: Modelo Probabilístico Avançado
- [ ] Implementar sistema de pesos adaptativos para estratégias
- [ ] Criar página de "Sugestões da IA" com explicação detalhada de cada número
- [ ] Implementar histórico de sugestões com comparação com resultados reais

## Fase 5: Meus Jogos, Gestão Financeira e Alertas

- [x] Criar página "Meus Jogos" com interface para salvar apostas pessoais
- [x] Implementar conferidor automático de acertos (comparar aposta com resultado)
- [x] Implementar histórico de jogos salvos com filtros por período
- [x] Criar página "Carteira" com gestão de gastos e ROI
- [x] Implementar cálculo de ROI por período (dia, semana, mês, ano)
- [x] Implementar cálculo de ROI por estratégia
- [x] Implementar gráfico de evolução de gastos vs ganhos
- [x] Criar página "Alertas" com configuração de notificações
- [x] Implementar alerta de números em atraso crítico (configurável)
- [x] Implementar alerta de concursos com prêmio acumulado
- [x] Implementar tRPC procedures para salvar/recuperar apostas
- [x] Implementar tRPC procedures para gestão de carteira

## Fase 6: Autenticação Manus OAuth e Sincronização de Dados

- [x] Verificar integração de Manus OAuth já configurada no template
- [x] Implementar tRPC protectedProcedure para todas as operações de usuário
- [x] Vincular todas as tabelas de dados ao campo `userId` do usuário autenticado
- [x] Implementar sincronização de dados por sessão de usuário
- [x] Testar persistência de dados ao recarregar a página
- [x] Testar persistência de dados ao trocar de sessão
- [x] Implementar logout com limpeza de cache local

## Fase 7: Testes, Otimizações e Deploy

- [ ] Escrever testes unitários para funções de análise estatística
- [ ] Escrever testes unitários para motor de IA
- [ ] Escrever testes de integração para tRPC procedures
- [ ] Testar fluxo completo de autenticação e persistência de dados
- [ ] Otimizar performance de cálculos de IA (cache de resultados)
- [ ] Otimizar performance de renderização do dashboard (lazy loading)
- [ ] Realizar testes de responsividade em diferentes tamanhos de tela
- [ ] Realizar testes de acessibilidade (contraste, navegação por teclado)
- [ ] Criar checkpoint final
- [ ] Realizar deploy da plataforma

## Notas Gerais

- Tema: Glassmorphism 2.0 com cores neon (verde #00FF00, azul #00BFFF, roxo #9D4EDD)
- Layout: Bento Grid responsivo
- Autenticação: Manus OAuth (já integrada no template)
- Banco de Dados: MySQL/TiDB (já configurado no template)
- Persistência: Todos os dados vinculados ao usuário autenticado

# Mapeamento de Melhorias - Mega Sena Pro

## 1. Problemas Identificados no Treinamento da IA
- **Falta de Persistência de Ciclos:** O treinamento atual (gerações) é incrementado, mas não é salvo de forma persistente no servidor como um "checkpoint" completo. Se a página for recarregada, o progresso pode ser perdido se o `localStorage` falhar ou for limpo.
- **Treinamento Volátil:** O "Treinamento Contínuo" roda em memória e não sincroniza o estado da população/geração com o servidor periodicamente.
- **Conhecimento não Acumulativo:** O sistema aumenta pesos, mas não salva o estado interno da "população" da IA (se houvesse um algoritmo genético mais complexo) ou o histórico detalhado de evolução para recuperação.

## 2. Problemas nas Sugestões de Próximos Jogos
- **Persistência Local:** O histórico de sugestões para o próximo concurso fica apenas no `localStorage`.
- **Algoritmo de Confiança:** A confiança é calculada com base em pesos, mas poderia ser mais robusta integrando o sucesso histórico real de cada estratégia de forma mais agressiva.
- **Sincronização:** Quando um novo resultado é inserido, o sistema "aprende", mas esse aprendizado precisa ser consolidado no servidor imediatamente.

## 3. Soluções Propostas
- **Integração com Endpoints de Checkpoint:** Usar `POST /api/salvar-checkpoint` e `GET /api/carregar-checkpoint` para salvar o estado completo do treinamento (geração atual, pesos, histórico de evolução).
- **Persistência de Previsões:** Usar `POST /api/salvar-previsoes` para manter o histórico de sugestões no servidor.
- **Melhoria no Algoritmo de Sugestão:**
    - Ajustar o cálculo de `score` para dar mais peso às estratégias que acertaram mais nos últimos 50 concursos.
    - Implementar uma "Memória de Longo Prazo" salvando os ciclos de aprendizado.
- **Robustez de Dados:** Criar uma função centralizada de sincronização que garanta que `localStorage` e `Servidor` estejam sempre em sintonia.

## 4. Plano de Ação Técnico
1. Modificar `iniciarSistema` para carregar checkpoint do servidor.
2. Modificar `salvarConhecimento` para também chamar o endpoint de checkpoint.
3. Modificar `gerarSugestaoProximoJogo` para salvar no servidor.
4. Refatorar o cálculo de confiança e score na aba de próximos jogos.

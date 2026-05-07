# EDA com Copilot - Guia rapido

Este guia acompanha o notebook da trilha IA.

## Contrato didatico

- Copilot pode gerar codigo completo.
- Nenhuma conclusao e aceita sem evidencia (tabela, metrica ou grafico).
- Aluno precisa justificar a escolha tecnica em linguagem simples.

## Prompt base

```text
Voce e meu copiloto de EDA em Python.
Contexto: dataset Iris em pandas com colunas sepal_length, sepal_width, petal_length, petal_width, species.
Objetivo: [descreva em 1 frase].
Restricoes: codigo curto, legivel, sem bibliotecas fora de pandas/matplotlib/seaborn.
Saida: 1) codigo 2) o que validar manualmente 3) riscos da abordagem.
```

## Prompt para revisar resposta da IA

```text
Revise criticamente sua propria resposta anterior.
Aponte: (a) possiveis erros logicos, (b) suposicoes nao verificadas, (c) como testar no dataset.
Nao reescreva tudo: entregue checklist objetivo.
```

## Checklist de validacao (aluno)

- [ ] O codigo roda sem erro.
- [ ] O resultado foi interpretado com base no dado.
- [ ] Existe evidencia explicita para a conclusao.
- [ ] Foi registrada ao menos 1 limitacao da analise.
- [ ] Foi registrado ao menos 1 erro do Copilot e a correcao.

## Rubrica sugerida

- Notebook tecnico: 50%
- Checklist de validacao: 25%
- Reflexao sobre prompts e erros da IA: 25%

## Erros comuns para observar

1. Aceitar media sem checar outliers.
2. Concluir causalidade com base apenas em correlacao.
3. Rodar grafico bonito sem interpretacao.
4. Trocar coluna alvo por coluna de apoio sem perceber.
5. Repetir resposta do Copilot sem verificacao.

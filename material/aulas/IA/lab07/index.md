# TensorFlow

Neste módulo, vamos explorar os fundamentos das redes neurais e aplicar esses conceitos usando a biblioteca TensorFlow. 

O TensorFlow não apenas facilita a construção e o treinamento de modelos complexos, mas também oferece ferramentas robustas para o processamento de dados, essenciais para qualquer projeto de machine learning.

### Objetivos de Aprendizado

- Entender o funcionamento das redes neurais.
- Desenvolver habilidades práticas em modelagem e treinamento de redes neurais com TensorFlow.
- Aplicar redes neurais em problemas reais de classificação e regressão.

### Atividades Práticas
As seguintes atividades foram preparadas para reforçar os conceitos abordados (**Faça o downlod dos datasets nos links a seguir**)


**Despesas Médicas** – Problema de Regressão

  - **Contexto**: Informações sobre pacientes (idade, índice de massa corporal, número de filhos, tabagismo, região, etc.) para prever o custo anual de despesas médicas.
  - **Modelo Sugerido**: Rede Neural Multilayer Perceptron (MLP) para regressão.
  - **Métricas de Avaliação**: RMSE e R² para avaliar a performance na estimativa dos custos.
  - **[insurance](insurance.csv)**: Dataset com informações sobre pacientes (idade, IMC, número de filhos, tabagismo, região, etc.) para prever o custo anual de despesas médicas.

**Vendas com Base em Investimento Publicitário** – Problema de Regressão

  - **Contexto**: Dados sobre investimentos em TV, rádio e jornal, com o objetivo de prever o volume de vendas obtido.
  - **Modelo Sugerido**: Rede Neural Multilayer Perceptron (MLP) para regressão.
  - **Métricas de Avaliação**: RMSE (Root Mean Square Error) e R² para mensurar o erro e a capacidade explicativa do modelo.
  - **[Advertising](Advertising.csv)**: Dataset com dados sobre investimentos em TV, rádio e jornal, com o objetivo de prever o volume de vendas obtido.

**Rotatividade de Funcionários** - Problema de Classificação Binária

  - **Contexto**: Dataset com informações de funcionários, incluindo desempenho, tempo de casa, salário e histórico profissional, para prever se o colaborador irá deixar a organização.
  - **Modelo Sugerido**: Rede Neural Multilayer Perceptron (MLP) com camadas densas.
  - **Métricas de Avaliação**: Acurácia, Recall (especialmente para a classe de saída), F1-score e AUC para medir a capacidade do modelo em prever desligamentos.
  - **[turnover](turnover.csv)**: Dataset com informações de funcionários (nível de satisfação, avaliações, número de projetos, carga horária, tempo de empresa, setor e salário) para prever se o colaborador irá deixar a organização.

**Churn de Clientes** – Problema de Classificação Binária 

  - **Contexto**: Dataset com informações demográficas e financeiras de clientes de um banco, visando prever se o cliente irá encerrar sua conta (*churn*).
  - **Modelo Sugerido**: Rede Neural Multilayer Perceptron (MLP) com camadas densas.
  - **Métricas de Avaliação**: Acurácia, Precisão, Recall, F1-score e AUC para avaliar a capacidade do modelo em identificar clientes propensos ao churn.
  - **[Churn_Modelling](Churn_Modelling.csv)**: Dataset com informações demográficas e financeiras de clientes de um banco, visando prever se o cliente irá encerrar sua conta (*churn*).


### Pré-processamento e Tratamento de Dados

Antes de aplicar o treinamento de modelos, é necessário realizar o pré-processamento e o tratamento adequado dos dados. Esse processo inclui:

- **Limpeza de Dados**: Remoção de valores ausentes ou correção de dados corrompidos.
- **Normalização/Padronização**: Escalonamento dos valores numéricos para que o modelo não seja enviesado por características com escalas grandes.
- **Codificação de Variáveis Categóricas**: Transformação de variáveis categóricas em formatos numéricos que podem ser interpretados pelo modelo, como one-hot encoding.



Vamos começar!!!
# Classificação em Machine Learning

Nesta aula, vamos aprender a treinar modelos de machine learning para problemas de classificação, passando por casos binários, múltiplas classes e múltiplos rótulos. Também vamos entender como selecionar e interpretar as métricas mais adequadas, analisando a matriz de confusão e os níveis de confiança das previsões.

### Atividades Práticas
As seguintes atividades foram preparadas para reforçar os conceitos abordados:

- **[Lab 1: Flores Iris](ml-classificador-iris.ipynb)**  
  Uma introdução aos conceitos básicos de classificação, utilizando o famoso dataset Iris para prever a espécie de uma flor.
- **[Lab 2: Classificação digitos](ml-classificador-digito.ipynb)**  
  Uma exploração mais aprofundada, com foco em problemas multiclasses. O objetivo é criar um modelo para identificar dígitos manuscritos (de 0 a 9) a partir de imagens.
- **[Lab 3: classificação de renda](ml-classificador-renda.ipynb)**  
  Um desafio de classificação binária, onde treinamos um modelo para prever se a renda de uma pessoa é superior ou inferior a 50 mil dólares por ano, com base em suas características demográficas.

### Datasets
Os laboratórios utilizam os seguintes conjuntos de dados:
- **[renda](df.csv)**: Dataset de características demográficas, utilizado no Lab 3 para o problema de classificação de renda.

## O que é Classificação?

A **classificação** em *Machine Learning* é uma tarefa em que o objetivo do modelo é **prever a qual categoria ou classe um determinado exemplo pertence**, a partir de suas características (também chamadas de *features*).

Pense nela como um processo de **tomada de decisão automatizada**: o modelo analisa padrões nos dados de treinamento e aprende regras internas que o ajudam a classificar novos exemplos corretamente.

### Tipos de Problemas de Classificação

1. **Classificação binária** – Quando existem apenas duas classes possíveis.  
   *Exemplo:* detectar se um e-mail é “spam” ou “não spam”.

2. **Classificação multiclasses** – Quando há mais de duas classes e cada exemplo pertence a apenas uma delas.  
   *Exemplo:* identificar o gênero de um filme como “comédia”, “drama” ou “ação”.

A classificação pode ser aplicada em diversas áreas, como:

- Saúde (diagnóstico de doenças)
- Indústria (detecção de falhas)
- Finanças (análise de risco)
- Reconhecimento de imagens
- Processamento de linguagem natural

## Como Funciona o Treinamento

No aprendizado supervisionado de um modelo de classificação, trabalhamos com dois conjuntos de dados:

- **Conjunto de Treinamento**: É o conjunto de dados rotulados (com as respostas corretas) que usamos para ensinar o modelo a reconhecer padrões. O modelo "aprende" a mapear as características de entrada para suas respectivas classes de saída.

--**Conjunto de Teste**: É um conjunto de dados completamente novo, não utilizado durante o treinamento. Ele serve para avaliar se o modelo aprendeu bem e consegue generalizar para dados que ele nunca viu antes, simulando o uso no mundo re


## Principais algoritimos de classificação

Existem diferentes tipos de algoritimos para classificação, entre os mais usados, temos:

- K-Nearest Neighbors (KNN) → Baseado em proximidade no espaço das features.
- Árvores de Decisão e Random Forests → Divisão hierárquica de dados com regras.
- Naive Bayes → Baseado em probabilidade condicional.
- Regressão Logística → Modelo estatístico para classificação binária.
- Support Vector Machines (SVM) → Cria hiperplanos separadores.
- Redes Neurais → Aprendem representações complexas.


### Exemplo em Python

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# Carregar dataset
data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.3, random_state=42
)

# Treinar modelo
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Fazer previsões
y_pred = model.predict(X_test)

# Avaliar resultados
print(f"A classe predita é: {y_pred}")
```

## Métricas de avaliação 

Para saber se o nosso modelo é bom, precisamos avaliar o seu desempenho. A forma mais comum de fazer isso é usando métricas de avaliação, que nos ajudam a entender não apenas quantos acertos o modelo teve, mas também os tipos de erros que ele cometeu.

### Matriz de Confusão

A matriz de confusão é uma ferramenta fundamental para visualizar o desempenho de um classificador. Ela resume os resultados do modelo em uma tabela, comparando as previsões com os valores reais. Para problemas binários, a matriz tem a seguinte estrutura:

|                | **Predição: Positivo** | **Predição: Negativo** |
|----------------|------------------------|------------------------|
| **Real: Positivo** | Verdadeiro Positivo (VP) | Falso Negativo (FN)    |
| **Real: Negativo** | Falso Positivo (FP)      | Verdadeiro Negativo (VN) |

onde: 

- **Verdadeiro Positivo (VP)**: O modelo previu a classe positiva e a classe real era positiva. *(Acerto)*
- **Verdadeiro Negativo (VN)**: O modelo previu a classe negativa e a classe real era negativa. *(Acerto)*
- **Falso Positivo (FP)**: O modelo previu a classe positiva, mas a classe real era negativa. *(Erro tipo I)*
- **Falso Negativo (FN)**: O modelo previu a classe negativa, mas a classe real era positiva. *(Erro tipo II)*


A partir da matriz de confusão, podemos calcular as métricas mais comuns:

### 1. **Acurácia (Accuracy)**

Mede a proporção total de previsões corretas. É a métrica mais simples, mas pode ser enganosa em *datasets* desbalanceados.

\[
\text{Acurácia} = \frac{VP + VN}{VP + VN + FP + FN}
\]


### 2. **Precisão (Precision)**

Mede a proporção de previsões positivas que foram realmente corretas. É importante quando o custo de um falso positivo é alto.

\[
\text{Precisão} = \frac{VP}{VP + FP}
\]


### 3. **Revocação (Recall) / Sensibilidade (Sensitivity)**

Mede a proporção de casos positivos reais que o modelo conseguiu identificar corretamente. É importante quando o custo de um falso negativo é alto.

\[
\text{Revocação} = \frac{VP}{VP + FN}
\]



### 4. **F1-Score**

É a média harmônica entre precisão e revocação. É útil quando queremos um equilíbrio entre as duas métricas, especialmente em *datasets* desbalanceados.

\[
\text{F1-Score} = 2 \times \frac{\text{Precisão} \times \text{Revocação}}{\text{Precisão} + \text{Revocação}}
\]


### Exemplo em Python

```python
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# --------------------------------------------
# Supondo que o modelo já foi treinado
# e que temos:
# y_test -> classes reais (valores corretos)
# y_pred -> classes previstas pelo modelo
# --------------------------------------------

# 1. Calcular a Matriz de Confusão
# Mostra a contagem de acertos e erros para cada classe
conf_matrix = confusion_matrix(y_test, y_pred)

# 2. Gerar o Relatório de Classificação
# Inclui métricas por classe: Precisão, Revocação e F1-Score
report = classification_report(y_test, y_pred)

# 3. Calcular a Acurácia Global
# Mede a proporção de previsões corretas em relação ao total
acuracia = accuracy_score(y_test, y_pred)

# 4. Exibir os resultados
print("=== Matriz de Confusão ===")
print(conf_matrix)
print("\n=== Relatório de Classificação ===")
print(report)
print(f"Acurácia média de classificação: {acuracia:.2f}")

```

---

knn

---

<div id="knn-widget" style="max-width:980px;margin:1.25rem 0;padding:1rem;border:1px solid var(--md-default-fg-color--lightest,#e0e0e0);border-radius:14px;background:var(--md-default-bg-color,#fff)">
  <h3 style="margin:0 0 .5rem 0">Classificação KNN — ajuste <em>k</em> e explore a fronteira de decisão</h3>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end">
    <label style="flex:1 1 260px">
      <div><code>k</code>: <strong><span id="kVal">5</span></strong> (ímpares recomendados)</div>
      <input id="k" type="range" min="1" max="31" step="1" value="1" style="width:100%">
    </label>

    <label style="flex:1 1 260px">
      <div>ruído (dispersão): <strong><span id="noiseVal">1.00</span></strong></div>
      <input id="noise" type="range" min="0.5" max="2.0" step="0.05" value="1.40" style="width:100%">
    </label>

    <div style="flex:1 1 240px;line-height:1.6">
      <label style="display:flex;gap:.5rem;align-items:center">
        <input id="wdist" type="checkbox"> ponderar por distância (1/d)
      </label>
      <label style="display:flex;gap:.5rem;align-items:center">
        <input id="shade" type="checkbox" checked> mostrar região de decisão
      </label>
      <div><strong>Acurácia</strong>: <span id="acc">—</span></div>
    </div>

    <div style="flex:1 1 220px;display:flex;gap:.5rem;justify-content:flex-end">
      <button id="btnRegen" class="md-button md-button--primary" style="white-space:nowrap">Regerar dataset</button>
      <button id="btnReset" class="md-button" style="white-space:nowrap">Reset</button>
    </div>
  </div>

  <div style="position:relative;margin-top:.75rem">
    <canvas id="knnCanvas" width="920" height="540" style="width:100%;display:block;background:#fff;border-radius:10px"></canvas>
    <div style="position:absolute;left:8px;bottom:8px;color:#666;font-size:.85em">x₁, x₂ no quadrado [0,10] × [0,10] • azul = classe 0 • vermelho = classe 1</div>
  </div>

  <details style="margin-top:.75rem">
    <summary><strong>Como funciona</strong></summary>
    <p style="margin:.5rem 0 0 0">
      O KNN prevê a classe de um ponto pela maioria entre seus <em>k</em> vizinhos mais próximos. A opção “ponderar por distância” dá mais peso aos vizinhos mais próximos.
      A região colorida mostra a previsão do classificador; os pontos são os dados reais. Ajuste <em>k</em> e o ruído para observar <em>overfitting</em> (k pequeno) vs <em>underfitting</em> (k grande).
    </p>
  </details>
</div>

---

Regressão logistica

--- 


<div id="logreg-widget" style="max-width:980px;margin:1.25rem 0;padding:1rem;border:1px solid var(--md-default-fg-color--lightest,#e0e0e0);border-radius:14px;background:var(--md-default-bg-color,#fff)">
  <h3 style="margin:0 0 .5rem 0">Classificação — Regressão Logística</h3>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end">
    <label style="flex:1 1 220px">
      <div>w₁: <strong><span id="w1Val">-1.00</span></strong></div>
      <input id="w1" type="range" min="-10" max="10" step="0.01" value="0.00" style="width:100%">
    </label>
    <label style="flex:1 1 220px">
      <div>w₂: <strong><span id="w2Val">1.00</span></strong></div>
      <input id="w2" type="range" min="-10" max="10" step="0.01" value="-10.00" style="width:100%">
    </label>
    <label style="flex:1 1 220px">
      <div>b: <strong><span id="bVal">0.00</span></strong></div>
      <input id="b" type="range" min="-20" max="20" step="0.01" value="20.00" style="width:100%">
    </label>

    <div style="flex:1 1 240px;line-height:1.6">
      <div><strong>Acurácia</strong>: <span id="accLr">—</span></div>
      <label style="display:flex;gap:.5rem;align-items:center">
        <input id="shadeLr" type="checkbox" checked> mostrar região de probabilidade
      </label>
    </div>

    <div style="flex:1 1 260px;display:flex;gap:.5rem;justify-content:flex-end">
      <button id="btnFitLr" class="md-button md-button--primary" style="white-space:nowrap">Auto-ajustar (gradiente)</button>
      <button id="btnResetLr" class="md-button" style="white-space:nowrap">Reset</button>
    </div>
  </div>

  <div style="position:relative;margin-top:.75rem">
    <canvas id="logregCanvas" width="920" height="540" style="width:100%;display:block;background:#fff;border-radius:10px"></canvas>
    <div style="position:absolute;left:8px;bottom:8px;color:#666;font-size:.85em">
      x₁, x₂ em [0,10] × [0,10] • azul = classe 0 • vermelho = classe 1 • contorno preto = fronteira p=0.5
    </div>
  </div>
</div>


# Classificação em Machine Learning

Nesta aula, vamos estudar classificação de forma prática e tecnicamente correta: formulação do problema, escolha de algoritmo, avaliação com métricas adequadas e interpretação de erros do modelo.

### Atividades Práticas
As seguintes atividades foram preparadas para reforçar os conceitos abordados:

- **[Lab 1: Flores Iris](ml-classificador-iris.ipynb)**  
  Introdução aos conceitos básicos de classificação usando o dataset Iris.
- **[Lab 2: Classificação de dígitos](ml-classificador-digito.ipynb)**  
  Foco em problema multiclasse com imagens de dígitos (0 a 9).
- **[Lab 3: Classificação de renda](ml-classificador-renda.ipynb)**  
  Problema binário para prever se a renda anual é maior que 50 mil dólares.

### Datasets
Os laboratórios utilizam os seguintes conjuntos de dados:
- **[renda](df.csv)**: dataset de características demográficas usado no Lab 3.

## O que é Classificação?

A **classificação** em *Machine Learning* é uma tarefa supervisionada em que o modelo aprende uma função que mapeia entradas (features) para uma classe discreta.

Em termos simples: dado um novo exemplo, o modelo escolhe qual rótulo é o mais provável.

### Tipos de Problemas de Classificação

1. **Classificação binária**: duas classes possíveis.  
   *Exemplo:* spam vs. não spam.
2. **Classificação multiclasse**: mais de duas classes e cada amostra pertence a uma única classe.  
   *Exemplo:* reconhecer o dígito de 0 a 9.
3. **Classificação multilabel**: uma mesma amostra pode ter vários rótulos ao mesmo tempo.  
   *Exemplo:* uma imagem marcada como "praia", "pôr do sol" e "pessoas".

Aplicações comuns:

- Saúde (triagem e apoio ao diagnóstico)
- Finanças (risco de crédito e fraude)
- Indústria (detecção de falhas)
- Visão computacional e NLP

## Fluxo de Treinamento Recomendado

Em cenários reais, o fluxo mínimo recomendado é:

1. Separar os dados em treino e teste (e validação quando necessário).
2. Ajustar pré-processamento e modelo **apenas no treino** para evitar vazamento de dados.
3. Selecionar hiperparâmetros com validação cruzada.
4. Avaliar no teste apenas no final.

Boas práticas importantes:

- Em classificação, prefira `train_test_split(..., stratify=y)` para manter proporções de classes.
- Use `Pipeline` quando houver transformação de dados (escala, imputação, encoding).
- Não escolha modelo usando o conjunto de teste.

## Principais Algoritmos de Classificação

- **KNN**: baseado em vizinhança; sensível à escala das features.
- **Árvores/Random Forest**: capturam relações não lineares e interações.
- **Naive Bayes**: simples, rápido e forte baseline para texto.
- **Regressão Logística**: baseline robusto para binário e também multiclasse (`multinomial`).
- **SVM**: bom desempenho em margens bem definidas, pode exigir tuning cuidadoso.
- **Redes neurais**: alta capacidade, especialmente em dados complexos (imagem, texto, áudio).

### Exemplo em Python (pipeline + avaliação básica)

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# 1) Carrega dados
data = load_iris()
X, y = data.data, data.target

# 2) Split estratificado
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# 3) Pipeline (escala + modelo)
model = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])

# 4) Treina e prevê
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 5) Avalia
print(f"Acurácia: {accuracy_score(y_test, y_pred):.3f}")
print("\nMatriz de confusão:")
print(confusion_matrix(y_test, y_pred))
print("\nRelatório de classificação:")
print(classification_report(y_test, y_pred, digits=3))
```

## Métricas de Avaliação

Não existe "métrica universal". A métrica correta depende do custo do erro no contexto do problema.

### Matriz de Confusão

A matriz de confusão mostra, para cada classe, quantos exemplos foram classificados corretamente e onde o modelo erra.

Para classificação binária:

|                | **Predito Positivo** | **Predito Negativo** |
|----------------|----------------------|----------------------|
| **Real Positivo** | Verdadeiro Positivo (VP) | Falso Negativo (FN) |
| **Real Negativo** | Falso Positivo (FP) | Verdadeiro Negativo (VN) |

### Métricas principais (binário)

1. **Acurácia**

\[
\text{Acurácia} = \frac{VP + VN}{VP + VN + FP + FN}
\]

Boa em classes balanceadas. Pode ser enganosa em dados desbalanceados.

2. **Precisão (Precision)**

\[
\text{Precisão} = \frac{VP}{VP + FP}
\]

Importante quando falso positivo é caro (ex.: bloqueio indevido).

3. **Revocação (Recall/Sensibilidade)**

\[
\text{Revocação} = \frac{VP}{VP + FN}
\]

Importante quando falso negativo é caro (ex.: doença não detectada).

4. **F1-score**

\[
\text{F1} = 2 \times \frac{\text{Precisão} \times \text{Revocação}}{\text{Precisão} + \text{Revocação}}
\]

Útil quando há desequilíbrio de classes e queremos equilíbrio entre precisão e revocação.

### Outras métricas úteis

- **Acurácia balanceada**: média do recall por classe; útil com desbalanceamento.
- **ROC-AUC**: qualidade da ordenação de scores em diferentes limiares.
- **PR-AUC**: geralmente mais informativa que ROC-AUC em classes muito raras.

### Exemplo em Python (métricas)

```python
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    confusion_matrix,
    classification_report,
)

print(f"Acurácia: {accuracy_score(y_test, y_pred):.3f}")
print(f"Balanced accuracy: {balanced_accuracy_score(y_test, y_pred):.3f}")

print("\nMatriz de confusão:")
print(confusion_matrix(y_test, y_pred))

print("\nRelatório de classificação:")
print(classification_report(y_test, y_pred, digits=3))
```

> Em problemas multiclasse, observe os agregados **macro avg** (peso igual por classe) e **weighted avg** (ponderado pelo suporte de cada classe).

---

## Simuladores interativos

### KNN

---

<div id="knn-widget" style="max-width:980px;margin:1.25rem 0;padding:1rem;border:1px solid var(--md-default-fg-color--lightest,#e0e0e0);border-radius:14px;background:var(--md-default-bg-color,#fff)">
  <h3 style="margin:0 0 .5rem 0">Classificação KNN — ajuste <em>k</em> e explore a fronteira de decisão</h3>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end">
    <label style="flex:1 1 260px">
      <div><code>k</code>: <strong><span id="kVal">5</span></strong> (ímpares recomendados)</div>
      <input id="k" type="range" min="1" max="31" step="1" value="5" style="width:100%">
    </label>

    <label style="flex:1 1 260px">
      <div>ruído (dispersão): <strong><span id="noiseVal">1.40</span></strong></div>
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
      <button id="btnRegen" class="md-button md-button--primary" style="white-space:nowrap">Regenerar dataset</button>
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

### Regressão logística

--- 


<div id="logreg-widget" style="max-width:980px;margin:1.25rem 0;padding:1rem;border:1px solid var(--md-default-fg-color--lightest,#e0e0e0);border-radius:14px;background:var(--md-default-bg-color,#fff)">
  <h3 style="margin:0 0 .5rem 0">Classificação — Regressão Logística</h3>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end">
    <label style="flex:1 1 220px">
      <div>w₁: <strong><span id="w1Val">0.00</span></strong></div>
      <input id="w1" type="range" min="-10" max="10" step="0.01" value="0.00" style="width:100%">
    </label>
    <label style="flex:1 1 220px">
      <div>w₂: <strong><span id="w2Val">-10.00</span></strong></div>
      <input id="w2" type="range" min="-10" max="10" step="0.01" value="-10.00" style="width:100%">
    </label>
    <label style="flex:1 1 220px">
      <div>b: <strong><span id="bVal">20.00</span></strong></div>
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

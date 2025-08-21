# Regressão em Machine Learning

## O que é Regressão?

A **regressão** é uma técnica de aprendizado supervisionado que visa **predizer valores contínuos** (numéricos) com base em variáveis de entrada (features).

**Classificação vs Regressão**

| Aspecto | Classificação | Regressão |
|---------|---------------|-----------|
| **Saída** | Categórica/Discreta | Numérica/Contínua |
| **Exemplos** | Spam/Não-spam, Gato/Cachorro | Preço, Temperatura, Altura |
| **Métricas** | Acurácia, Precisão, Recall | MAE, MSE, RMSE, R² |
| **Algoritmos** | KNN, SVM, Random Forest | Linear, Polinomial, Ridge/Lasso, SVR, Árvores/Boosting |

## Matemática por trás da Regressão

A regressão busca encontrar uma função que melhor relacione as variáveis independentes (X) com a variável dependente (y):

```
y = f(X) + ε
```

Onde:

- **y**: variável dependente (target)
- **X**: variáveis independentes (features)
- **f(X)**: função que queremos aprender
- **ε**: erro aleatório


## Famílias de modelos

### 1. Regressão Linear Simples
- **Uma variável independente**
- Relação linear entre X e y
- Equação: `y = β₀ + β₁x + ε`

### 2. Regressão Linear Múltipla
- **Múltiplas variáveis independentes**
- Equação: `y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε`

### 3. Regressão Polinomial
- **Relações não-lineares**
- Equação: `y = β₀ + β₁x + β₂x² + ... + βₙxⁿ + ε`

### 4. Regressão Regularizada
- **Ridge (L2)**: penaliza coeficientes grandes,ou seja, encolhe coeficientes (estabilidade com multicolinearidade).
- **Lasso (L1)**: pode zerar coeficientes (seleção de features).
- **Elastic Net (L1 + L2)**: combina Ridge e Lasso, equilíbrio entre sparsity e estabilidade.

!!! tip
    Dica: dados com muitas features correlacionadas → Ridge costuma ser mais estável; necessidade de seleção automática → Lasso; mistura → Elastic Net.


### 5. SVR (kernel): 
    - relações complexas, robusto com ε.

### 6. Árvores/Florestas/Boosting: 
    - lida bem com não linearidade e interações sem engenharia pesada, menos interpretável.


## Regressão Linear

A `regressão linear` busca encontrar a melhor reta que passa pelos dados, minimizando o erro entre os valores preditos e reais.

### Método dos Mínimos Quadrados

O objetivo é minimizar a **Soma dos Quadrados dos Resíduos (SSR)**:

```
SSR = Σ(yᵢ - ŷᵢ)²
```

#### Fórmulas dos Coeficientes

Para regressão linear simples:

```
β₁ = Σ((xᵢ - x̄)(yᵢ - ȳ)) / Σ((xᵢ - x̄)²)
β₀ = ȳ - β₁x̄
```

### Pressupostos da Regressão Linear

1. **Linearidade**: relação linear entre X e y
2. **Independência**: observações independentes
3. **Homocedasticidade**: variância constante dos resíduos
4. **Normalidade**: resíduos seguem distribuição normal
5. **Ausência de multicolinearidade**: features não correlacionadas

### Implementação em Python

```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import matplotlib.pyplot as plt


# Criando dados sintéticos
np.random.seed(42)
X = np.random.randn(100, 1)
y = 2 + 3 * X.ravel() + np.random.randn(100)

# Dividindo os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Criando e treinando o modelo
model = LinearRegression()
model.fit(X_train, y_train)

# Fazendo predições
y_pred = model.predict(X_test)

# Avaliando o modelo
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Coeficiente: {model.coef_[0]:.2f}")
print(f"Intercepto: {model.intercept_:.2f}")
print(f"MSE: {mse:.2f}")
print(f"R²: {r2:.2f}")
```



## Métricas de Avaliação

### Métricas Principais

#### 1. Erro Quadrático Médio (MSE)
```
MSE = (1/n) × Σ(yᵢ - ŷᵢ)²
```
- **Unidade**: quadrado da unidade do target
- **Penaliza**: erros grandes mais fortemente

#### 2. Raiz do Erro Quadrático Médio (RMSE)
```
RMSE = √MSE
```
- **Unidade**: mesma do target
- **Interpretação**: erro médio em termos absolutos

#### 3. Erro Absoluto Médio (MAE)
```
MAE = (1/n) × Σ|yᵢ - ŷᵢ|
```
- **Robustez**: menos sensível a outliers

#### 4. Coeficiente de Determinação (R²)
```
R² = 1 - (SSres/SStot)
```
- **Onde:**
  - \(SS_{res}=\sum_i (y_i-\hat y_i)^2\) — soma dos resíduos ao quadrado  
  - \(SS_{tot}=\sum_i (y_i-\bar y)^2\) — variância total em torno da média \(\bar y\)

- **Interpretação**: proporção da variância explicada

- **Faixa:**: quanto maior, melhor
  - **Geral (validação/teste):** \((-\infty,\,1]\) — pode ser **negativo** se o modelo for pior que “prever a média”.
  - **Treino com OLS + intercepto:** \([0,1]\).

### Implementação em Python

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

# considerando que o modelo já treinado 

mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)
    
print(f"MSE: {mse:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"MAE: {mae:.4f}")
print(f"R²: {r2:.4f}")

```



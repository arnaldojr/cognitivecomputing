
# Regressão em Machine Learning

## O que é regressão?

A regressão é uma técnica de aprendizado supervisionado usada para prever valores numéricos contínuos a partir de variáveis de entrada (features). Em vez de atribuir classes, buscamos estimar quantidades — por exemplo, o preço de um imóvel ou a temperatura amanhã.

<?quiz?>
question: Qual é a principal diferença entre regressão e classificação?
answer: Regressão prediz categorias; Classificação prediz números
answer: Ambas só funcionam com dados categóricos
answer-correct: Regressão prediz números; Classificação prediz categorias
answer: Classificação é sempre não supervisionada
content:

Regressão estima valores numéricos contínuos (por exemplo, preço), enquanto classificação atribui uma categoria ou rótulo (por exemplo, spam ou não-spam).
<?/quiz?>

### Classificação vs Regressão

| Aspecto | Classificação | Regressão |
|---------|---------------|-----------|
| Saída | Categórica / Discreta | Numérica / Contínua |
| Exemplos | Spam / Sentimento / Tipo de flor | Preço / Temperatura / Altura |
| Métricas | Acurácia, Precisão, Recall | MAE, MSE, RMSE, R² |
| Exemplos de algoritmos | KNN, SVM, Random Forest (class.) | Regressão Linear, Ridge, Lasso, SVR, Árvores/Boosting |


## Ideia matemática

Procuramos uma função f que aproxime a relação entre entradas X e alvo y:

```
y = f(X) + ε
```

ε representa o ruído — sempre haverá alguma incerteza.

<?quiz?>
question: O que representa ε na equação y = f(X) + ε ?
answer: Um parâmetro do modelo
answer-correct: O ruído ou erro aleatório
answer: A variável de entrada
content:

ε simboliza o erro aleatório ou ruído que não é explicado pela função f(X); é a parte imprevisível dos dados.
<?/quiz?>


## Principais famílias de modelos

1. Regressão Linear Simples
- Uma variável explicativa; relação aproximadamente linear: `y = β₀ + β₁x + ε`.

2. Regressão Linear Múltipla
- Várias features: `y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε`.

3. Regressão Polinomial
- Quando a relação é não linear, aumentamos a base com potências de x: `y = β₀ + β₁x + β₂x² + ...`.

4. Regressão Regularizada
- Ridge (L2): penaliza coeficientes grandes — útil quando há multicolinearidade.
- Lasso (L1): pode zerar coeficientes — ajuda a selecionar features.
- Elastic Net: combinação L1 + L2.
!!! tip
    Dica: com muitas features correlacionadas, comece por Ridge; quando quiser seleção automática, experimente Lasso.

<?quiz?>
question: Qual método tende a zerar coeficientes, ajudando na seleção de features?
answer: Ridge
answer-correct: Lasso
answer: Regressão Polinomial
answer: SVR
content:

Lasso (L1) pode reduzir coeficientes a zero, realizando seleção de features; Ridge (L2) encolhe coeficientes sem zerá-los.
<?/quiz?>

5. SVR
- Bom para relações complexas quando precisamos de flexibilidade sem muitos features polinomiais.

6. Árvores, Florestas e Boosting
- Lidam bem com não linearidades e interações; geralmente exigem menos engenharia de features, mas são menos transparentes que modelos lineares.


## Intuição de Regressão Linear

A regressão linear procura a reta (ou hiperplano) que melhor explica a relação entre X e y, minimizando discrepâncias entre valores reais e previstos.

### Método dos Mínimos Quadrados

Minimizamos a soma dos quadrados dos resíduos:

```
SSR = Σ(yᵢ - ŷᵢ)²
```

Para regressão linear simples, os coeficientes têm fórmulas fechadas úteis para entendimento:

```
β₁ = Σ((xᵢ - x̄)(yᵢ - ȳ)) / Σ((xᵢ - x̄)²)
β₀ = ȳ - β₁x̄
```

### Pressupostos importantes

1. Linearidade entre X e y
2. Observações independentes
3. Homocedasticidade (resíduos com variância constante)
4. Resíduos aproximadamente normais
5. Pouca multicolinearidade entre as features


<?quiz?>
question: Qual pressuposto implica que os resíduos tenham variância constante?
answer: Linearidade
answer-correct: Homocedasticidade
answer: Normalidade
answer: Independência das observações
content:

Homocedasticidade significa que a variância dos resíduos é aproximadamente constante ao longo das predições; quando isso falha, temos heterocedasticidade.
<?/quiz?>

### Exemplo em Python

```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Dados sintéticos
np.random.seed(42)
X = np.random.randn(100, 1)
y = 2 + 3 * X.ravel() + np.random.randn(100)

# Treino / teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Treina
model = LinearRegression()
model.fit(X_train, y_train)

# Prediz
y_pred = model.predict(X_test)

# Avalia
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Coeficiente: {model.coef_[0]:.2f}")
print(f"Intercepto: {model.intercept_:.2f}")
print(f"MSE: {mse:.2f}")
print(f"R²: {r2:.2f}")
```


## Métricas de avaliação 

As métricas ajudam a comparar modelos e interpretar a magnitude dos erros.

### MSE (Erro Quadrático Médio)

```
MSE = (1/n) × Σ(yᵢ - ŷᵢ)²
```

Penaliza erros grandes (unidade: quadrado da unidade do target).

### RMSE (Raiz do MSE)

```
RMSE = √MSE
```

Tem a mesma unidade do target e é mais intuitiva que o MSE.

### MAE (Erro Absoluto Médio)

```
MAE = (1/n) × Σ|yᵢ - ŷᵢ|
```

Menos sensível a outliers que o MSE/RMSE.

### R² (Coeficiente de Determinação)

```
R² = 1 - (SSres / SStot)
```

Onde:
- SSres = Σ(yᵢ - ŷᵢ)²
- SStot = Σ(yᵢ - ȳ)²

R² indica a proporção da variância explicada pelo modelo. Valores mais altos são melhores, mas atenção: R² pode ser negativo se o modelo for pior que prever a média.


<?quiz?>
question: Qual métrica é menos sensível a outliers?
answer: MSE
answer: RMSE
answer-correct: MAE
answer: R²
content:

MAE (Erro Absoluto Médio) penaliza menos discrepâncias grandes que o MSE/RMSE, sendo mais robusto a outliers.
<?/quiz?>

### Exemplo em Python

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

# supondo, modelo já treinado e y_true e y_pred 
mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

print(f"MSE: {mse:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"MAE: {mae:.4f}")
print(f"R²: {r2:.4f}")
```

### datasets utilizados nos notebooks para download 

<a href="housing.csv" download>Baixar o arquivo housing.csv</a>

<a href="laptop_data.csv" download>Baixar o arquivo laptop_data.csv</a>
# Regressão em Machine Learning

Nesta aula, vamos estudar regressão com foco em prática profissional: formulação correta do problema, escolha de modelos, interpretação de métricas e cuidado com generalização.

### Atividades Práticas
As seguintes atividades foram preparadas para reforçar os conceitos abordados:

- **[Lab 1: Regressão Simples](regressao.ipynb)**  
  Introdução aos conceitos básicos de regressão, com aplicação prática na predição de preços de casas na Califórnia.
- **[Lab 2: Técnicas Avançadas](regressao2.ipynb)**  
  Exploração de métodos como regressão polinomial e XGBoost para modelagem mais robusta.
- **[Lab 3: Predição de Preços de Notebooks](preco-notebook.ipynb)**  
  Treinamento de um modelo para prever o valor de notebooks com base em suas características.

### Datasets
Os laboratórios utilizam os seguintes conjuntos de dados:
- **[Housing](housing.csv)**: Informações sobre casas na Califórnia, usado no Lab 1.
- **[Laptop Data](laptop_data.csv)**: Dados de notebooks, usado no Lab 3.


## O que é regressão?

Regressão é uma tarefa de aprendizado supervisionado em que o alvo é um valor numérico contínuo. Em vez de prever classes, estimamos quantidades, como preço de imóvel, consumo de energia ou temperatura.


### Classificação vs Regressão

| Aspecto | Classificação | Regressão |
|---------|---------------|-----------|
| Saída | Categórica / Discreta | Numérica / Contínua |
| Exemplos | Spam / Sentimento / Tipo de flor | Preço / Temperatura / Altura |
| Métricas | Acurácia, Precisão, Recall | MAE, MSE, RMSE, R² |
| Exemplos de algoritmos | KNN, SVM, Random Forest (class.) | Regressão Linear, Ridge, Lasso, SVR, Árvores/Boosting |


<quiz>
Qual é a principal diferença entre regressão e classificação?
- [ ] Regressão prediz categorias; Classificação prediz números
- [ ] Ambas só funcionam com dados categóricos
- [x] Regressão prediz números; Classificação prediz categorias
- [ ] Classificação é sempre não supervisionada

Regressão estima valores numéricos contínuos (por exemplo, preço), enquanto classificação atribui uma categoria ou rótulo (por exemplo, spam ou não-spam).
</quiz>

## Ideia matemática

Procuramos uma função f que aproxime a relação entre entradas X e alvo y:

```
y = f(X) + ε
```

ε representa o ruído — sempre haverá alguma incerteza.

Em regressão linear, uma forma comum é:

```
y = β₀ + β₁x₁ + ... + βₚxₚ + ε
```

Onde β são parâmetros estimados a partir dos dados.

<quiz>
O que representa ε na equação y = f(X) + ε ?
- [ ] Um parâmetro do modelo
- [x] O ruído ou erro aleatório
- [ ] A variável de entrada

ε simboliza o erro aleatório ou ruído que não é explicado pela função f(X); é a parte imprevisível dos dados.
</quiz>


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

5. SVR (Support Vector Regression)
    - Ideal para datasets pequenos/médios com relações não lineares, usando kernels (como RBF) para capturar padrões complexos sem necessidade de features polinomiais.
6. Árvores, Florestas e Boosting
    - Modelos como Random Forest e XGBoost são poderosos para capturar não linearidades e interações entre features. São menos sensíveis a outliers e requerem menos pré-processamento, mas podem ser mais difíceis de interpretar.

### Quando usar cada família (regra prática)

- Comece por **Regressão Linear/Ridge/Lasso** quando interpretabilidade for importante.
- Use **árvores/boosting** para relações não lineares e interação forte entre variáveis.
- Teste **SVR** em bases menores com boa engenharia de atributos e escala adequada.


<quiz>
Qual método tende a zerar coeficientes, ajudando na seleção de features?
- [ ] Ridge
- [x] Lasso
- [ ] Regressão Polinomial
- [ ] SVR

Lasso (L1) pode reduzir coeficientes a zero, realizando seleção de features; Ridge (L2) encolhe coeficientes sem zerá-los.
</quiz>

## Intuição de Regressão Linear

A regressão linear procura a reta (ou hiperplano) que melhor explica a relação entre X e y, minimizando discrepâncias entre valores reais e previstos.

### Método dos Mínimos Quadrados (OLS)

No OLS, minimizamos a soma dos quadrados dos resíduos:

```
SSE = Σ(yᵢ - ŷᵢ)²
```

Para regressão linear simples, os coeficientes têm fórmulas fechadas úteis para entendimento:

```
β₁ = Σ((xᵢ - x̄)(yᵢ - ȳ)) / Σ((xᵢ - x̄)²)
β₀ = ȳ - β₁x̄
```

### Intuição de Pressupostos Importantes
- **Linearidade**: A relação entre X e y deve parecer uma reta (ou um plano em múltiplas dimensões). Se os dados formam uma curva, regressão linear pode não funcionar bem.
- **Independência**: Cada observação (por exemplo, preço de uma casa) não deve ser influenciada por outra.
- **Homocedasticidade**: Os erros do modelo (diferença entre valores reais e previstos) devem ter variação constante. Imagine que os pontos estão igualmente espalhados ao redor da reta de regressão.
- **Normalidade dos resíduos**: Os erros devem seguir uma distribuição normal (isso é mais importante para testes estatísticos).
- **Baixa multicolinearidade**: As features não devem ser muito correlacionadas entre si (e.g., se "área da casa" e "número de quartos" são quase idênticas, isso pode confundir o modelo).

> Observação importante: esses pressupostos são especialmente relevantes para inferência estatística e interpretação de coeficientes. Para previsão pura, modelos mais flexíveis podem performar melhor mesmo com violações.


<quiz>
Qual pressuposto implica que os resíduos tenham variância constante?
- [ ] Linearidade
- [x] Homocedasticidade
- [ ] Normalidade
- [ ] Independência das observações

Homocedasticidade significa que a variância dos resíduos é aproximadamente constante ao longo das predições; quando isso falha, temos heterocedasticidade.
</quiz>

### Exemplo em Python (com baseline técnico)

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# Dados sintéticos
np.random.seed(42)
X = np.random.randn(100, 1)
y = 2 + 3 * X.ravel() + np.random.randn(100)

# Treino / teste
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Treina
model = Pipeline([
    ("scaler", StandardScaler()),
    ("reg", LinearRegression()),
])
model.fit(X_train, y_train)

# Prediz
y_pred = model.predict(X_test)

# Avalia
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"MAE: {mae:.3f}")
print(f"RMSE: {rmse:.3f}")
print(f"R²: {r2:.3f}")
```

Para visualizar o resultado:

```python
import matplotlib.pyplot as plt

# Plot dos dados e da reta de regressão
plt.scatter(X_test, y_test, color='blue', label='Dados reais')

# Ordena no eixo x para desenhar a reta corretamente
idx = np.argsort(X_test[:, 0])
plt.plot(X_test[idx], y_pred[idx], color='red', label='Reta de regressão')
plt.xlabel('X')
plt.ylabel('y')
plt.title('Regressão Linear Simples')
plt.legend()
plt.show()
```

![Exemplo de regressão linear](image.png)

## Métricas de avaliação 

As métricas ajudam a comparar modelos e interpretar a magnitude dos erros. Em regressão, é recomendável olhar mais de uma métrica ao mesmo tempo.

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

### Métricas complementares úteis

- **MedAE (mediana do erro absoluto)**: robusta a outliers severos.
- **MAPE**: útil em negócios, mas problemático quando `y` pode ser zero ou muito próximo de zero.



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

## Erros comuns em regressão (e como evitar)

- **Vazamento de dados**: ajustar scaler/encoder com base em treino + teste.
- **Avaliar só no treino**: sempre medir desempenho em dados não vistos.
- **Escolher modelo só por R²**: combine com MAE/RMSE e análise de resíduos.
- **Ignorar baseline**: compare com preditor simples (média/mediana) antes de celebrar desempenho.

<quiz>
Qual métrica é menos sensível a outliers?
- [ ] MSE
- [ ] RMSE
- [x] MAE
- [ ] R²

MAE (Erro Absoluto Médio) penaliza menos discrepâncias grandes que o MSE/RMSE, sendo mais robusto a outliers.
</quiz>



<!-- Exercício: Ajuste de Parâmetros (Linear Regression) -->
<div id="linreg-widget" style="max-width:980px;margin:1.25rem 0;padding:1rem;border:1px solid var(--md-default-fg-color--lightest,#e0e0e0);border-radius:14px;background:var(--md-default-bg-color,#fff)">
  <h3 style="margin:0 0 .5rem 0">Ajuste w (peso) e b (viés) para minimizar o MSE</h3>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end">
    <label style="flex:1 1 260px">
      <div>peso <code>w</code>: <strong><span id="wVal">-6.50</span></strong></div>
      <input id="w" type="range" min="-8" max="2" step="0.01" value="-6.5" style="width:100%">
    </label>

    <label style="flex:1 1 260px">
      <div>viés <code>b</code>: <strong><span id="bVal">46.00</span></strong></div>
      <input id="b" type="range" min="-10" max="60" step="0.01" value="46.0" style="width:100%">
    </label>

    <div style="flex:1 1 220px;line-height:1.6">
      <div><strong>MSE</strong>: <span id="mse">—</span></div>
      <div>Equação: <code id="eqn">y = w·x + b</code></div>
      <label style="display:flex;gap:.5rem;align-items:center;margin-top:.25rem;font-size:.95em">
        <input id="resid" type="checkbox"> Mostrar resíduos
      </label>
    </div>

    <div style="flex:1 1 220px;display:flex;gap:.5rem;justify-content:flex-end">
      <button id="btnFit" class="md-button md-button--primary" style="white-space:nowrap">Auto-ajustar (OLS)</button>
      <button id="btnReset" class="md-button" style="white-space:nowrap">Reset</button>
    </div>
  </div>

  <div style="position:relative;margin-top:.75rem">
    <!-- width/height lógicos; JS ajusta para retina -->
    <canvas id="plot" width="920" height="440" style="width:100%;display:block;background:#fff;border-radius:10px"></canvas>
    <div style="position:absolute;left:8px;bottom:8px;color:#666;font-size:.85em">x: peso (milhares de lbs) • y: mpg</div>
  </div>

  <details style="margin-top:.75rem">
    <summary><strong>Como funciona</strong></summary>
    <p style="margin:.5rem 0 0 0">
      Dados fixos (x,y). A reta <code>y = w·x + b</code> é desenhada. O erro é
      <code>MSE = (1/n) Σ (y − (w·x+b))²</code>. Ajuste os sliders para reduzir o MSE ou use <em>Auto-ajustar (OLS)</em>.
    </p>
  </details>
</div>

# Classificação em Machine Learning

## Objetivos de aprendizagem

- Entender tipos de problemas de classificação (binária, multiclasses, multilabel).
- Conhecer métricas apropriadas e interpretar confusão/confidências.
- Montar pipelines reprodutíveis com pré-processamento, validação e busca de hiperparâmetros.
- Tratar desequilíbrio de classes, evitar vazamento de dados e aplicar calibração.
- Usar técnicas de interpretação (coeficientes, odds ratios, importância, SHAP).


### Atividades Práticas
As seguintes atividades foram preparadas para reforçar os conceitos abordados:

<!-- - **[Lab 1: Regressão Simples](regressao.ipynb)**  
  Introdução aos conceitos básicos de regressão, com aplicação prática na predição de preços de casas na Califórnia.
- **[Lab 2: Técnicas Avançadas](regressao2.ipynb)**  
  Exploração de métodos como regressão polinomial e XGBoost para modelagem mais robusta.
- **[Lab 3: Predição de Preços de Notebooks](laptop_data.csv)**  
  Treinamento de um modelo para prever o valor de notebooks com base em suas características. -->

### Datasets
Os laboratórios utilizam os seguintes conjuntos de dados:
<!-- - **[Housing](housing.csv)**: Informações sobre casas na Califórnia, usado no Lab 1.
- **[Laptop Data](laptop_data.csv)**: Dados de notebooks, usado no Lab 3. -->




## 1. Tipos de problemas

- Binária: dois rótulos (0/1). Ex.: detecção de fraude.
- Multiclasse: mais de duas classes mutuamente exclusivas. Ex.: classificação de espécies.
- Multilabel: cada exemplo pode ter múltiplos rótulos simultâneos. Ex.: tags em artigos.

<?quiz?>
question: Qual tipo de problema permite múltiplos rótulos por exemplo?
answer: Binária
answer: Multiclasse
answer-correct: Multilabel
answer: Regressão
content:

Multilabel permite que um mesmo exemplo pertença a várias classes ao mesmo tempo (por exemplo, um artigo pode ser "ciência" e "educação").
<?/quiz?>


## 2. Representação do problema: probabilística vs determinística

- Modelos probabilísticos retornam P(y|x) (ex.: LogisticRegression, Naive Bayes).
- Modelos determinísticos entregam um rótulo diretamente (ex.: alguns trees sem probabilidade bem calibrada).

Probabilidades permitem ajustar limiares e tomar decisões custo-sensitivas.

<?quiz?>
question: Por que probabilidades preditas são úteis em vez de rótulos diretos?
answer: Porque são mais rápidas de computar
answer-correct: Porque permitem ajustar limiares e tomar decisões custo-sensitivas
answer: Porque evitam overfitting
answer: Porque convertem modelos em regressão
content:

Probabilidades possibilitam escolher thresholds diferentes para otimizar precisão, recall ou custo esperado; também são essenciais para calibração.
<?/quiz?>


## 3. Métricas e interpretação da matriz de confusão

Confusion matrix (binária):

- True Positive (TP)
- False Positive (FP)
- True Negative (TN)
- False Negative (FN)

Deixando claro:

- Acurácia = (TP + TN) / total
- Precisão = TP / (TP + FP)
- Recall (sensibilidade) = TP / (TP + FN)
- Especificidade = TN / (TN + FP)

F1 = 2 * (precisão * recall) / (precisão + recall) — útil com classes desbalanceadas.

ROC e AUC: curva entre True Positive Rate vs False Positive Rate para vários thresholds.

Precision-Recall curve: mais informativa quando as classes são desbalanceadas.

Log loss (cross-entropy): penaliza previsões probabilísticas erradas — útil para modelos calibrados.

<?quiz?>
question: Em cenário com classes muito desbalanceadas, qual curva tende a ser mais informativa?
answer: ROC
answer-correct: Precision-Recall
answer: Curva de calibração
answer: Curva de aprendizagem
content:

Quando a classe positiva é rara, PRC destaca o trade-off entre precisão e recall sem ser influenciada pelo grande número de verdadeiros negativos.
<?/quiz?>


## 4. Pré-processamento e engenharia de features

- Escalonamento: padronizar ou normalizar é importante para KNN, SVM, regressão logística com regularização.
- Codificação categórica: One-Hot, Ordinal, Target Encoding (com cuidado para evitar vazamento).
- Dados faltantes: imputação (median, mean, model-based).
- Extração de features: interações, polinômios (com parcimônia), embeddings para texto/categóricos.

Boas práticas:

- Encapsular transformações em um Pipeline — evita vazamento de informação.
- Aplicar transformação apenas no conjunto de treino durante validação cruzada.

<?quiz?>
question: Por que usar `Pipeline` do scikit-learn?
answer: Para treinar múltiplos modelos sequenciais
answer-correct: Para encapsular pré-processamento e estimador evitando vazamento durante validação
answer: Para paralelizar o treinamento em GPU
answer: Para converter regressão em classificação
content:

Pipeline garante que as transformações (fit/transform) sejam aplicadas corretamente apenas com dados de treino em cada fold, mantendo reprodutibilidade.
<?/quiz?>


## 5. Estratégias de validação

- Holdout simples: rápido, mas variável.
- Stratified K-Fold: preserva proporção das classes em cada fold — padrão para classificação.
- GroupKFold: quando há dependências por grupo (ex.: pacientes).
- Nested CV: para estimates de generalização honestos ao ajustar hiperparâmetros.

Exemplo rápido: StratifiedKFold para comparação entre modelos.


## 6. Desequilíbrio de classes

Problema comum em detecção de anomalias, fraude, medicina.

Abordagens:

- Alterar métrica (usar F1, PR AUC)
- Penalização/weights no treino (class_weight) — simples e eficaz
- Reamostragem: oversampling (SMOTE), undersampling, combinação
- Algoritmos especializados: anomaly detection, one-class SVM

<?quiz?>
question: O que o SMOTE faz?
answer: Remove amostras da classe majoritária
answer-correct: Gera novas amostras sintéticas da classe minoritária
answer: Ajusta pesos de classe automaticamente
answer: Aplica regularização L1 nas features
content:

SMOTE cria novos pontos sintéticos interpolando entre exemplos minoritários — ajuda a fornecer mais variedade para o modelo aprender.
<?/quiz?>


## 7. Modelos e regularização

- Regressão Logística: linear, probabilística, interpretável; regularização L2 (por padrão) ou L1 para seleção de features.
- SVM: margens ótimas; escolha de kernel permite separar dados não lineares; sensível à escala e custo computacional.
- Árvores/Ensembles: RandomForest, GradientBoosting — robustos, pouco pré-processamento, poderosos em tabulares.

Regularização controla complexidade e previne overfitting. L1 promove sparsity; L2 encolhe coeficientes.


## 8. Calibração de probabilidades

Nem todo modelo produz probabilidades bem calibradas. Técnicas:

- Platt scaling (sigmoide) — usa uma regressão logística nos scores do modelo.
- Isotonic regression — não paramétrico, precisa de mais dados.

Calibração é importante quando probabilidades são usadas em decisões custo-sensitivas.

<?quiz?>
question: Qual técnica de calibração é não-paramétrica?
answer: Platt scaling
answer-correct: Isotonic regression
answer: Regularização L2
answer: MinMax scaling
content:

Isotonic regression ajusta uma função monotônica não-paramétrica entre scores e probabilidades observadas; é flexível, mas requer dados.
<?/quiz?>


## 9. Estratégias de thresholding e custo

- Ajuste do limiar padrão (0.5) pode melhorar performance segundo custos reais.
- Em problemas com custos assimétricos (FP mais caro que FN), otimize uma métrica ponderada ou minimize custo esperado.


## 10. Multiclass: estratégias

- One-vs-Rest (OvR): treina um classificador por classe contra as demais.
- One-vs-One (OvO): treina classificador por par de classes.
- Classificadores nativos multiclasses: árvores, RandomForest, softmax em regressão logística multinomial.


## 11. Interpretação e explicabilidade

- Coeficientes e odds ratios (em modelos lineares) — cuidado com escala das features.
- Importâncias de features em árvores — olhar com parcimônia (bias para categóricos com muitas categorias).
- SHAP/LIME: explicações locais e globais; SHAP tem fundamento teórico (valores de Shapley) e é robusto.

<?quiz?>
question: Qual método gera explicações locais e tem base em teoria dos valores de Shapley?
answer: LIME
answer-correct: SHAP
answer: PCA
answer: t-SNE
content:

SHAP explica contribuição de cada feature para uma predição específica com base em jogos cooperativos (Shapley values).
<?/quiz?>


## 12. Pipelines reproduzíveis e hiperparametrização

Exemplo de Pipeline com busca por hiperparâmetros (GridSearchCV) e validação estratificada:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, GridSearchCV

pipe = Pipeline([
	('scaler', StandardScaler()),
	('clf', LogisticRegression(solver='saga', max_iter=2000))
])

param_grid = {
	'clf__C': [0.01, 0.1, 1, 10],
	'clf__penalty': ['l1', 'l2']
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
search = GridSearchCV(pipe, param_grid, scoring='f1', cv=cv, n_jobs=-1)
search.fit(X_train, y_train)
print(search.best_params_)
```

Use RandomizedSearchCV ou otimização bayesiana para espaços grandes.


## 13. Exemplo prático: comparação rápida (Logistic vs RandomForest)

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score

models = {
	'logreg': LogisticRegression(max_iter=2000, class_weight='balanced'),
	'rf': RandomForestClassifier(n_estimators=200, class_weight='balanced', n_jobs=-1)
}

for name, m in models.items():
	m.fit(X_train, y_train)
	probs = m.predict_proba(X_test)[:, 1]
	preds = m.predict(X_test)
	p, r, f, _ = precision_recall_fscore_support(y_test, preds, average='binary')
	auc = roc_auc_score(y_test, probs)
	print(name, f"P={p:.3f} R={r:.3f} F1={f:.3f} AUC={auc:.3f}")
```


## 14. Avoiding data leakage

- Nunca ajuste o scaler, encoder ou selecionador de features com dados que incluam o conjunto de teste.
- Faça toda transformação dentro do Pipeline ou dentro do loop de CV.


## 15. Deploy e monitoramento

- Monitorar drift de dados e performance (alertas quando métricas caírem).
- Registrar modelos, versões e datestamps (MLflow, DVC).
- Testes em produção: A/B testing, canary releases, thresholds de rollback.


## 16. Questões avançadas (leitura adicional)

- Aprendizado ativo (active learning) para reduzir rótulos necessários.
- Aprendizado custo-sensitivo e otimização direta de métricas não diferenciáveis.
- Métodos bayesianos para classificação e quantificação de incerteza.


## Exercícios práticos sugeridos

1. Implementar Pipeline com StratifiedKFold e GridSearch para LogisticRegression e RandomForest. Compare F1 e PR AUC.
2. Em um dataset desbalanceado, compare class_weight vs SMOTE vs combinação e relate tempo de treino e performance.
3. Calibrar probabilidades de um classificador (Platt e Isotonic) e comparar Brier score antes/depois.


## Quizzes (sumário)

<?quiz?>
question: Em problemas de classificação, qual é o objetivo principal?
answer: Estimar um valor numérico contínuo
answer-correct: Atribuir um rótulo ou categoria a cada exemplo
answer: Reduzir a dimensionalidade dos dados
answer: Gerar novas amostras sintéticas
content:

Classificação mapeia entradas para classes discretas; regressão mapeia para valores contínuos.
<?/quiz?>

<?quiz?>
question: Em validação cruzada para classificação, qual técnica preserva a proporção das classes em cada fold?
answer: KFold simples
answer-correct: StratifiedKFold
answer: LeaveOneOut
answer: TimeSeriesSplit
content:

StratifiedKFold garante que cada fold mantenha a proporção de classes observada no conjunto completo.
<?/quiz?>

<?quiz?>
question: O que significa calibrar um modelo de classificação?
answer: Ajustar o hiperparâmetro C na regressão logística
answer: Remover features com baixa importância
answer-correct: Ajustar as probabilidades preditas para que representem verdadeiras frequências
answer: Aumentar o número de árvores na floresta
content:

Calibração transforma scores do modelo em probabilidades que correspondam às frequências observadas (p.ex., 0.8 significa ~80% de chance).
<?/quiz?>

<?quiz?>
question: O que é Nested Cross-Validation usado para?
answer: Acelerar o treinamento de modelos
answer-correct: Obter estimativas de generalização honestas ao ajustar hiperparâmetros
answer: Calcular probabilidades calibradas
answer: Balancear classes automaticamente
content:

Nested CV envolve uma CV externa para avaliação e uma CV interna para busca de hiperparâmetros, evitando viés de otimização.
<?/quiz?>

<?quiz?>
question: Qual métrica é mais indicada quando você tem custo alto para falsos positivos e quer controlar a proporção de previsões positivas corretas?
answer: Recall
answer-correct: Precisão
answer: Acurácia
answer: ROC AUC
content:

Precisão (precision) mede a proporção das previsões positivas que são corretas — útil quando FP são caros.
<?/quiz?>



# Análise Exploratória de Dados (EDA)

## Introdução

A **Análise Exploratória de Dados (EDA - Exploratory Data Analysis)** é um processo crítico em ciência de dados que envolve a investigação sistemática de conjuntos de dados para descobrir padrões, detectar anomalias, testar hipóteses e verificar suposições através de estatísticas descritivas e representações gráficas.

> "Far better an approximate answer to the right question, which is often vague, than an exact answer to the wrong question, which can always be made precise." - John Tukey

## Objetivos da EDA

### 1. Compreensão dos Dados
- Entender a estrutura e características dos dados
- Identificar tipos de variáveis (numéricas, categóricas, temporais)
- Verificar qualidade e integridade dos dados

### 2. Detecção de Padrões
- Identificar tendências, sazonalidades e ciclos
- Descobrir relacionamentos entre variáveis
- Encontrar grupos ou clusters naturais nos dados

### 3. Identificação de Anomalias
- Detectar outliers e valores atípicos
- Identificar inconsistências e erros nos dados
- Verificar distribuições incomuns

### 4. Formulação de Hipóteses
- Gerar questões de pesquisa baseadas nos dados
- Definir direções para análises mais profundas
- Validar ou refutar suposições iniciais

## Etapas da EDA

### Fase 1: Conhecimento Inicial dos Dados

#### Visão Geral
```python
import pandas as pd
import numpy as np

# Carregar dados
df = pd.read_csv('dataset.csv')

# Informações básicas
print(f"Dimensões: {df.shape}")
print(f"Colunas: {list(df.columns)}")
print(f"Tipos de dados:\n{df.dtypes}")
print(f"Memória utilizada: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
```

#### Primeiras Impressões
```python
# Primeiras e últimas linhas
print("Primeiras 5 linhas:")
print(df.head())

print("\nÚltimas 5 linhas:")
print(df.tail())

# Amostra aleatória
print("\nAmostra aleatória:")
print(df.sample(5))
```

### Fase 2: Análise da Qualidade dos Dados

#### Valores Ausentes
```python
# Análise de valores ausentes
missing_data = df.isnull().sum()
missing_percent = (missing_data / len(df)) * 100
missing_summary = pd.DataFrame({
    'Coluna': missing_data.index,
    'Valores_Ausentes': missing_data.values,
    'Porcentagem': missing_percent.values
}).sort_values('Porcentagem', ascending=False)

print(missing_summary[missing_summary['Valores_Ausentes'] > 0])
```

#### Duplicatas e Inconsistências
```python
# Verificar duplicatas
print(f"Linhas duplicadas: {df.duplicated().sum()}")

# Verificar inconsistências em dados categóricos
for col in df.select_dtypes(include=['object']).columns:
    unique_values = df[col].unique()
    print(f"\n{col}: {len(unique_values)} valores únicos")
    if len(unique_values) < 20:  # Mostrar apenas se poucos valores
        print(f"Valores: {unique_values}")
```

#### Outliers Univariados
```python
def detect_outliers_iqr(df, column):
    """Detecta outliers usando método IQR"""
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    return outliers, lower_bound, upper_bound

# Aplicar para colunas numéricas
numeric_columns = df.select_dtypes(include=[np.number]).columns
for col in numeric_columns:
    outliers, lower, upper = detect_outliers_iqr(df, col)
    print(f"{col}: {len(outliers)} outliers ({len(outliers)/len(df)*100:.2f}%)")
```

### Fase 3: Análise Univariada

#### Variáveis Numéricas
```python
# Estatísticas descritivas detalhadas
desc_stats = df.describe(include='all').T
desc_stats['missing'] = df.isnull().sum()
desc_stats['missing_pct'] = (desc_stats['missing'] / len(df)) * 100
print(desc_stats)

# Estatísticas adicionais
for col in numeric_columns:
    data = df[col].dropna()
    print(f"\n{col}:")
    print(f"  Assimetria (Skewness): {data.skew():.3f}")
    print(f"  Curtose (Kurtosis): {data.kurtosis():.3f}")
    print(f"  Coeficiente de Variação: {(data.std() / data.mean()):.3f}")
```

#### Variáveis Categóricas
```python
# Análise de frequências
categorical_columns = df.select_dtypes(include=['object', 'category']).columns

for col in categorical_columns:
    print(f"\n=== {col} ===")
    freq_table = df[col].value_counts()
    freq_percent = df[col].value_counts(normalize=True) * 100
    
    freq_summary = pd.DataFrame({
        'Frequência': freq_table,
        'Porcentagem': freq_percent
    })
    print(freq_summary.head(10))
    
    # Verificar cardinalidade
    cardinality = df[col].nunique()
    print(f"Cardinalidade: {cardinality}")
    if cardinality > 50:
        print("⚠️ Alta cardinalidade - considere agrupamento")
```

### Fase 4: Análise Bivariada

#### Correlações
```python
import matplotlib.pyplot as plt
import seaborn as sns

# Matriz de correlação
correlation_matrix = df[numeric_columns].corr()

# Identificar correlações fortes
def find_strong_correlations(corr_matrix, threshold=0.7):
    """Encontra pares de variáveis com correlação forte"""
    strong_corr = []
    for i in range(len(corr_matrix.columns)):
        for j in range(i+1, len(corr_matrix.columns)):
            corr_value = abs(corr_matrix.iloc[i, j])
            if corr_value > threshold:
                strong_corr.append({
                    'var1': corr_matrix.columns[i],
                    'var2': corr_matrix.columns[j],
                    'correlation': corr_matrix.iloc[i, j]
                })
    return pd.DataFrame(strong_corr).sort_values('correlation', key=abs, ascending=False)

strong_correlations = find_strong_correlations(correlation_matrix)
print("Correlações fortes (|r| > 0.7):")
print(strong_correlations)
```

#### Análise por Grupos
```python
# Se houver variável target categórica
if 'target' in df.columns:
    target_col = 'target'
    
    # Estatísticas por grupo
    for col in numeric_columns:
        if col != target_col:
            group_stats = df.groupby(target_col)[col].describe()
            print(f"\n{col} por {target_col}:")
            print(group_stats)
            
    # Teste estatístico (exemplo: ANOVA)
    from scipy import stats
    
    for col in numeric_columns:
        if col != target_col:
            groups = [group[col].dropna() for name, group in df.groupby(target_col)]
            if len(groups) > 1:
                f_stat, p_value = stats.f_oneway(*groups)
                print(f"\n{col} - ANOVA: F={f_stat:.3f}, p={p_value:.3f}")
```

### Fase 5: Análise Multivariada

#### Análise de Componentes Principais (PCA)
```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Preparar dados para PCA
numeric_data = df[numeric_columns].dropna()
scaler = StandardScaler()
scaled_data = scaler.fit_transform(numeric_data)

# Aplicar PCA
pca = PCA()
pca_result = pca.fit_transform(scaled_data)

# Variância explicada
explained_variance = pca.explained_variance_ratio_
cumulative_variance = np.cumsum(explained_variance)

print("Variância explicada por componente:")
for i, (individual, cumulative) in enumerate(zip(explained_variance, cumulative_variance)):
    print(f"PC{i+1}: {individual:.3f} (Cumulativa: {cumulative:.3f})")

# Número de componentes para 90% da variância
n_components_90 = np.argmax(cumulative_variance >= 0.9) + 1
print(f"\nComponentes necessários para 90% da variância: {n_components_90}")
```

## Padrões Comuns e Red Flags

### Distribuições Problemáticas

#### Alta Assimetria
```python
def analyze_skewness(df, threshold=2):
    """Analisa assimetria das variáveis numéricas"""
    skewed_features = []
    for col in df.select_dtypes(include=[np.number]).columns:
        skew_value = df[col].skew()
        if abs(skew_value) > threshold:
            skewed_features.append({
                'feature': col,
                'skewness': skew_value,
                'interpretation': 'Positiva' if skew_value > 0 else 'Negativa'
            })
    return pd.DataFrame(skewed_features)

skewed_analysis = analyze_skewness(df)
print("Variáveis com alta assimetria:")
print(skewed_analysis)
```

#### Transformações Sugeridas
```python
# Sugestões de transformação baseadas na assimetria
def suggest_transformations(skewness):
    """Sugere transformações baseadas na assimetria"""
    abs_skew = abs(skewness)
    if abs_skew < 0.5:
        return "Normal - sem transformação necessária"
    elif abs_skew < 1:
        return "Ligeiramente assimétrica - considere sqrt ou log"
    elif abs_skew < 2:
        return "Moderadamente assimétrica - use log ou Box-Cox"
    else:
        return "Altamente assimétrica - use log, Box-Cox ou Yeo-Johnson"

for _, row in skewed_analysis.iterrows():
    suggestion = suggest_transformations(row['skewness'])
    print(f"{row['feature']}: {suggestion}")
```

### Detecção de Padrões Temporais

```python
# Se houver coluna de data
def analyze_temporal_patterns(df, date_col, value_col):
    """Analisa padrões temporais nos dados"""
    df_temp = df.copy()
    df_temp[date_col] = pd.to_datetime(df_temp[date_col])
    df_temp = df_temp.sort_values(date_col)
    
    # Extrair componentes temporais
    df_temp['year'] = df_temp[date_col].dt.year
    df_temp['month'] = df_temp[date_col].dt.month
    df_temp['day_of_week'] = df_temp[date_col].dt.day_of_week
    df_temp['hour'] = df_temp[date_col].dt.hour
    
    # Análise por período
    patterns = {}
    patterns['yearly'] = df_temp.groupby('year')[value_col].mean()
    patterns['monthly'] = df_temp.groupby('month')[value_col].mean()
    patterns['weekly'] = df_temp.groupby('day_of_week')[value_col].mean()
    
    return patterns

# Exemplo de uso
# if 'date' in df.columns and 'sales' in df.columns:
#     temporal_patterns = analyze_temporal_patterns(df, 'date', 'sales')
```

## Checklist de EDA

### ✅ Checklist Básico

1. **Conhecimento dos Dados**
   - [ ] Dimensões do dataset
   - [ ] Tipos de variáveis
   - [ ] Primeiras observações

2. **Qualidade dos Dados**
   - [ ] Valores ausentes identificados
   - [ ] Duplicatas verificadas
   - [ ] Inconsistências analisadas
   - [ ] Outliers detectados

3. **Análise Univariada**
   - [ ] Estatísticas descritivas calculadas
   - [ ] Distribuições analisadas
   - [ ] Frequências de categorias verificadas

4. **Análise Bivariada**
   - [ ] Correlações calculadas
   - [ ] Relacionamentos principais identificados
   - [ ] Análise por grupos realizada

5. **Insights e Próximos Passos**
   - [ ] Padrões principais documentados
   - [ ] Hipóteses formuladas
   - [ ] Estratégias de tratamento definidas

### 🎯 Perguntas-Chave para Cada Etapa

#### Conhecimento Inicial
- Qual é o tamanho do dataset?
- Que tipos de variáveis temos?
- Os dados fazem sentido do ponto de vista do negócio?

#### Qualidade
- Há valores ausentes significativos?
- Existem inconsistências óbvias?
- Os outliers são erros ou casos extremos válidos?

#### Padrões
- Quais variáveis são mais importantes?
- Existem grupos naturais nos dados?
- Há relacionamentos não-lineares?

#### Ação
- Que transformações são necessárias?
- Quais variáveis podem ser removidas?
- Que análises adicionais são recomendadas?

## Ferramentas Automatizadas de EDA

### Pandas Profiling
```python
# pip install pandas-profiling
from pandas_profiling import ProfileReport

# Gerar relatório automático
profile = ProfileReport(df, title="EDA Automática", explorative=True)
profile.to_file("eda_report.html")
```

### Sweetviz
```python
# pip install sweetviz
import sweetviz as sv

# Análise completa
report = sv.analyze(df)
report.show_html("sweetviz_report.html")

# Comparação entre datasets
# report = sv.compare([df_train, "Treino"], [df_test, "Teste"])
```

### AutoViz
```python
# pip install autoviz
from autoviz.AutoViz_Class import AutoViz_Class

AV = AutoViz_Class()
dft = AV.AutoViz("dataset.csv")
```

## Documentação e Comunicação

### Template de Relatório EDA
```markdown
# Relatório de Análise Exploratória de Dados

## 1. Resumo Executivo
- Principais descobertas
- Recomendações imediatas
- Próximos passos

## 2. Visão Geral dos Dados
- Fonte e contexto
- Dimensões e estrutura
- Qualidade geral

## 3. Análise Detalhada
- Distribuições das variáveis
- Relacionamentos identificados
- Padrões e anomalias

## 4. Insights de Negócio
- Implicações práticas
- Oportunidades identificadas
- Riscos e limitações

## 5. Recomendações Técnicas
- Tratamentos necessários
- Variáveis para feature engineering
- Estratégias de modelagem
```

### Boas Práticas de Comunicação

1. **Use Visualizações Efetivas**
   - Escolha o gráfico certo para cada tipo de dado
   - Mantenha simplicidade e clareza
   - Adicione contexto e interpretação

2. **Conte uma História**
   - Organize insights de forma lógica
   - Conecte descobertas com objetivos de negócio
   - Use linguagem acessível ao público-alvo

3. **Seja Honesto sobre Limitações**
   - Mencione dados ausentes significativos
   - Identifique potenciais vieses
   - Sugira validações adicionais

A EDA é uma arte que combina técnica estatística, intuição de negócio e pensamento crítico. Quanto mais você pratica, mais eficiente se torna em extrair insights valiosos dos dados.

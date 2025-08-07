# Pandas: Manipulação e Análise de Dados em Python

## Introdução

O **Pandas** é uma biblioteca fundamental para ciência de dados em Python, fornecendo estruturas de dados de alto desempenho e ferramentas de análise de dados. É construído sobre NumPy e oferece estruturas de dados flexíveis para trabalhar com dados estruturados e heterogêneos.

## Principais Estruturas de Dados

### Series
Uma **Series** é uma estrutura de dados unidimensional que pode armazenar qualquer tipo de dados (inteiros, strings, floats, objetos Python, etc.).

```python
import pandas as pd
import numpy as np

# Criando uma Series
s = pd.Series([1, 3, 5, np.nan, 6, 8])
print(s)
```

### DataFrame
Um **DataFrame** é uma estrutura de dados bidimensional com eixos rotulados (linhas e colunas). É similar a uma planilha Excel ou tabela SQL.

```python
# Criando um DataFrame
data = {
    'Nome': ['Ana', 'Carlos', 'Maria', 'João'],
    'Idade': [25, 30, 35, 28],
    'Cidade': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador']
}
df = pd.DataFrame(data)
```

## Carregamento de Dados

### Principais Formatos Suportados

#### CSV (Comma Separated Values)
```python
# Carregando dados de um arquivo CSV
df = pd.read_csv('arquivo.csv')

# Com parâmetros personalizados
df = pd.read_csv('arquivo.csv', 
                 delimiter=';',           # Separador personalizado
                 header=0,               # Linha do cabeçalho
                 names=['col1', 'col2'], # Nomes das colunas
                 encoding='utf-8')       # Codificação
```

#### Outros Formatos
```python
# Excel
df = pd.read_excel('arquivo.xlsx', sheet_name='Planilha1')

# JSON
df = pd.read_json('arquivo.json')

# SQL
import sqlite3
conn = sqlite3.connect('database.db')
df = pd.read_sql_query("SELECT * FROM tabela", conn)

# URLs diretas
url = "https://example.com/data.csv"
df = pd.read_csv(url)
```

## Exploração Inicial dos Dados

### Informações Básicas
```python
# Primeiras linhas
df.head()          # 5 primeiras linhas (padrão)
df.head(10)        # 10 primeiras linhas

# Últimas linhas
df.tail()          # 5 últimas linhas

# Informações gerais do DataFrame
df.info()          # Tipos de dados, valores não-nulos, uso de memória

# Dimensões
df.shape           # (linhas, colunas)

# Nomes das colunas
df.columns         # Lista das colunas

# Tipos de dados
df.dtypes          # Tipo de cada coluna

# Índice
df.index           # Informações sobre o índice
```

### Estatísticas Descritivas
```python
# Resumo estatístico para colunas numéricas
df.describe()

# Incluindo colunas categóricas
df.describe(include='all')

# Estatísticas específicas
df.mean()          # Média
df.median()        # Mediana
df.std()           # Desvio padrão
df.var()           # Variância
df.min()           # Valor mínimo
df.max()           # Valor máximo
df.count()         # Contagem de valores não-nulos
```

## Seleção e Indexação de Dados

### Seleção de Colunas
```python
# Uma coluna (retorna Series)
df['nome_coluna']
df.nome_coluna     # Notação de atributo (se o nome for válido)

# Múltiplas colunas (retorna DataFrame)
df[['coluna1', 'coluna2']]

# Seleção por índice posicional
df.iloc[:, 0]      # Primeira coluna
df.iloc[:, 0:3]    # Primeiras três colunas
```

### Seleção de Linhas
```python
# Por índice posicional
df.iloc[0]         # Primeira linha
df.iloc[0:5]       # Primeiras 5 linhas
df.iloc[-1]        # Última linha

# Por rótulo do índice
df.loc[0]          # Linha com índice 0
df.loc[0:4]        # Linhas do índice 0 ao 4 (inclusivo)

# Por condição
df[df['idade'] > 25]                    # Linhas onde idade > 25
df[df['nome'].str.contains('Ana')]      # Linhas onde nome contém 'Ana'
df[(df['idade'] > 25) & (df['salario'] < 5000)]  # Múltiplas condições
```

### Seleção Combinada
```python
# loc[linhas, colunas]
df.loc[0:5, 'nome':'idade']           # Linhas 0-5, colunas 'nome' até 'idade'
df.loc[df['idade'] > 25, ['nome', 'salario']]  # Linhas filtradas, colunas específicas

# iloc[linhas, colunas]
df.iloc[0:5, 0:3]                     # Primeiras 5 linhas, 3 primeiras colunas
```

## Limpeza e Tratamento de Dados

### Valores Ausentes (Missing Values)
```python
# Identificar valores ausentes
df.isnull()        # DataFrame booleano
df.isnull().sum()  # Contagem por coluna
df.isna()          # Sinônimo de isnull()

# Verificar se há valores ausentes
df.isnull().any()  # True se há algum valor ausente por coluna
df.isnull().all()  # True se todos os valores são ausentes por coluna

# Remover valores ausentes
df.dropna()                    # Remove linhas com qualquer valor ausente
df.dropna(axis=1)             # Remove colunas com qualquer valor ausente
df.dropna(subset=['coluna'])   # Remove linhas com valores ausentes em 'coluna'
df.dropna(thresh=2)           # Manter linhas com pelo menos 2 valores não-nulos

# Preencher valores ausentes
df.fillna(0)                  # Preencher com 0
df.fillna(df.mean())          # Preencher com a média
df.fillna(method='ffill')     # Forward fill (propagar último valor válido)
df.fillna(method='bfill')     # Backward fill (propagar próximo valor válido)

# Preencher por coluna
df['coluna'].fillna(df['coluna'].mean(), inplace=True)
```

### Duplicatas
```python
# Identificar duplicatas
df.duplicated()              # Série booleana
df.duplicated().sum()        # Número de duplicatas

# Remover duplicatas
df.drop_duplicates()         # Remove duplicatas
df.drop_duplicates(subset=['coluna'])  # Baseado em colunas específicas
df.drop_duplicates(keep='first')       # Manter primeira ocorrência
df.drop_duplicates(keep='last')        # Manter última ocorrência
```

### Conversão de Tipos
```python
# Converter tipos de dados
df['coluna'] = df['coluna'].astype('float64')
df['coluna'] = df['coluna'].astype('category')
df['data'] = pd.to_datetime(df['data'])
df['numero'] = pd.to_numeric(df['numero'], errors='coerce')  # Erros viram NaN
```

## Transformação de Dados

### Criação de Novas Colunas
```python
# Operações aritméticas
df['nova_coluna'] = df['coluna1'] + df['coluna2']
df['area'] = df['comprimento'] * df['largura']

# Operações condicionais
df['categoria'] = df['idade'].apply(lambda x: 'Jovem' if x < 30 else 'Adulto')

# Usando np.where (mais eficiente para condições simples)
import numpy as np
df['categoria'] = np.where(df['idade'] < 30, 'Jovem', 'Adulto')

# Múltiplas condições
conditions = [
    df['idade'] < 18,
    (df['idade'] >= 18) & (df['idade'] < 60),
    df['idade'] >= 60
]
choices = ['Menor', 'Adulto', 'Idoso']
df['faixa_etaria'] = np.select(conditions, choices, default='Indefinido')
```

### Aplicação de Funções
```python
# apply() para aplicar funções
df['coluna_upper'] = df['coluna'].apply(str.upper)
df['coluna_transformada'] = df['coluna'].apply(lambda x: x * 2)

# map() para mapeamentos
mapeamento = {'A': 1, 'B': 2, 'C': 3}
df['nova_coluna'] = df['categoria'].map(mapeamento)

# transform() para transformações que mantêm o índice original
df['coluna_normalizada'] = df.groupby('grupo')['valor'].transform(lambda x: (x - x.mean()) / x.std())
```

### Manipulação de Strings
```python
# Acessar métodos de string com .str
df['nome'].str.upper()           # Maiúsculas
df['nome'].str.lower()           # Minúsculas
df['nome'].str.len()             # Comprimento
df['nome'].str.contains('Ana')   # Contém substring
df['nome'].str.startswith('A')   # Começa com
df['nome'].str.endswith('a')     # Termina com
df['nome'].str.replace('a', 'e') # Substituir caracteres

# Dividir strings
df['nome'].str.split(' ')        # Dividir por espaço
df[['primeiro_nome', 'sobrenome']] = df['nome'].str.split(' ', expand=True)
```

## Agrupamento e Agregação

### GroupBy Básico
```python
# Agrupar por uma coluna
grouped = df.groupby('categoria')

# Operações de agregação
grouped.mean()                   # Média por grupo
grouped.sum()                    # Soma por grupo
grouped.count()                  # Contagem por grupo
grouped.size()                   # Tamanho do grupo
grouped.std()                    # Desvio padrão por grupo

# Múltiplas agregações
grouped.agg({
    'valor': ['mean', 'sum', 'count'],
    'preco': ['min', 'max']
})
```

### Agrupamento Avançado
```python
# Agrupar por múltiplas colunas
df.groupby(['categoria', 'subcategoria']).mean()

# Aplicar função customizada
def custom_agg(x):
    return {
        'min': x.min(),
        'max': x.max(),
        'mean': x.mean(),
        'range': x.max() - x.min()
    }

grouped.apply(custom_agg)

# Filtrar grupos
grouped.filter(lambda x: len(x) > 5)  # Grupos com mais de 5 elementos
```

## Junção e Combinação de DataFrames

### Concatenação
```python
# Concatenar verticalmente (empilhar)
df_combined = pd.concat([df1, df2], axis=0)

# Concatenar horizontalmente (lado a lado)
df_combined = pd.concat([df1, df2], axis=1)

# Com chaves para identificar origem
df_combined = pd.concat([df1, df2], keys=['dados1', 'dados2'])
```

### Merge (Junções tipo SQL)
```python
# Inner join (padrão)
merged = pd.merge(df1, df2, on='chave')

# Left join
merged = pd.merge(df1, df2, on='chave', how='left')

# Right join
merged = pd.merge(df1, df2, on='chave', how='right')

# Outer join
merged = pd.merge(df1, df2, on='chave', how='outer')

# Merge com colunas de nomes diferentes
merged = pd.merge(df1, df2, left_on='id1', right_on='id2')

# Merge com múltiplas chaves
merged = pd.merge(df1, df2, on=['chave1', 'chave2'])
```

## Ordenação e Ranking

### Ordenação
```python
# Ordenar por uma coluna
df.sort_values('coluna')                    # Crescente
df.sort_values('coluna', ascending=False)   # Decrescente

# Ordenar por múltiplas colunas
df.sort_values(['coluna1', 'coluna2'], ascending=[True, False])

# Ordenar pelo índice
df.sort_index()
```

### Ranking
```python
# Criar ranking
df['rank'] = df['valor'].rank()                    # Ranking padrão
df['rank'] = df['valor'].rank(method='dense')      # Ranking denso
df['rank'] = df['valor'].rank(ascending=False)     # Ranking decrescente
```

## Reshaping de Dados

### Pivot
```python
# Pivot table
pivot_df = df.pivot_table(
    values='valor',
    index='categoria',
    columns='mes',
    aggfunc='mean'
)
```

### Melt (Wide to Long)
```python
# Transformar colunas em linhas
melted_df = pd.melt(
    df,
    id_vars=['id', 'nome'],
    value_vars=['jan', 'fev', 'mar'],
    var_name='mes',
    value_name='valor'
)
```

## Trabalhando com Datas

### Conversão e Criação
```python
# Converter para datetime
df['data'] = pd.to_datetime(df['data'])
df['data'] = pd.to_datetime(df['data'], format='%Y-%m-%d')

# Criar range de datas
dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')

# Extrair componentes de data
df['ano'] = df['data'].dt.year
df['mes'] = df['data'].dt.month
df['dia'] = df['data'].dt.day
df['dia_semana'] = df['data'].dt.day_name()
```

### Operações com Datas
```python
# Filtrar por período
df[df['data'] > '2023-01-01']
df[df['data'].between('2023-01-01', '2023-06-30')]

# Resample (agregação temporal)
df.set_index('data').resample('M').mean()  # Média mensal
df.set_index('data').resample('Q').sum()   # Soma trimestral
```

## Performance e Boas Práticas

### Otimização de Memória
```python
# Verificar uso de memória
df.memory_usage(deep=True)

# Otimizar tipos de dados
df['categoria'] = df['categoria'].astype('category')
df['inteiro'] = pd.to_numeric(df['inteiro'], downcast='integer')
df['float'] = pd.to_numeric(df['float'], downcast='float')
```

### Operações Vetorizadas
```python
# Evitar loops explícitos
# ❌ Ineficiente
for i in range(len(df)):
    df.loc[i, 'nova_coluna'] = df.loc[i, 'coluna1'] * 2

# ✅ Eficiente
df['nova_coluna'] = df['coluna1'] * 2
```

### Chaining de Operações
```python
# Encadear operações para código mais limpo
resultado = (df
             .dropna()
             .groupby('categoria')
             .agg({'valor': 'mean'})
             .reset_index()
             .sort_values('valor', ascending=False)
             .head(10))
```

## Dicas e Truques Avançados

### Configurações do Pandas
```python
# Configurações de exibição
pd.set_option('display.max_columns', None)     # Mostrar todas as colunas
pd.set_option('display.max_rows', 100)        # Mostrar até 100 linhas
pd.set_option('display.precision', 2)         # Precisão decimal
pd.set_option('display.float_format', '{:.2f}'.format)

# Resetar configurações
pd.reset_option('all')
```

### Operações Condicionais Avançadas
```python
# Query method (mais legível para filtros complexos)
df.query('idade > 25 and salario < 5000')
df.query('categoria in ["A", "B"]')

# Where com multiple conditions
df.where(df['valor'] > df['valor'].mean(), other=np.nan)
```

### Sampling
```python
# Amostragem aleatória
df.sample(n=100)              # 100 linhas aleatórias
df.sample(frac=0.1)           # 10% das linhas
df.sample(n=10, random_state=42)  # Amostra reproduzível
```

## Exercícios Práticos

1. **Carregamento e Exploração**:
   - Carregue um dataset CSV
   - Explore suas dimensões, tipos de dados e valores ausentes
   - Gere estatísticas descritivas

2. **Limpeza de Dados**:
   - Identifique e trate valores ausentes
   - Remova duplicatas
   - Converta tipos de dados quando necessário

3. **Transformação**:
   - Crie novas colunas baseadas em operações matemáticas
   - Aplique transformações condicionais
   - Normalize ou padronize valores numéricos

4. **Agrupamento e Análise**:
   - Agrupe dados por categorias
   - Calcule estatísticas por grupo
   - Identifique padrões e outliers

O Pandas é uma ferramenta poderosa que se torna mais intuitiva com a prática. Comece com operações simples e gradualmente incorpore técnicas mais avançadas conforme sua familiaridade com a biblioteca cresce.

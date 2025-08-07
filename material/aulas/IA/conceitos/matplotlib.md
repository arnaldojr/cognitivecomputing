# Matplotlib: Visualização de Dados em Python

## Introdução

**Matplotlib** é a biblioteca de visualização de dados mais fundamental em Python. É a base para muitas outras bibliotecas de plotagem (como Seaborn) e oferece controle completo sobre todos os aspectos de uma figura, desde elementos básicos até customizações avançadas.

## Arquitetura do Matplotlib

### Componentes Principais

```python
import matplotlib.pyplot as plt
import numpy as np

# Figura e Eixos - conceitos fundamentais
fig, ax = plt.subplots()  # Cria figura e eixo
ax.plot([1, 2, 3, 4], [1, 4, 9, 16])  # Plota no eixo
plt.show()  # Exibe a figura
```

#### Hierarquia de Objetos
- **Figure**: Container de nível mais alto
- **Axes**: Área de plotagem (eixos x, y)
- **Axis**: Eixos individuais (x ou y)
- **Artist**: Todos os elementos visuais

### Interfaces do Matplotlib

#### 1. Interface pyplot (MATLAB-style)
```python
import matplotlib.pyplot as plt

# Estilo MATLAB - mais simples para plots rápidos
plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
plt.title('Meu Primeiro Gráfico')
plt.xlabel('X')
plt.ylabel('Y')
plt.show()
```

#### 2. Interface Orientada a Objetos
```python
# Mais controle e flexibilidade
fig, ax = plt.subplots(figsize=(8, 6))
ax.plot([1, 2, 3, 4], [1, 4, 9, 16], marker='o')
ax.set_title('Gráfico com OO Interface')
ax.set_xlabel('X')
ax.set_ylabel('Y')
plt.show()
```

## Tipos de Gráficos

### Gráficos de Linha
```python
# Dados de exemplo
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Gráfico básico
plt.figure(figsize=(10, 6))
plt.plot(x, y1, label='sen(x)', color='blue', linewidth=2)
plt.plot(x, y2, label='cos(x)', color='red', linestyle='--')
plt.title('Funções Trigonométricas')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

#### Customização de Linhas
```python
# Estilos de linha
line_styles = ['-', '--', '-.', ':']
colors = ['b', 'g', 'r', 'c', 'm', 'y', 'k']
markers = ['o', 's', '^', 'v', '<', '>', 'D']

fig, ax = plt.subplots(figsize=(12, 8))

for i, (style, color, marker) in enumerate(zip(line_styles, colors, markers)):
    y = np.sin(x + i * 0.5)
    ax.plot(x, y, 
            linestyle=style, 
            color=color, 
            marker=marker,
            markersize=8,
            markevery=10,  # Marcador a cada 10 pontos
            label=f'Linha {i+1}')

ax.legend()
ax.set_title('Estilos de Linha Customizados')
plt.show()
```

### Gráficos de Barras
```python
# Dados categóricos
categorias = ['A', 'B', 'C', 'D', 'E']
valores = [23, 45, 56, 78, 32]

# Gráfico de barras vertical
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Barras verticais
bars1 = ax1.bar(categorias, valores, color=['red', 'green', 'blue', 'orange', 'purple'])
ax1.set_title('Gráfico de Barras Vertical')
ax1.set_ylabel('Valores')

# Adicionar valores nas barras
for bar in bars1:
    height = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}', ha='center', va='bottom')

# Barras horizontais
bars2 = ax2.barh(categorias, valores, color='skyblue')
ax2.set_title('Gráfico de Barras Horizontal')
ax2.set_xlabel('Valores')

plt.tight_layout()
plt.show()
```

#### Barras Agrupadas e Empilhadas
```python
# Dados para múltiplas séries
grupos = ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4']
valores_serie1 = [20, 35, 30, 35]
valores_serie2 = [25, 30, 15, 30]
valores_serie3 = [15, 25, 25, 15]

x = np.arange(len(grupos))  # Posições dos grupos
width = 0.25  # Largura das barras

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Barras agrupadas
bars1 = ax1.bar(x - width, valores_serie1, width, label='Série 1', color='lightcoral')
bars2 = ax1.bar(x, valores_serie2, width, label='Série 2', color='lightskyblue')
bars3 = ax1.bar(x + width, valores_serie3, width, label='Série 3', color='lightgreen')

ax1.set_xlabel('Grupos')
ax1.set_ylabel('Valores')
ax1.set_title('Barras Agrupadas')
ax1.set_xticks(x)
ax1.set_xticklabels(grupos)
ax1.legend()

# Barras empilhadas
ax2.bar(grupos, valores_serie1, label='Série 1', color='lightcoral')
ax2.bar(grupos, valores_serie2, bottom=valores_serie1, label='Série 2', color='lightskyblue')
ax2.bar(grupos, valores_serie3, 
        bottom=np.array(valores_serie1) + np.array(valores_serie2), 
        label='Série 3', color='lightgreen')

ax2.set_ylabel('Valores')
ax2.set_title('Barras Empilhadas')
ax2.legend()

plt.tight_layout()
plt.show()
```

### Histogramas
```python
# Dados para histograma
np.random.seed(42)
dados = np.random.normal(100, 15, 1000)  # Distribuição normal

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Histograma básico
axes[0,0].hist(dados, bins=30, color='skyblue', alpha=0.7, edgecolor='black')
axes[0,0].set_title('Histograma Básico')
axes[0,0].set_xlabel('Valores')
axes[0,0].set_ylabel('Frequência')

# Histograma com densidade
axes[0,1].hist(dados, bins=30, density=True, color='lightgreen', alpha=0.7)
axes[0,1].set_title('Histograma com Densidade')
axes[0,1].set_xlabel('Valores')
axes[0,1].set_ylabel('Densidade')

# Histograma com múltiplas séries
dados2 = np.random.normal(110, 20, 1000)
axes[1,0].hist([dados, dados2], bins=30, label=['Série 1', 'Série 2'], 
               color=['skyblue', 'lightcoral'], alpha=0.7)
axes[1,0].set_title('Múltiplas Séries')
axes[1,0].legend()

# Histograma cumulativo
axes[1,1].hist(dados, bins=30, cumulative=True, color='orange', alpha=0.7)
axes[1,1].set_title('Histograma Cumulativo')
axes[1,1].set_xlabel('Valores')
axes[1,1].set_ylabel('Frequência Cumulativa')

plt.tight_layout()
plt.show()
```

### Gráficos de Dispersão
```python
# Dados para scatter plot
np.random.seed(42)
n = 200
x = np.random.randn(n)
y = 2 * x + np.random.randn(n) * 0.5
colors = np.random.rand(n)
sizes = 1000 * np.random.rand(n)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Scatter básico
axes[0,0].scatter(x, y, alpha=0.6)
axes[0,0].set_title('Scatter Plot Básico')
axes[0,0].set_xlabel('X')
axes[0,0].set_ylabel('Y')

# Scatter com cores
scatter = axes[0,1].scatter(x, y, c=colors, alpha=0.6, cmap='viridis')
axes[0,1].set_title('Scatter com Cores')
plt.colorbar(scatter, ax=axes[0,1])

# Scatter com tamanhos variáveis
axes[1,0].scatter(x, y, s=sizes, alpha=0.6, c='red')
axes[1,0].set_title('Scatter com Tamanhos Variáveis')

# Scatter com linha de regressão
axes[1,1].scatter(x, y, alpha=0.6)
# Adicionar linha de regressão
z = np.polyfit(x, y, 1)
p = np.poly1d(z)
axes[1,1].plot(x, p(x), "r--", alpha=0.8)
axes[1,1].set_title('Scatter com Linha de Regressão')

plt.tight_layout()
plt.show()
```

### Box Plots
```python
# Dados para box plots
np.random.seed(42)
data_to_plot = [np.random.normal(0, std, 100) for std in range(1, 4)]

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Box plot básico
bp1 = axes[0].boxplot(data_to_plot, labels=['Grupo 1', 'Grupo 2', 'Grupo 3'])
axes[0].set_title('Box Plot Básico')

# Box plot customizado
bp2 = axes[1].boxplot(data_to_plot, 
                      labels=['Grupo 1', 'Grupo 2', 'Grupo 3'],
                      patch_artist=True,  # Permite colorir
                      notch=True,         # Mostra intervalo de confiança
                      showmeans=True)     # Mostra média

# Colorir os boxes
colors = ['lightblue', 'lightgreen', 'lightcoral']
for patch, color in zip(bp2['boxes'], colors):
    patch.set_facecolor(color)

axes[1].set_title('Box Plot Customizado')

# Box plot horizontal
bp3 = axes[2].boxplot(data_to_plot, 
                      labels=['Grupo 1', 'Grupo 2', 'Grupo 3'],
                      vert=False,  # Horizontal
                      patch_artist=True)

for patch, color in zip(bp3['boxes'], colors):
    patch.set_facecolor(color)

axes[2].set_title('Box Plot Horizontal')

plt.tight_layout()
plt.show()
```

### Gráficos de Pizza
```python
# Dados para gráfico de pizza
labels = ['Python', 'Java', 'JavaScript', 'C++', 'C#']
sizes = [30, 25, 20, 15, 10]
explode = (0.1, 0, 0, 0, 0)  # "Explodir" primeira fatia
colors = ['gold', 'yellowgreen', 'lightcoral', 'lightskyblue', 'lightpink']

fig, axes = plt.subplots(1, 2, figsize=(12, 6))

# Pizza básica
axes[0].pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
axes[0].set_title('Distribuição de Linguagens de Programação')

# Pizza customizada
axes[1].pie(sizes, 
            labels=labels, 
            explode=explode,
            colors=colors,
            autopct='%1.1f%%', 
            shadow=True, 
            startangle=90)
axes[1].set_title('Pizza Customizada')

plt.tight_layout()
plt.show()
```

## Subplots e Layouts

### Subplots Básicos
```python
# Criando múltiplos subplots
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

# Dados de exemplo
x = np.linspace(0, 2*np.pi, 100)

# Plotar em cada subplot
plots_data = [
    (np.sin(x), 'sin(x)', 'blue'),
    (np.cos(x), 'cos(x)', 'red'),
    (np.tan(x), 'tan(x)', 'green'),
    (np.sinh(x), 'sinh(x)', 'orange'),
    (np.cosh(x), 'cosh(x)', 'purple'),
    (np.tanh(x), 'tanh(x)', 'brown')
]

for i, (y_data, title, color) in enumerate(plots_data):
    row = i // 3
    col = i % 3
    axes[row, col].plot(x, y_data, color=color)
    axes[row, col].set_title(title)
    axes[row, col].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
```

### GridSpec para Layouts Complexos
```python
import matplotlib.gridspec as gridspec

# Layout complexo com GridSpec
fig = plt.figure(figsize=(12, 10))
gs = gridspec.GridSpec(3, 3, hspace=0.3, wspace=0.3)

# Plot principal (2x2)
ax1 = fig.add_subplot(gs[0:2, 0:2])
ax1.plot(x, np.sin(x), 'b-', linewidth=2)
ax1.set_title('Plot Principal')

# Plot superior direito
ax2 = fig.add_subplot(gs[0, 2])
ax2.hist(np.random.randn(1000), bins=30, color='red', alpha=0.7)
ax2.set_title('Histograma')

# Plot do meio direito
ax3 = fig.add_subplot(gs[1, 2])
ax3.scatter(np.random.randn(100), np.random.randn(100), alpha=0.6)
ax3.set_title('Scatter')

# Plot inferior (span 3 colunas)
ax4 = fig.add_subplot(gs[2, :])
ax4.bar(['A', 'B', 'C', 'D'], [1, 3, 2, 4], color='green', alpha=0.7)
ax4.set_title('Barras (Span 3 colunas)')

plt.show()
```

## Customização Avançada

### Cores e Estilos
```python
# Definir esquemas de cores
from matplotlib import cm
import matplotlib.colors as mcolors

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Cores básicas
x = np.linspace(0, 10, 100)
colors_basic = ['red', 'green', 'blue', 'orange', 'purple']

for i, color in enumerate(colors_basic):
    y = np.sin(x + i * 0.5)
    axes[0,0].plot(x, y, color=color, label=f'Linha {i+1}')
axes[0,0].set_title('Cores Básicas')
axes[0,0].legend()

# Colormap
colormap = cm.get_cmap('viridis')
for i in range(5):
    y = np.sin(x + i * 0.5)
    color = colormap(i / 4)  # Normalizar entre 0 e 1
    axes[0,1].plot(x, y, color=color, label=f'Linha {i+1}')
axes[0,1].set_title('Usando Colormap')
axes[0,1].legend()

# Cores hexadecimais
hex_colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
for i, color in enumerate(hex_colors):
    y = np.sin(x + i * 0.5)
    axes[1,0].plot(x, y, color=color, label=f'Linha {i+1}')
axes[1,0].set_title('Cores Hexadecimais')
axes[1,0].legend()

# Transparência (alpha)
for i in range(5):
    y = np.sin(x + i * 0.5)
    alpha = 0.2 + (i * 0.2)  # Alpha de 0.2 a 1.0
    axes[1,1].plot(x, y, color='blue', alpha=alpha, 
                   linewidth=3, label=f'Alpha {alpha:.1f}')
axes[1,1].set_title('Transparência (Alpha)')
axes[1,1].legend()

plt.tight_layout()
plt.show()
```

### Anotações e Texto
```python
fig, ax = plt.subplots(figsize=(10, 8))

# Dados
x = np.linspace(0, 10, 100)
y = np.sin(x)

ax.plot(x, y, 'b-', linewidth=2)

# Título e labels
ax.set_title('Exemplo de Anotações e Texto', fontsize=16, fontweight='bold')
ax.set_xlabel('Eixo X', fontsize=12)
ax.set_ylabel('sin(x)', fontsize=12)

# Anotações com setas
ax.annotate('Máximo local', 
            xy=(np.pi/2, 1), xytext=(2, 1.2),
            arrowprops=dict(arrowstyle='->', color='red', lw=2),
            fontsize=12, color='red')

ax.annotate('Mínimo local', 
            xy=(3*np.pi/2, -1), xytext=(5, -1.2),
            arrowprops=dict(arrowstyle='->', color='green', lw=2),
            fontsize=12, color='green')

# Texto simples
ax.text(7, 0.5, 'Função Seno', fontsize=14, 
        bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7))

# Linha vertical e horizontal de referência
ax.axvline(x=np.pi, color='gray', linestyle='--', alpha=0.7, label='π')
ax.axhline(y=0, color='black', linestyle='-', alpha=0.3)

ax.legend()
ax.grid(True, alpha=0.3)
plt.show()
```

### Estilos e Temas
```python
# Estilos disponíveis
print("Estilos disponíveis:")
print(plt.style.available)

# Aplicar diferentes estilos
styles = ['default', 'seaborn-v0_8', 'ggplot', 'classic']
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

x = np.linspace(0, 10, 100)
y = np.sin(x)

for i, style in enumerate(styles):
    with plt.style.context(style):
        row = i // 2
        col = i % 2
        axes[row, col].plot(x, y, linewidth=2)
        axes[row, col].set_title(f'Estilo: {style}')
        axes[row, col].grid(True)

plt.tight_layout()
plt.show()
```

## Integração com Pandas

### Plotting Direto do DataFrame
```python
import pandas as pd

# Criar dados de exemplo
np.random.seed(42)
dates = pd.date_range('2023-01-01', periods=100)
df = pd.DataFrame({
    'vendas': np.random.randint(50, 200, 100),
    'lucro': np.random.randint(10, 50, 100),
    'despesas': np.random.randint(20, 80, 100)
}, index=dates)

# Matplotlib com Pandas
fig, axes = plt.subplots(2, 2, figsize=(15, 10))

# Plot direto do DataFrame
df.plot(ax=axes[0,0], title='Série Temporal')

# Plot específico
df['vendas'].plot(ax=axes[0,1], kind='line', color='blue', title='Vendas')

# Histograma
df['vendas'].plot(ax=axes[1,0], kind='hist', bins=20, alpha=0.7, title='Distribuição Vendas')

# Box plot
df.plot(ax=axes[1,1], kind='box', title='Box Plot')

plt.tight_layout()
plt.show()
```

## Salvando Figuras

### Diferentes Formatos
```python
# Criar uma figura
fig, ax = plt.subplots(figsize=(8, 6))
x = np.linspace(0, 10, 100)
y = np.sin(x)
ax.plot(x, y, linewidth=2)
ax.set_title('Exemplo para Salvar')

# Salvar em diferentes formatos
# PNG (bitmap - boa qualidade, arquivo maior)
plt.savefig('grafico.png', dpi=300, bbox_inches='tight')

# PDF (vetor - excelente para publicações)
plt.savefig('grafico.pdf', bbox_inches='tight')

# SVG (vetor - bom para web)
plt.savefig('grafico.svg', bbox_inches='tight')

# JPG (compressão - arquivo menor)
plt.savefig('grafico.jpg', dpi=150, bbox_inches='tight', quality=95)

plt.show()
```

### Configurações Avançadas de Salvamento
```python
# Configurações detalhadas
plt.savefig('grafico_config.png',
            dpi=300,                    # Resolução
            bbox_inches='tight',        # Remove espaços em branco
            pad_inches=0.1,            # Padding ao redor
            facecolor='white',         # Cor de fundo
            edgecolor='none',          # Cor da borda
            transparent=False,         # Fundo transparente
            orientation='landscape')   # Orientação

plt.show()
```

## Performance e Boas Práticas

### Otimização para Grandes Datasets
```python
# Para muitos dados, usar rasterização
fig, ax = plt.subplots()

# Muitos pontos - usar rasterized=True
x = np.random.randn(100000)
y = np.random.randn(100000)
ax.scatter(x, y, alpha=0.5, rasterized=True)  # Converte para bitmap

plt.savefig('scatter_otimizado.pdf', dpi=150)
plt.show()
```

### Gestão de Memória
```python
# Fechar figuras para liberar memória
plt.figure()
plt.plot([1, 2, 3], [1, 4, 9])
plt.close()  # Fecha a figura atual

# Limpar todas as figuras
plt.clf()   # Clear figure
plt.cla()   # Clear axes
plt.close('all')  # Fecha todas as figuras
```

## Resolução de Problemas Comuns

### Backend e Display
```python
# Verificar backend atual
print(f"Backend atual: {plt.get_backend()}")

# Configurar backend (se necessário)
import matplotlib
matplotlib.use('Agg')  # Para salvar sem exibir
# matplotlib.use('TkAgg')  # Para exibição interativa
```

### Configurações Globais
```python
# Configurar fonte padrão
plt.rcParams['font.size'] = 12
plt.rcParams['font.family'] = 'serif'

# Configurar figura padrão
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['figure.dpi'] = 100

# Resetar configurações
plt.rcdefaults()
```

## Dicas de Visualização Efetiva

### Escolha do Gráfico Correto
```python
# Diretrizes para escolha de gráficos:
guia_graficos = {
    'Comparar categorias': 'Barras verticais/horizontais',
    'Distribuição de dados': 'Histograma, Box plot, Violin plot',
    'Relação entre variáveis': 'Scatter plot',
    'Tendência temporal': 'Linha',
    'Composição/proporção': 'Pizza, Barras empilhadas',
    'Múltiplas variáveis': 'Scatter matrix, Parallel coordinates'
}

for uso, grafico in guia_graficos.items():
    print(f"{uso}: {grafico}")
```

### Princípios de Design
```python
# Exemplo de gráfico bem formatado
fig, ax = plt.subplots(figsize=(10, 6))

# Dados
categories = ['Produto A', 'Produto B', 'Produto C', 'Produto D']
values = [23, 45, 56, 78]

# Barras com cores consistentes
bars = ax.bar(categories, values, color='steelblue', alpha=0.8)

# Adicionar valores nas barras
for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 1,
            f'{height}', ha='center', va='bottom', fontsize=12)

# Formatação limpa
ax.set_title('Vendas por Produto - Q1 2024', fontsize=16, fontweight='bold', pad=20)
ax.set_ylabel('Vendas (milhares)', fontsize=12)
ax.set_xlabel('Produtos', fontsize=12)

# Grade sutil
ax.grid(axis='y', alpha=0.3, linestyle='-', linewidth=0.5)
ax.set_axisbelow(True)

# Remover bordas desnecessárias
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Ajustar layout
plt.tight_layout()
plt.show()
```

## Exercícios Práticos

### Exercício 1: Gráfico de Linha Múltiplas
Crie um gráfico que mostra a evolução de vendas de 3 produtos ao longo de 12 meses com:
- Cores distintas para cada produto
- Marcadores diferentes
- Legenda posicionada fora da área do gráfico
- Grid suave
- Anotação do ponto máximo

### Exercício 2: Dashboard Simples
Crie um dashboard 2x2 com:
- Gráfico de barras (top-left)
- Histograma (top-right)
- Scatter plot (bottom-left)
- Box plot (bottom-right)

### Exercício 3: Visualização de Correlação
- Carregue um dataset com múltiplas variáveis numéricas
- Crie uma matriz de correlação visual usando `imshow`
- Adicione anotações com os valores de correlação
- Use uma paleta de cores divergente

O Matplotlib é uma ferramenta extremamente poderosa e flexível. Embora tenha uma curva de aprendizado inicial, dominar seus conceitos fundamentais permitirá criar visualizações de qualidade profissional para qualquer tipo de análise de dados.

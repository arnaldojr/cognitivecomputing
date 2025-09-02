# Sua Primeira Rede Neural com TensorFlow: Reconhecendo Dígitos!

Chegou a hora de sair da teoria e colocar a mão na massa! Nesta aula prática, você vai construir sua primeira rede neural do zero usando **TensorFlow** — uma das bibliotecas mais populares para Deep Learning no mundo.

Nosso desafio é ensinar um computador a reconhecer dígitos manuscritos, usando o famoso dataset **MNIST**. É como ensinar uma criança a ler números, mas em vez de mostrar flashcards, vamos mostrar milhares de exemplos para a máquina aprender os padrões!

![](mnist-samples.png)

**Por que o MNIST é perfeito para começar?**
- São **60.000 imagens** de treino (muito dados para aprender!)
- Imagens pequenas (**28x28 pixels**) — rápido de processar
- Problema **bem definido**: 10 classes (dígitos 0-9)
- É o "Hello World" do Deep Learning — se funcionar aqui, você entendeu os conceitos!

## Preparando o ambiente

Primeiro, vamos garantir que você tem as ferramentas certas. O TensorFlow é como uma caixa de ferramentas cheia de componentes pré-construídos para redes neurais:

```bash
pip install tensorflow
```

Agora crie um novo notebook Jupyter — vai ser nosso laboratório de experimentos!


## Carregando os dados: o combustível da IA

Toda rede neural precisa de dados para aprender, assim como você precisa de exemplos para aprender matemática. O TensorFlow já vem com o MNIST "de fábrica" — que conveniência!

**O que estamos fazendo aqui:**
1. **Carregamos o dataset** direto da biblioteca do TensorFlow
2. **Separamos** em treino (para ensinar) e teste (para avaliar)
3. **Normalizamos** os pixels de 0-255 para 0-1 (redes neurais gostam de números pequenos!)

```python
import tensorflow as tf

# Carregando o conjunto de dados MNIST - como abrir um livro de exercícios
mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Normalizando os dados - convertendo de 0-255 para 0-1
# É como ajustar o volume do rádio para o nível ideal
x_train, x_test = x_train / 255.0, x_test / 255.0

print(f"Dados de treino: {x_train.shape}")
print(f"Rótulos de treino: {y_train.shape}")
print(f"Dados de teste: {x_test.shape}")
print(f"Rótulos de teste: {y_test.shape}")
```

<?quiz?>
question: Por que normalizamos os pixels das imagens de 0-255 para 0-1?
answer: Para economizar espaço de armazenamento
answer: Porque o TensorFlow exige essa conversão
answer-correct: Porque redes neurais aprendem melhor com valores pequenos e padronizados
answer: Para acelerar o download dos dados
content:

A normalização ajuda a rede neural a convergir mais rapidamente durante o treinamento, evitando que valores grandes dominem o processo de aprendizado e garantindo estabilidade numérica.
<?/quiz?>


## Construindo nossa rede neural: como montar um Lego inteligente

Agora vem a parte divertida — vamos construir nossa rede neural como se fosse um Lego gigante! O TensorFlow nos dá peças pré-fabricadas que podemos empilhar para criar nossa "máquina de reconhecer dígitos".

### Os blocos fundamentais

**🧱 Sequential**: Nossa "base" — uma pilha simples onde cada camada se conecta à próxima
**🔄 Flatten**: O "achatador" — transforma a imagem 28x28 em uma linha de 784 números  
**🧠 Dense**: As "camadas pensantes" — onde a mágica acontece!

### Configurando os hiperparâmetros

Antes de construir, você precisa tomar algumas decisões importantes:

**Para as camadas ocultas:**
- **Quantos neurônios?** Comece com 128 ou 256 — é um bom meio-termo
- **Qual ativação?** Use `'relu'` — ela é rápida e eficiente

**Para a camada de saída:**
- **Quantos neurônios?** 10 (um para cada dígito: 0, 1, 2... 9)
- **Qual ativação?** Use `'softmax'` — transforma saídas em probabilidades

```python
# Construindo nossa rede neural - como montar um robô inteligente!
model = tf.keras.models.Sequential([
    # Camada 1: Achatar a imagem 28x28 em um vetor de 784 elementos
    tf.keras.layers.Flatten(input_shape=(28, 28)),
    
    # Camada 2: Primeira camada "pensante" com 128 neurônios
    tf.keras.layers.Dense(128, activation='relu'),
    
    # Camada 3: Segunda camada "pensante" com 64 neurônios
    tf.keras.layers.Dense(64, activation='relu'),
    
    # Camada 4: Saída final - 10 neurônios para 10 dígitos
    tf.keras.layers.Dense(10, activation='softmax')
])

# Vendo nossa criação
model.summary()
```

<?quiz?>
question: Por que usamos a função de ativação 'softmax' na camada de saída?
answer: Porque é mais rápida que outras funções
answer: Para reduzir o overfitting
answer-correct: Para converter as saídas em probabilidades que somam 1
answer: Para acelerar o treinamento
content:

Softmax transforma os valores de saída em probabilidades válidas (entre 0 e 1) que somam 1, permitindo interpretar qual dígito é mais provável de ser a resposta correta.
<?/quiz?>

## Configurando o cérebro: compilação do modelo

Agora que construímos nossa rede, precisamos ensiná-la como aprender! É como configurar os "instintos" de aprendizado da nossa IA. Precisamos definir três componentes essenciais:

**🎯 Otimizador**: Como a rede ajusta seus pesos (o "professor")
**📊 Função de perda**: Como medir o quão errada está a resposta
**📈 Métricas**: O que queremos acompanhar durante o treino

```python
# Configurando como nossa rede vai aprender
model.compile(
    optimizer='adam',                    # Adam: otimizador inteligente que adapta a velocidade
    loss='sparse_categorical_crossentropy',  # Para classificação com números inteiros
    metrics=['accuracy']                 # Queremos acompanhar a precisão
)

print("Modelo configurado e pronto para treinar! 🚀")
```

**Por que essas escolhas?**
- **Adam**: É como um professor experiente que sabe quando ir devagar e quando acelerar
- **sparse_categorical_crossentropy**: Perfeito quando nossos rótulos são números (0, 1, 2... 9)
- **accuracy**: A métrica mais intuitiva — quantos % acertamos?

<?quiz?>
question: Qual é a função do otimizador em uma rede neural?
answer: Definir a arquitetura da rede
answer: Calcular a função de perda
answer-correct: Controlar como os pesos são ajustados durante o treinamento
answer: Normalizar os dados de entrada
content:

O otimizador é responsável por ajustar os pesos da rede neural baseado nos gradientes calculados, determinando a direção e magnitude das mudanças para minimizar a função de perda.
<?/quiz?>

## Hora do treino: ensinando nossa IA a reconhecer dígitos!

Este é o momento mais emocionante — vamos colocar nossa rede para aprender! É como matricular um aluno em uma escola intensiva onde ele vai ver milhares de exemplos de dígitos manuscritos.

**O que vai acontecer:**
- A rede vai ver cada imagem e tentar adivinhar o dígito
- Quando errar, vai ajustar seus "neurônios" para melhorar
- Vai repetir isso por **30 épocas** (30 vezes todo o dataset)
- 20% dos dados ficam separados para **validação** (como um teste surpresa!)

```python
import matplotlib.pyplot as plt

# Começando o treinamento - prepare a pipoca! 🍿
print("Iniciando treinamento... Isso pode demorar alguns minutos!")

history = model.fit(
    x_train, y_train,           # Dados de treino (professor e aluno)
    epochs=30,                  # 30 "aulas" completas
    validation_split=0.2,       # 20% para teste durante o treino
    verbose=1                   # Mostrar progresso na tela
)

print("Treinamento concluído! 🎉")
```

**O que significam os números que aparecem:**
- **loss**: Quão "confusa" está a rede (menor = melhor)
- **accuracy**: % de acertos (maior = melhor)  
- **val_loss** e **val_accuracy**: Mesmas métricas nos dados de validação

<?quiz?>
question: Por que separamos parte dos dados para validação durante o treinamento?
answer: Para acelerar o processo de treinamento
answer: Para economizar memória do computador
answer-correct: Para monitorar se a rede está generalizando bem ou apenas decorando
answer: Para reduzir o tamanho do dataset
content:

A validação nos permite detectar overfitting - se a acurácia de treino sobe mas a de validação estagnar ou cair, significa que a rede está "decorando" em vez de aprender padrões gerais.
<?/quiz?>

## Visualizando o progresso: os gráficos que contam a história

Números são legais, mas gráficos são muito mais divertidos! Vamos transformar o histórico de treinamento em visualizações que mostram como nossa IA evoluiu a cada época.

```python
import pandas as pd
import matplotlib.pyplot as plt

# Transformando o histórico em um DataFrame para análise
df_historico = pd.DataFrame(history.history)
print("Métricas disponíveis:", df_historico.columns.tolist())
df_historico.head()

# Criando gráficos informativos
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))

# Gráfico 1: Evolução da Loss (erro)
ax1.plot(df_historico['loss'], label='Treino', linewidth=2)
ax1.plot(df_historico['val_loss'], label='Validação', linewidth=2)
ax1.set_title('Evolução da Loss ao Longo do Treino')
ax1.set_xlabel('Épocas')
ax1.set_ylabel('Loss')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Gráfico 2: Evolução da Acurácia
ax2.plot(df_historico['accuracy'], label='Treino', linewidth=2)
ax2.plot(df_historico['val_accuracy'], label='Validação', linewidth=2)
ax2.set_title('Evolução da Acurácia ao Longo do Treino')
ax2.set_xlabel('Épocas')
ax2.set_ylabel('Acurácia')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# Resumo final dos resultados
print(f"\n📊 RESUMO DO TREINAMENTO:")
print(f"✅ Acurácia final (treino): {df_historico['accuracy'].iloc[-1]:.3f}")
print(f"✅ Acurácia final (validação): {df_historico['val_accuracy'].iloc[-1]:.3f}")
print(f"📉 Loss final (treino): {df_historico['loss'].iloc[-1]:.3f}")
print(f"📉 Loss final (validação): {df_historico['val_loss'].iloc[-1]:.3f}")
```

**Como interpretar os gráficos:**
- **Curvas descendentes de loss**: Nossa rede está aprendendo! ⬇️
- **Curvas ascendentes de acurácia**: Cada vez mais certeira! ⬆️
- **Linhas próximas**: Sem overfitting — ótimo sinal! ✅
- **Linhas distantes**: Possível overfitting — precisa investigar 🔍

## O momento da verdade: testando nossa IA

Chegou a hora do exame final! Vamos ver como nossa rede se sai com dados que ela **nunca viu antes**. É como fazer uma prova após estudar — vamos descobrir se ela realmente aprendeu ou apenas decorou!

```python
# Avaliação no conjunto de teste - o momento da verdade! 
print("🎯 Testando a rede neural com dados nunca vistos...")

test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)

print(f"\n📋 RESULTADOS FINAIS:")
print(f"🎯 Acurácia no teste: {test_accuracy:.3f} ({test_accuracy*100:.1f}%)")
print(f"📉 Loss no teste: {test_loss:.3f}")

# Interpretando os resultados
if test_accuracy > 0.95:
    print("🏆 EXCELENTE! Sua rede é um verdadeiro especialista em dígitos!")
elif test_accuracy > 0.90:
    print("👍 MUITO BOM! Sua rede está bem treinada!")
elif test_accuracy > 0.80:
    print("😊 BOM! Há espaço para melhorias, mas está no caminho certo!")
else:
    print("🔧 Precisa de ajustes! Tente mais épocas ou ajustar a arquitetura.")
```

<?quiz?>
question: Por que é importante avaliar o modelo em um conjunto de teste separado?
answer: Para acelerar o processo de avaliação
answer: Para economizar recursos computacionais
answer-correct: Para verificar se o modelo generaliza bem para dados não vistos durante o treinamento
answer: Para comparar diferentes arquiteturas de rede
content:

O conjunto de teste simula dados do "mundo real" que o modelo nunca viu, permitindo uma avaliação honesta da capacidade de generalização da rede neural.
<?/quiz?>

## Salvando nossa criação: preservando o conhecimento

Parabéns! Você acabou de treinar uma rede neural funcional! Agora vamos salvá-la para usar depois — afinal, não queremos perder todo esse aprendizado.

```python
# Salvando nossa rede neural treinada - como arquivar um diploma! 
model.save('mnist_mlp_model.h5')
print("✅ Modelo salvo como 'mnist_mlp_model.h5'")
print("🎓 Sua IA agora é persistente e pode ser usada a qualquer momento!")

# Informações sobre o arquivo salvo
import os
file_size = os.path.getsize('mnist_mlp_model.h5') / (1024 * 1024)  # MB
print(f"📁 Tamanho do arquivo: {file_size:.2f} MB")
```

**O que contém o arquivo .h5:**
- 🧠 **Arquitetura completa** da rede (camadas, neurônios, conexões)
- ⚖️ **Todos os pesos** aprendidos durante o treinamento  
- ⚙️ **Configurações** de compilação (otimizador, loss, métricas)
- 📊 **Estado interno** para continuar o treinamento se necessário

## Testando com suas próprias imagens: o momento mágico!

Agora vem a parte mais legal — vamos testar nossa IA com imagens que **você** criou! É como mostrar um desenho para um amigo e perguntar "que número é este?"

### Preparando uma imagem personalizada

Para que funcione perfeitamente, sua imagem precisa seguir o "padrão MNIST":
- ✏️ **Fundo branco, número preto** (ou vice-versa)
- 📐 **Formato quadrado** (será redimensionada para 28x28)
- 🎨 **Escala de cinza** (sem cores)
- ✋ **Número manuscrito** bem centralizado

```python
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt

# Carregando nossa IA treinada
print("🤖 Carregando a IA especialista em dígitos...")
model = tf.keras.models.load_model('mnist_mlp_model.h5')
print("✅ IA carregada e pronta para reconhecer seus desenhos!")

def preparar_imagem_personalizada(caminho_arquivo):
    """
    Prepara uma imagem personalizada para ser reconhecida pela IA
    """
    # Carregando e redimensionando para 28x28 pixels em escala de cinza
    img = image.load_img(caminho_arquivo, color_mode='grayscale', target_size=(28, 28))
    
    # Convertendo para array numpy
    img_array = image.img_to_array(img)
    img_array = img_array.reshape(1, 28, 28)  # Formato que a rede espera
    
    # Normalizando para 0-1 (mesmo que no treinamento)
    img_array = img_array.astype('float32') / 255.0
    
    return img_array

def reconhecer_digito(caminho_arquivo):
    """
    Função completa para reconhecer um dígito em uma imagem
    """
    try:
        # Preparando a imagem
        img_preparada = preparar_imagem_personalizada(caminho_arquivo)
        
        # Fazendo a previsão
        predicoes = model.predict(img_preparada, verbose=0)
        digito_previsto = np.argmax(predicoes)
        confianca = np.max(predicoes) * 100
        
        # Mostrando o resultado
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
        
        # Imagem original
        ax1.imshow(img_preparada.reshape(28, 28), cmap='gray')
        ax1.set_title(f'Sua imagem (28x28 pixels)')
        ax1.axis('off')
        
        # Gráfico de probabilidades
        ax2.bar(range(10), predicoes[0])
        ax2.set_title(f'Previsão: {digito_previsto} (Confiança: {confianca:.1f}%)')
        ax2.set_xlabel('Dígitos')
        ax2.set_ylabel('Probabilidade')
        ax2.set_xticks(range(10))
        
        plt.tight_layout()
        plt.show()
        
        # Mensagem personalizada baseada na confiança
        if confianca > 90:
            print(f"🎯 CERTEZA ABSOLUTA: É um {digito_previsto}! (Confiança: {confianca:.1f}%)")
        elif confianca > 70:
            print(f"🤔 PROVÁVEL: Parece ser um {digito_previsto} (Confiança: {confianca:.1f}%)")
        else:
            print(f"🤷 INCERTO: Talvez seja um {digito_previsto}? (Confiança: {confianca:.1f}%)")
            print("💡 Dica: Tente uma imagem com traços mais nítidos!")
            
        return digito_previsto, confianca
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        print("💡 Verifique se o caminho da imagem está correto!")
        return None, 0

# Exemplo de uso - substitua pelo caminho da sua imagem
caminho_da_sua_imagem = 'seu_numero.png'  # ← Coloque aqui o caminho da sua imagem!

# Testando com sua imagem
print("🧪 Testando IA com sua imagem personalizada...")
digito, confianca = reconhecer_digito(caminho_da_sua_imagem)
```

<?quiz?>
question: Por que a imagem precisa ser convertida para 28x28 pixels e normalizada?
answer: Para economizar espaço de armazenamento
answer: Para acelerar o processamento da GPU
answer-correct: Para manter o mesmo formato dos dados usados no treinamento
answer: Para melhorar a qualidade visual da imagem
content:

A rede neural foi treinada com imagens 28x28 normalizadas, então qualquer nova imagem deve passar pelo mesmo pré-processamento para que a IA possa interpretá-la corretamente.
<?/quiz?>

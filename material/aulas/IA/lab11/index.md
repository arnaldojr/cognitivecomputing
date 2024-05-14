## Resumo sobre redes neurais

A criação de redes neurais envolve muitas etapas onde devem ser consideradow diversos pontos e aspectos de complexidade do problema envolvido, tratando-se de modelos para visão computacional tivemos contato com alguns tipos de arquitetura, otimização, dados, e implementação.


## Notebook completo 

No link a seguir tem um notebook completo com sugestões de implemetação

- [LINK o notebook completo](cnn_completo.ipynb)


## Etapas de construção de redes neurais

- **Arquitetura de Rede**: Escolha arquiteturas como VGG, ResNet, ou Mobilenet para aproveitar modelos pré-treinados através de fine-tuning.
- **Ajuste Fino (Fine-Tuning)**: Utilize transferência de aprendizado para acelerar o treinamento.
- **Dados**: Augmentação de dados e normalização são essenciais para a preparação eficaz de dados.
- **Otimização**: Otimizadores como Adam ou SGD (com momento), taxas de aprendizado ajustáveis e schedules são importantes.
- **Regularização**: Utilize técnicas como early stopping e L2 regularization para promover a generalização.

### Pipeline de Treinamento

A criação de uma rede neural envolve um pipeline de treinamento bem definido para garantir um modelo eficaz e robusto. A seguir estão as `etapas típicas que podem ou não fazer parte` de um pipeline de treinamento:

1. Preparação de Dados:

    - Coleta e Limpeza: Reunir dados de diversas fontes e garantir que estão limpos e livres de ruídos.
    - Augmentação: Aplicar técnicas de augmentação, como rotação, corte, ajuste de brilho e contraste, e distorções geométricas para aumentar a variedade dos dados de treino.
    - Divisão: Dividir os dados em conjuntos de treino, validação e teste.

2. Definição do Modelo:

    - Arquitetura: Escolher a arquitetura da rede neural com base na complexidade do problema e recursos disponíveis.
    - Camadas e Parâmetros: Definir a quantidade de camadas, neurônios, filtros de convolução, e outros parâmetros.

3. Compilação:

    - Função de Perda: Selecionar a função de perda apropriada (ex.: cross-entropy para classificação).
    - Otimização: Escolher o otimizador (ex.: Adam, SGD).
    - Métricas: Definir métricas para avaliar o desempenho do modelo (ex.: precisão, recall).

4. Treinamento:

    - Batch Size: Determinar o tamanho do batch para o treinamento.
    - Épocas: Definir o número de épocas para o treinamento.
    - Callback Functions: Utilizar callbacks como early stopping, redução da taxa de aprendizado on plateau, etc.

5. Validação:

    - Monitoramento: Avaliar o desempenho do modelo no conjunto de validação após cada época.
    - Ajuste de Hiperparâmetros: Ajustar hiperparâmetros com base no desempenho de validação.

6. Avaliação:

    - Teste: Avaliar o modelo final no conjunto de teste para medir sua performance.
    - Métricas de Avaliação: Utilizar métricas como precisão, recall, F1-score, e AUC-ROC.

7. Deploy de Modelos:

    - Exportação: Salvar o modelo treinado em um formato apropriado.
    - Serviço de Modelo: Utilizar frameworks como TensorFlow Serving ou ONNX para colocar o modelo em produção.
    - Monitoramento em Produção: Monitorar o desempenho do modelo em produção e realizar ajustes conforme necessário.


## Elementos de Redes Neurais
Elementos como dropout e batch normalization são fundamentais para o desempenho e a estabilidade do treinamento.

| Elemento              | Descrição e Casos de Uso    |
|-----------------------|-----------------------------------------------------------------------------------|
| **Dropout**           | Use para reduzir o overfitting, aplicável em redes densas ou MLPs, com taxa de 0.2 a 0.5.       |
| **Batch Normalization** | Utilize para estabilizar e acelerar o treinamento, aplicável tanto em camadas convolucionais quanto densas.   |
| **Quantidade de Filtros de Convolução** | Inicie com menos filtros e aumente nas camadas profundas. Exemplos: comece com 32 ou 64 e dobre em camadas subsequentes.  |
| **Max Pooling**       | Reduz a dimensionalidade espacial após camadas convolucionais. Pooling de 2x2 é comum.    |
| **Quantidade de Camadas e Neurônios em MLP** | Comece com uma ou duas camadas escondidas, com 100 a 300 neurônios por camada, ajustando conforme a necessidade.     |


## Funções de Ativação
A escolha da função de ativação é crucial no desenvolvimento de modelos de redes neurais para visão computacional.

| Função de Ativação | Local de Uso           | Descrição e Casos de Uso          |
|--------------------|------------------------|---------------------------------------------------------------------------|
| **Relu**           | Camadas intermediárias | Ideal em problemas de visão computacional, pois adicionam não linearidades que colaboram para o treinamento.    |
| **SIGMOID**        | Última camada          | Usada na última camada para problemas de classificação binária, onde a saída é interpretada como uma probabilidade. Não é ideal para multiclasses devido à saturação do gradiente. |
| **SOFTMAX**        | Última camada          | Indicada para a última camada em problemas de classificação multiclasse, convertendo logits em probabilidades condicionais para cada classe. A soma das probabilidades é 1.     |

```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

# Definindo o modelo
model = Sequential()

# Camadas convolucionais com número crescente de filtros
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2, 2)))

# Camada Flatten para converter a saída das camadas convolucionais em um vetor 1D
model.add(Flatten())

# Camadas totalmente conectadas
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))

model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))

# Última camada totalmente conectada com 10 saídas (10 classes de categoria de imagem)
model.add(Dense(10, activation='softmax'))

# Compilando o modelo
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Configurando a callback ModelCheckpoint
checkpoint = ModelCheckpoint('best_model.h5', 
                             monitor='val_accuracy', 
                             save_best_only=True, 
                             mode='max', 
                             verbose=1)

# Configurando a callback EarlyStopping
early_stopping = EarlyStopping(monitor='val_loss', 
                               patience=10, 
                               verbose=1, 
                               restore_best_weights=True)

# Configurando a callback ReduceLROnPlateau
reduce_lr = ReduceLROnPlateau(monitor='val_loss', 
                              factor=0.2, 
                              patience=5, 
                              min_lr=0.001, 
                              verbose=1)

# Treinando o modelo com as callbacks
history = model.fit(x_train, y_train, 
                    epochs=100, 
                    validation_data=(x_val, y_val), 
                    callbacks=[checkpoint, early_stopping, reduce_lr])

# Resumo do modelo
model.summary()
```

### Data Augmentation:

Data augmentation é uma técnica usada para aumentar a diversidade do conjunto de dados de treinamento sem realmente coletar novos dados. Isso é feito aplicando várias transformações (como rotações, translações, flip horizontal/vertical, zoom, etc.) às imagens de treinamento, o que ajuda a melhorar a generalização do modelo.

Podemos usar a classe `ImageDataGenerator` para aplicar data augmentation. Ela permite configurar e aplicar transformações às imagens em tempo real durante o treinamento.

#### ImageDataGenerator:

- rotation_range: Grau de rotação aleatória das imagens.
- width_shift_range: Fração do total da largura para deslocamento horizontal aleatório.
- height_shift_range: Fração do total da altura para deslocamento vertical aleatório.
- horizontal_flip: Permite flip horizontal aleatório.
- zoom_range: Faixa de zoom aleatório.

Existem outros parametros....

#### train_generator:

Usamos `flow` para criar um gerador que fornece lotes de dados augmentados durante o treinamento.


```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np

# Definindo o modelo
model = Sequential()

# Camadas convolucionais com número crescente de filtros
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(BatchNormalization())
model.add(MaxPooling2D(pool_size=(2, 2)))

# Camada Flatten para converter a saída das camadas convolucionais em um vetor 1D
model.add(Flatten())

# Camadas totalmente conectadas
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))

model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))

# Última camada totalmente conectada com 10 saídas (10 classes de categoria de imagem)
model.add(Dense(10, activation='softmax'))

# Compilando o modelo
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Configurando a callback ModelCheckpoint
checkpoint = ModelCheckpoint('best_model.h5', 
                             monitor='val_accuracy', 
                             save_best_only=True, 
                             mode='max', 
                             verbose=1)

# Configurando a callback EarlyStopping
early_stopping = EarlyStopping(monitor='val_loss', 
                               patience=10, 
                               verbose=1, 
                               restore_best_weights=True)

# Configurando a callback ReduceLROnPlateau
reduce_lr = ReduceLROnPlateau(monitor='val_loss', 
                              factor=0.2, 
                              patience=5, 
                              min_lr=0.001, 
                              verbose=1)

# Configurando o data augmentation
datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2
)

# Gerando dados de treinamento augmentados
train_generator = datagen.flow(x_train, y_train, batch_size=32)

# Treinando o modelo com as callbacks e data augmentation
history = model.fit(train_generator, 
                    epochs=100, 
                    validation_data=(x_val, y_val), 
                    callbacks=[checkpoint, early_stopping, reduce_lr])

# Resumo do modelo
model.summary()

```
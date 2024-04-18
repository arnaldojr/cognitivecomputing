## Modulo DNN OpenCV

Acesso os códigos python para testar:

- [Yolo - imagem](yolo.py)
- [Yolo - video](yolo_video.py)


### Detecção de Objetos com YOLOv5 e OpenCV em Python

Vamos compreender o uso do modelo YOLOv5 para detecção de objetos em imagens usando a OpenCV. 

O `módulo DNN (Deep Neural Network) do OpenCV` é uma biblioteca que oferece uma interface para `executar inferências a partir de redes neurais`. Ele suporta uma variedade de frameworks de aprendizado profundo, incluindo `TensorFlow, Caffe, Torch/PyTorch, e Darknet (YOLO)`. A principal vantagem do módulo DNN é permitir o uso de modelos pré-treinados de deep learning em aplicações de visão computacional diretamente com o OpenCV, sem depender dos frameworks originais.


### Importação das Bibliotecas Necessárias

```python
import cv2
import numpy as np
```

- `cv2`: Biblioteca OpenCV para operações de visão computacional.
- `numpy`: Biblioteca para manipulação de arrays e matrizes de alta performance.

### Carregamento do Modelo YOLOv5

```python
net = cv2.dnn.readNet('yolov5m.onnx')
```

Carrega o modelo pré-treinado YOLOv5 (formato ONNX). O modelo é responsável por realizar as predições das localizações dos objetos.

A yolov5 disponibiliza algumas versões:

- `yolov5m`: Modelo médio, oferece um equilíbrio entre velocidade e precisão. É adequado para aplicações que necessitam de uma boa precisão, mas ainda assim mantêm a necessidade de ser relativamente rápido. É maior que o yolov5s, resultando em uma precisão melhorada, porém com uma velocidade um pouco reduzida.
- `yolov5n`: Modelo nano, é a versão mais leve e rápida, projetada para ser extremamente rápida e para funcionar em dispositivos com recursos limitados, como smartphones e dispositivos IoT. Ele sacrifica precisão em prol de velocidade e baixo consumo de recursos.
- `yolov5s`: Modelo pequeno, é a versão que busca um equilíbrio entre velocidade e uso de recursos, mantendo uma precisão razoável. É ideal para aplicações que necessitam de uma detecção de objetos razoavelmente rápida e eficiente em termos de recursos.

!!! warning
    Você deve ter esse arquivo baixado em usa máquina, o arquivo é encontrado no link: [https://github.com/spmallick/learnopencv/tree/master/Object-Detection-using-YOLOv5-and-OpenCV-DNN-in-CPP-and-Python/models](https://github.com/spmallick/learnopencv/tree/master/Object-Detection-using-YOLOv5-and-OpenCV-DNN-in-CPP-and-Python/models)



### Leitura das Classes Possíveis

```python
classesFile = "coco.names"
with open(classesFile, 'rt') as f:
    classes = f.read().rstrip('\n').split('\n')
```

Carrega os nomes das classes que o modelo é capaz de detectar (baseado no dataset COCO que foi usado no treinamento).

!!! warning
    Você deve ter esse arquivo baixado em usa máquina, o arquivo é encontrado no link: [https://github.com/spmallick/learnopencv/blob/master/Object-Detection-using-YOLOv5-and-OpenCV-DNN-in-CPP-and-Python/coco.names](https://github.com/spmallick/learnopencv/blob/master/Object-Detection-using-YOLOv5-and-OpenCV-DNN-in-CPP-and-Python/coco.names)


### Interpretação dos Resultados

As variáveis `class_ids`, `confidences`, e `boxes` são criadas para armazenarem os IDs das classes, as confianças das detecções e as coordenadas das caixas delimitadoras, respectivamente. Seguindo uma estrutura de listas.

```python
class_ids = []
confidences = []
boxes = []
```

### Leitura da Imagem

```python
image = cv2.imread('img.jpg')
```

Carrega uma imagem `image` para teste. Esta imagem será usada para a detecção de objetos.

### Preparação da Imagem para o Modelo

```python
blob = cv2.dnn.blobFromImage(image, 1/255.0, (640, 640), swapRB=True, crop=False)
net.setInput(blob)
```

- `blobFromImage`: Converte a imagem para o formato necessário pelo modelo (blob), realiza normalizações (como escalonamento) e muda o layout de cores de BGR para RGB.
- `setInput`: Define o blob como entrada para a rede.

### Processamento da Detecção

```python
output_layers = net.getUnconnectedOutLayersNames()
outputs = net.forward(output_layers)
```

- `getUnconnectedOutLayersNames()`: Em modelos como YOLO, estas camadas de saída são as que fornecem as previsões finais após a passagem da imagem pela rede. Essas camadas são importantes porque são elas que contêm as informações sobre as detecções feitas pela rede, como coordenadas de caixas delimitadoras, classes detectadas e confianças associadas a essas detecções.
- `forward(output_layers)`: Executa a rede neural para processar a entrada fornecida (a imagem transformada em um blob). O método forward é usado para propagar o blob através da rede, calculando a saída nas camadas especificadas pelo argumento output_layers.


!!! warning
    O resultado, `outputs`, é um conjunto de arrays. Cada array corresponde a uma das camadas de saída especificadas e contém as informações detectadas para diferentes partes da imagem. Para o YOLO, esses arrays incluem as coordenadas das caixas delimitadoras (x, y, largura, altura), a confiança de que há um objeto dentro da caixa e as probabilidades de cada classe para o objeto detectado.

### Entendendo a saida outputs

`Outputs` é uma lista onde cada elemento é um array NumPy. Cada array corresponde às detecções feitas em uma certa camada de saída da rede neural. Para o YOLOv5, normalmente existem três arrays, um para cada escala de detecção.


Cada array tem uma estrutura tridimensional, comummente descrita como `(1, N, M)`, onde:

- 1 representa o batch size, ou seja, o número de imagens processadas. Geralmente é 1, pois processa-se uma imagem de cada vez.
- N é o número de caixas de detecção produzidas pela camada. Por exemplo, 25200 caixas (bounding boxes) ou detecções potenciais que o modelo gera para a imagem. É o resultado da multiplicação do número de âncoras (anchor boxes) por diferentes tamanhos de grade (grid sizes) em que a imagem é dividida durante a detecção.
- M é o número de características por caixa de detecção. No YOLO com o dataset COCO, M é geralmente 85, que inclui:
    - 4 valores para a localização da caixa delimitadora (cx, cy, largura, altura), indicando o centro, largura e altura da caixa.
    - 1 valor para a confiança de que a caixa contém um objeto.
    - 80 valores representando a probabilidade de cada uma das 80 classes possíveis no dataset COCO.



## Interpretando os resultados

Para extrair e utilizar as informações de detecção a partir do outputs, você deve realizar os seguintes passos:

- `Extração de Dados`: Itere sobre cada elemento (caixa de detecção) do array. Cada elemento contém informações detalhadas sobre uma detecção potencial.
- `Processamento de Caixas`: Para cada caixa de detecção, extraia as coordenadas (cx, cy, largura, altura) e a confiança. Aplique o fator de escala às coordenadas para converter essas coordenadas do espaço da imagem redimensionada para o espaço da imagem original.
- `Filtragem por Confiança`: Verifique se a confiança de que a caixa contém um objeto é superior a um limiar (por exemplo, 0.5). Isso reduz o número de falsos positivos.
- `Identificação da Classe`: Dentro dos 80 valores de probabilidade de classe, identifique o índice (classe) com a maior probabilidade. Esse índice corresponde à classe do objeto detectado na caixa.
- `Non-Max Suppression (NMS)`: Uma vez que várias caixas podem ser detectadas para o mesmo objeto, o NMS é usado para filtrar e manter apenas a caixa com a maior confiança, enquanto remove caixas que têm uma grande sobreposição com ela.


### Processamento das Detecções

```python
rows = outputs[0].shape[1]
image_height, image_width = image.shape[:2]
x_factor = image_width / 640
y_factor = image_height / 640

for r in range(rows):
    row = outputs[0][0][r] # pega a linha r, que contém as coordenadas da caixa delimitadora, confiança e probabilidades de classe
    confidence = row[4] # pega a confiança da detecção

    # Discard bad detections and continue.
    if confidence >= 0.45:
        classes_scores = row[5:] # pega as probabilidades de classe

        # pega o indice com a classe de maior score.
        class_id = np.argmax(classes_scores)

        if (classes_scores[class_id] > 0.5): # se o score for maior que 0.5
            confidences.append(confidence)  # adiciona a confiança
            class_ids.append(class_id)    # adiciona o id da classe

            cx, cy, w, h = row[0], row[1], row[2], row[3] # pega as coordenadas do centro x, centro y, largura e altura

            left = int((cx - w/2) * x_factor) # calcula a coordenada x do canto superior esquerdo
            top = int((cy - h/2) * y_factor) # calcula a coordenada y do canto superior esquerdo
            width = int(w * x_factor) # calcula a largura
            height = int(h * y_factor) # calcula a altura
            
            box = np.array([left, top, width, height]) # cria um array com as coordenadas
            boxes.append(box) # adiciona o array na lista de boxes

```

- rows = outputs[0].shape[1]: Esta linha obtém o número de detecções retornadas pela primeira camada de saída da rede neural. Em modelos como o YOLO, outputs[0] é um tensor que contém as detecções para a imagem, onde cada "row (linha)" representa uma detecção potencial. shape[1] se refere à dimensão que contém o número de detecções.

- `x_factor e y_factor`: fator de redimensionamento no eixo x (largura) e y (altura).

- `for r in range(rows)`: Itera sobre cada uma das detecções. A variável rows representa o número total de detecções possíveis para uma escala de saída do modelo.

- `Extração de dados para cada detecção`:

    - `row = outputs[0][0][r]`: Extrai a linha r do primeiro tensor de saída, que contém todas as informações necessárias para essa detecção específica.
    - `confidence = row[4]`: Extrai a confiança de que a caixa delimitadora contém algum objeto.

- `Filtragem de detecções por confiança`:

    - `if confidence >= 0.45`: Processa apenas as detecções que têm uma confiança de pelo menos 0.45. Isso ajuda a eliminar falsos positivos ou detecções de baixa qualidade.

- Extração e verificação das probabilidades das classes:

    - `classes_scores = row[5:]`: Obtém as probabilidades de cada classe para a detecção atual.
    - `class_id = np.argmax(classes_scores)`: Identifica o índice da classe que tem a maior probabilidade (score mais alto).
    - `if (classes_scores[class_id] > 0.5)`: Verifica se a maior probabilidade de classe excede 0.5, indicando uma alta confiança na classificação do objeto.

- Extração das coordenadas da caixa delimitadora e ajuste para o tamanho original da imagem:

    - `cx, cy, w, h = row[0], row[1], row[2], row[3]`: Extrai as coordenadas do centro da caixa, sua largura e altura da detecção.
    - `left = int((cx - w/2) * x_factor)`: Calcula a coordenada x do canto superior esquerdo da caixa, ajustando para o tamanho original da imagem.
    - `top = int((cy - h/2) * y_factor)`: Calcula a coordenada y do canto superior esquerdo, também ajustando para o tamanho original.
    - `width = int(w * x_factor), height = int(h * y_factor)`: Calcula a largura e altura reais da caixa delimitadora no tamanho original da imagem.

- Armazenamento das caixas delimitadoras:

    - `box = np.array([left, top, width, height])`: Cria um array com as coordenadas ajustadas da caixa delimitadora.
    - `boxes.append(box)`: Adiciona o array das coordenadas da caixa à lista de boxes, que será usada mais tarde para desenhar as caixas na imagem e aplicar a supressão de máximos não-máximos (NMS).


## Aplicação do Non-Maximum Suppression (NMS)

```python
indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.45, 0.45)
```

NMS é usado para eliminar caixas delimitadoras redundantes, mantendo apenas as mais prováveis para cada objeto.

## Desenho das Caixas Delimitadoras e Rótulos na Imagem

```python
for i in indices:
    ...
    cv2.rectangle(image, (left, top), (left + width, top + height), (255,178,50), 3*1)
    ...
    cv2.putText(image, label, (left, top + dim[1]), FONT_FACE, FONT_SCALE, YELLOW, 1, cv2.LINE_AA)
```

Desenha retângulos e texto para as detecções finais na imagem.

## Exibição da Imagem

```python
cv2.imshow('Output', image)
cv2.waitKey(0)
```



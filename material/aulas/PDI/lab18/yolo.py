import cv2
import numpy as np

# Carregar o modelo YOLOv5 ONNX
net = cv2.dnn.readNet('yolov5m.onnx')

# Ler uma imagem
image = cv2.imread('img.jpg')

# Preparar a entrada para o modelo
blob = cv2.dnn.blobFromImage(image, 1/255.0, (640, 640), swapRB=True, crop=False)
net.setInput(blob)

# Processar os resultados da detecção...
# o forward retorna uma lista de tensores, cada tensor contém as detecções de um nível de escala
output_layers = net.getUnconnectedOutLayersNames()
outputs = net.forward(output_layers)

# Lists to hold respective values while unwrapping.
class_ids = []
confidences = []
boxes = []
classesFile = "coco.names"
classes = None
with open(classesFile, 'rt') as f:
    classes = f.read().rstrip('\n').split('\n')
FONT_FACE = cv2.FONT_HERSHEY_SIMPLEX
FONT_SCALE = 0.7
BLACK  = (0,0,0)
BLUE   = (255,178,50)
YELLOW = (0,255,255)
RED = (0,0,255)

# vamos entender a saída do modelo YOLOv5
# cada detecção é representada por 85 valores
# 4 valores para as coordenadas da caixa delimitadora
# 1 valor para a confiança
# 80 valores para as probabilidades de classe
# outputs[0] é o tensor de saída do modelo, que contém as detecções do nível de escala 0, que é a escala original da imagem (640x640)
print(f'outputs[0].shape: {outputs[0].shape]}')


# pega o número de detecções
rows = outputs[0].shape[1]
image_height, image_width = image.shape[:2]

# Resizing factor.
x_factor = image_width / 640
y_factor =  image_height / 640

# Iterate through 25200 detections.
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

# Aplica o NMS, que é um algoritmo que remove as caixas que se sobrepõem
# Retorna os índices das caixas que devem ser mantidas
indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.45, 0.45) 
for i in indices:
    box = boxes[i]
    left = box[0]
    top = box[1]
    width = box[2]
    height = box[3]
    cv2.rectangle(image, (left, top), (left + width, top + height), (255,178,50), 3*1)
    label = "{}:{:.2f}".format(classes[class_ids[i]], confidences[i])
   
    text_size = cv2.getTextSize(label, FONT_FACE, FONT_SCALE, 1)
    dim, baseline = text_size[0], text_size[1] 
    # desenha um retângulo preto para o texto
    cv2.rectangle(image, (left, top), (left + dim[0], top + dim[1] + baseline), BLACK, cv2.FILLED);
    # escreve a classe e a confiança
    cv2.putText(image, label, (left, top + dim[1]), FONT_FACE, FONT_SCALE, YELLOW, 1, cv2.LINE_AA)

cv2.imshow('Output', image)
cv2.waitKey(0)
import cv2
import numpy as np

# Carregar o modelo YOLOv5 ONNX
net = cv2.dnn.readNet('yolov5m.onnx')

# Abrir um vídeo
cap = cv2.VideoCapture(0)

classesFile = "coco.names"
classes = None
with open(classesFile, 'rt') as f:
    classes = f.read().rstrip('\n').split('\n')

FONT_FACE = cv2.FONT_HERSHEY_SIMPLEX
FONT_SCALE = 0.7
BLACK = (0, 0, 0)
YELLOW = (0, 255, 255)

while True:
    # Ler um frame do vídeo
    ret, frame = cap.read()
    if not ret:
        break

    # Preparar a entrada para o modelo
    blob = cv2.dnn.blobFromImage(frame, 1/255.0, (640, 640), swapRB=True, crop=False)
    net.setInput(blob)

    # Executar a detecção de objetos
    outputs = net.forward(net.getUnconnectedOutLayersNames())

    # Processar os resultados da detecção
    boxes = []
    confidences = []
    class_ids = []

    rows = outputs[0].shape[1]
    image_height, image_width = frame.shape[:2]
    x_factor = image_width / 640
    y_factor = image_height / 640

    for r in range(rows):
        row = outputs[0][0][r]
        confidence = row[4]
        if confidence >= 0.45:
            classes_scores = row[5:]
            class_id = np.argmax(classes_scores)
            if classes_scores[class_id] > 0.2:
                confidences.append(confidence)
                class_ids.append(class_id)

                cx, cy, w, h = row[0], row[1], row[2], row[3]
                left = int((cx - w/2) * x_factor)
                top = int((cy - h/2) * y_factor)
                width = int(w * x_factor)
                height = int(h * y_factor)
                box = np.array([left, top, width, height])
                boxes.append(box)

    indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.45, 0.45)
    for i in indices:
        box = boxes[i]
        left = box[0]
        top = box[1]
        width = box[2]
        height = box[3]
        cv2.rectangle(frame, (left, top), (left + width, top + height), (255, 178, 50), 3)
        label = "{}:{:.2f}".format(classes[class_ids[i]], confidences[i])
        text_size = cv2.getTextSize(label, FONT_FACE, FONT_SCALE, 1)
        dim, baseline = text_size[0], text_size[1]
        cv2.rectangle(frame, (left, top), (left + dim[0], top + dim[1] + baseline), BLACK, cv2.FILLED)
        cv2.putText(frame, label, (left, top + dim[1]), FONT_FACE, FONT_SCALE, YELLOW, 1, cv2.LINE_AA)

    # Exibir o frame com os objetos detectados
    cv2.imshow('Output', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Liberar recursos
cap.release()
cv2.destroyAllWindows()

import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Dicionário para mapear índices de emoção para rótulos textuais
label_to_text = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happiness', 4: 'sad', 5: 'surprise', 6: 'neutral'}

# Carregar o modelo treinado
model_path = 'best_model.h5'
model = load_model(model_path)

# Inicializar a webcam
cap = cv2.VideoCapture(1)  #webcam
# cap = cv2.VideoCapture("Jeff.mp4")
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def preprocess_frame(frame):
    
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Resize 48x48 pixels
    resized_frame = cv2.resize(gray_frame, (48, 48))
    # Normaliza
    normalized_frame = resized_frame / 255.0
    # Reshape
    reshaped_frame = np.reshape(normalized_frame, (1, 48, 48, 1))
    return reshaped_frame

while True:
    # Capturar frame
    ret, frame = cap.read()
    if not ret:
        break
    
    frame = cv2.flip(frame, 1)  
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=7)

    for (x, y, w, h) in faces:
        face = frame[y:y+h, x:x+w]
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        # Pré-processar o frame
        preprocessed_frame = preprocess_frame(face)
        
        # Fazer a previsão
        predictions = model.predict(preprocessed_frame)
        emotion_index = np.argmax(predictions)
        emotion_label = label_to_text[emotion_index]
        
        # Escrever o rótulo da emoção na borda do retângulo
        cv2.rectangle(frame, (x, y-40), (x+w, y), (255, 0, 0), -1)
        cv2.putText(frame, emotion_label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)

        # # Desenhar a emoção prevista no frame
        # cv2.putText(frame, emotion_label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 20, cv2.LINE_AA)
        # cv2.putText(frame, emotion_label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        
        # Mostrar o frame
    cv2.imshow('Emotion Detection', frame)
    
    # Sair do loop ao pressionar 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Quando tudo estiver feito, libere a captura
cap.release()
cv2.destroyAllWindows()

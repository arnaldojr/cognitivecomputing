import cv2
import mediapipe as mp
import time

# --- Atalhos da nova API ---
BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

# Caminho do modelo baixado
MODEL_PATH = "face_landmarker.task"

# Cria o detector
options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=MODEL_PATH),
    running_mode=VisionRunningMode.VIDEO,
    num_faces=1,
    min_face_detection_confidence=0.5,
    min_face_presence_confidence=0.5,
    min_tracking_confidence=0.5
)

cap = cv2.VideoCapture(1)

with FaceLandmarker.create_from_options(options) as landmarker:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        h, w, _ = frame.shape

        # Converte BGR (OpenCV) -> RGB (MediaPipe)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Cria objeto de imagem do MediaPipe
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        # Timestamp em ms obrigatório para VIDEO
        timestamp_ms = int(time.time() * 1000)

        # Executa a detecção
        result = landmarker.detect_for_video(mp_image, timestamp_ms)

        # Desenha landmarks, se houver
        if result.face_landmarks:
            for face_landmarks in result.face_landmarks:
                for landmark in face_landmarks:
                    x = int(landmark.x * w)
                    y = int(landmark.y * h)
                    cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)

        cv2.imshow("Img", frame)

        key = cv2.waitKey(1)
        if key == 27:
            break

cap.release()
cv2.destroyAllWindows()
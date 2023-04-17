import cv2
import mediapipe as mp



mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

cap = cv2.VideoCapture(0)



while True:

    ret,frame = cap.read()

    if ret is not True:
        break

    h,w,_ = frame.shape
    rgb_image = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)


    ressult = face_mesh.process(rgb_image)

    for facial_landmarks in ressult.multi_face_landmarks:
        for i in range(0,468):
            pt1 = facial_landmarks.landmark[i]
            x = int(pt1.x*w)
            y = int(pt1.y*h)
            cv2.circle(frame, (x,y), 1,(0,255,0),-1)
    
    cv2.imshow("Img", frame)

    key = cv2.waitKey(1)
    if key == 27:           
        break               

cv2.destroyAllWindows()
cap.release()

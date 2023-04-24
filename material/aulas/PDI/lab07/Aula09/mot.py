import numpy as np
import cv2

#carrega o video 
cap = cv2.VideoCapture(0)

# Cria a subtração do fundo
fgbg = cv2.createBackgroundSubtractorMOG2()
#fgbg = cv2.createBackgroundSubtractorKNN()

kernel = np.ones((5,5),np.uint8)

while(1):
    ret, frame = cap.read()
    
    if not ret:
        break
    
    # Aplica a mascara no frame recebido
    fgmask = fgbg.apply(frame)


    ## vou testar a erosão, forma 1
   # kernel = np.ones((3,3),np.uint8)

    #erode = cv2.erode(fgmask,kernel,iterations = 2)

    #dilation = cv2.dilate(erode,kernel,iterations = 7)
 
    ## vou testar a forma 2
   
    opening = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel)
    dilation = cv2.dilate(opening,kernel,iterations = 7) 
 #   closing = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel)
    #opening = cv2.morphologyEx(opening, cv2.MORPH_OPEN, kernel)


    ## acha contornos
    contours,hierarchy = cv2.findContours(dilation, 1, 2)
    if len(contours)>0:
        cnt = contours[0]
    
        ## desenha retangulo 
        x,y,w,h = cv2.boundingRect(cnt)
        frame = cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)


    ### exibo o resultado
    cv2.imshow('frame',frame)

    cv2.imshow('processado',dilation)

    
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break
    

cap.release()
cv2.destroyAllWindows()
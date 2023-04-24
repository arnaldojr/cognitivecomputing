# Programa simples com camera webcam e opencv\n
import math
import cv2
import os.path
import numpy as np

def image_da_webcam(img):
    #->>> !!!! FECHE A JANELA COM A TECLA ESC !!!! <<<<-
    #deve receber a imagem da camera e retornar uma imagems filtrada.

    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray,5)
    saida = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    #detecta os circulos maiores e circula eles
    circles = cv2.HoughCircles(gray,cv2.HOUGH_GRADIENT,1,20,param1=30,param2=80,minRadius=100,maxRadius=0)
    circulosDetectados = np.uint16(np.around(circles))
    for (x, y, r) in circulosDetectados[0,:]:
        cv2.circle(saida,(x, y), r,(0,0,0),3)
    
    # Definição dos valores minimo e max da mascara azul
    blue_lower_hsv = np.array([70, 150, 210])
    blue_upper_hsv = np.array([100, 255, 240])
    
    # Definição dos valores minimo e max da mascara vermelha
    red_lower_hsv = np.array([0, 220, 160])
    red_upper_hsv = np.array([20, 255, 255])

    # Aplicando a máscara azul e vermelha na imagem
    blue_mask_hsv = cv2.inRange(img_hsv, blue_lower_hsv, blue_upper_hsv)
    red_mask_hsv = cv2.inRange(img_hsv, red_lower_hsv, red_upper_hsv)
    both_mask_hsv = cv2.bitwise_or(blue_mask_hsv, red_mask_hsv)
    
    # Identificando os contornos para uso posterior de calculo da área
    contornos, _ = cv2.findContours(both_mask_hsv, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    mascara_rgb = cv2.cvtColor(both_mask_hsv, cv2.COLOR_GRAY2RGB)
    
    # For para calcular a área e o CM, e imprimir na imagem de acordo com a posição do eixo X do CM,\n",
    # para que cada informação fique do lado do circulo correspondente\n",
    cxV = []
    cyV = []
    for i in contornos:
        area = cv2.contourArea(i)
        M = cv2.moments(i)
        cx = int(M['m10']/M['m00'])
        cy = int(M['m01']/M['m00'])
        cxV.append(cx)
        cyV.append(cy)

        tamnho = 20
        cor = (0,0,0)
        cv2.line(saida,(cx - tamnho,cy),(cx + tamnho,cy),cor,5)
        cv2.line(saida,(cx,cy - tamnho),(cx, cy + tamnho),cor,5)
        fonte = cv2.FONT_HERSHEY_SIMPLEX
        texto = cx, cy, area
        if cx <200:
              origem = (cx+150,cy)
        else:
              origem = (cx-470,cy)
    
        cv2.putText(saida, str(texto), origem, fonte,1,(0,0,0),2,cv2.LINE_AA)
   
        # Traça a reta
        cor = (0, 0, 0)
        vetorTamanho = len(cxV)
        cv2.line(saida,(cxV[0],cyV[0]), (cxV[vetorTamanho-1], cyV[vetorTamanho-1]),cor,5)
    
        # Calcula e imprime o ângulo da reta\n",
        fonte = cv2.FONT_HERSHEY_SIMPLEX
        cxT = cxV[0]-cxV[vetorTamanho-1]
        cyT = cyV[0]-cyV[vetorTamanho-1]

        angulo = math.atan2(cyV[0], cyV[vetorTamanho-1]) - math.atan2(cxV[0], cxV[vetorTamanho-1])
        texto = str(round(math.degrees(angulo), 2))
        origem = (cxT-100,cyT-80)
        cv2.putText(saida, texto, origem, fonte,1,(0,0,0),2,cv2.LINE_AA)
    
        return saida
    
cv2.namedWindow("\preview")
vc = cv2.VideoCapture(0)
    
    
if vc.isOpened(): # try to get the first frame
    rval, frame = vc.read()
else:
    rval = False

while rval:
    img = image_da_webcam(frame)
    
    cv2.imshow("\preview", img)
    rval, frame = vc.read()
    key = cv2.waitKey(20)
    if key == 27: # exit on ESC
        break
    
cv2.destroyWindow("\preview")
vc.release()
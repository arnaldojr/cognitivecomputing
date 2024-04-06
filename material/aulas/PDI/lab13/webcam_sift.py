#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# este código implementa o descritor SIFT e realiza um processo homografia para desenhar o contorno da imagem detectada
import cv2
import numpy as np


# Numero mínimo de matches para considerar que encontrou o objeto
minKPMatch=30

# Inicializa o SIFT
sift=cv2.SIFT_create(nfeatures=500)

# Carrega a imagem de referencia na escala de cinza.
# Em outras palavras, quero encontrar essa imagem no video. 
refImg=cv2.imread("admiravelmundonovo.jpg",0)

# Calcula os keypoints e Descritores da imagem de referencia
refKP,refDesc = sift.detectAndCompute(refImg,None)

# configura a captura de imagem da webcam
# vc=cv2.VideoCapture('admiravelmundonovo.mp4')
vc=cv2.VideoCapture(0)

# Cria um objeto BFMatcher
bf = cv2.BFMatcher()

# área mínima para desenhar o polígono
min_area = 1000

# configs para exibir o texto na tela
fonte = cv2.FONT_HERSHEY_SIMPLEX
posicao = (10, 30)  # Posição do texto no canto superior esquerdo
fonte_escala = 1  # Tamanho da fonte
cor = (255, 0, 0)  # Cor do texto (branco)
espessura = 2  # Espessura do texto

while True:
    rval, frame = vc.read()

    if not rval:
        break   


    # Converte o frame da web para escala de cinza
    frameImg=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)

    # Calcula os keypoints e Descritores do frame recebido pela webcam
    frameKP, frameDesc = sift.detectAndCompute(frameImg,None)

    # a função matches devolve os pontos encontrados
    # para k=2, dois objetos são retornados
    matches = bf.knnMatch(refDesc,frameDesc, k=2) 

    # Filtra os matches encontrados em matches (m,n), para obter um resultado mais limpo
    # Implementado conforme o paper publicado por D.Lowe
    goodMatch=[]
    for m,n in matches:
        if(m.distance < 0.75*n.distance):
            goodMatch.append(m)
       
    # Testa se foram encontrados matches acima do minimo definido
    if(len(goodMatch)> minKPMatch):
        # Se sim, extrai os matches das duas imagens.
        # isso é importante pq sabendo onde os pontos se encontram nas duas imagens
        # posso correlacionar as coordenadas de uma imagem na outra
        # ref:https://answers.opencv.org/question/122802/how-to-convert-keypoints-to-an-argument-for-findhomography/

        tp=[]
        qp=[]
        for m in goodMatch:
            qp.append(refKP[m.queryIdx].pt) # fornece os indices de um ID e .pt as coordenadas
            tp.append(frameKP[m.trainIdx].pt)
        tp,qp=np.float32((tp,qp))
        
        # o findHomography mapeia os pontos de um plano em outro.
        # ou seja, mapeia os keypoints da imagem ref em frame
        H,status=cv2.findHomography(qp,tp,cv2.RANSAC,3.0)
        
        # extrai o shape da imagem de referencia
        h,w=refImg.shape
        # Mapeia os pontos das bordas com base no shape refImg, são 4 pontos
        #  [0,0]        [w-1,0]
        #
        # 
        #  [0,h-1]      [w-1,h-1]
        #
        refBorda = np.float32([[[0,0],[0,h-1],[w-1,h-1],[w-1,0]]])
        # Usa refBorda e a matrix de homografia H para calcular a matrix transformação de pespectiva
        frameBorda = cv2.perspectiveTransform(refBorda,H)

        # Para nao desenhar contornos falsos positivos, vou calcula a area do poligono encontrado e comparar com a area minima
        area = cv2.contourArea(frameBorda)

        # Desenha o polígono se a área for maior que a área mínima
        if area > min_area:
            cv2.polylines(frame, [np.int32(frameBorda)], True, (0, 255, 0), 5)
            texto = f"Encontrado match - {len(goodMatch)}/{minKPMatch} - area: {int(area)} - BOM"
        else:
            texto = f"Encontrado match - {len(goodMatch)}/{minKPMatch} - area: {int(area)} - INSUFICIENTE"
    else:
        texto = f"Encontrado match - {len(goodMatch)}/{minKPMatch} - RUIM"

    # Escreva o texto e exibe a imagem
    cv2.putText(frame, texto, posicao, fonte, fonte_escala, cor, espessura)
    cv2.imshow("resultado", frame)

    rval, frame = vc.read()
    if cv2.waitKey(10) & 0xFF == ord('q'):# tecla 'q' para sair do programa
        break

vc.release()
cv2.destroyAllWindows()
 
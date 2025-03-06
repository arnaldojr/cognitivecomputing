# Quiz Avançado sobre Filtros de Convolução (Lab04)

## Questões Teóricas

1. **O que é um filtro de convolução em processamento de imagens e como ele funciona matematicamente?**
   - a) Um método para aumentar o tamanho da imagem através de interpolação bilinear
   - b) Uma operação matemática que aplica uma matriz (kernel) em cada pixel da imagem, calculando a soma ponderada dos valores dos pixels vizinhos
   - c) Um processo para converter imagens coloridas em preto e branco usando limiarização adaptativa
   - d) Uma técnica para compressão de imagens baseada na transformada de Fourier

   ![Ilustração de Convolução](lab04/convolution.png)

2. **Qual é o efeito matemático dos filtros de suavização (blurring) na frequência espacial de uma imagem?**
   - a) Atuam como passa-altas, preservando as altas frequências (detalhes)
   - b) Não alteram o conteúdo de frequência da imagem
   - c) Atuam como passa-baixas, atenuando as altas frequências (detalhes)
   - d) Amplificam seletivamente as frequências médias

3. **O que acontece com a resposta ao impulso de um filtro Gaussiano quando aumentamos o valor de sigma?**
   - a) A resposta se torna mais estreita, resultando em menos suavização
   - b) A resposta se torna mais ampla, resultando em maior suavização
   - c) A resposta oscila mais, criando efeitos de ringing
   - d) A resposta se torna mais direcional, suavizando apenas em uma direção

4. **Qual é a principal diferença teórica entre os operadores de Sobel e Laplaciano para detecção de bordas?**
   - a) Sobel é baseado na primeira derivada (gradiente), enquanto Laplaciano é baseado na segunda derivada
   - b) Sobel funciona apenas em imagens coloridas, enquanto Laplaciano funciona em escala de cinza
   - c) Sobel detecta apenas bordas horizontais, enquanto Laplaciano detecta bordas em todas as direções
   - d) Sobel é um filtro não-linear, enquanto Laplaciano é linear

5. **Por que o detector de bordas de Canny é considerado superior a simples operadores de gradiente?**
   - a) Porque utiliza cores para destacar as bordas
   - b) Porque implementa múltiplos estágios: suavização, cálculo de gradiente, supressão não-máxima e limiarização com histerese
   - c) Porque é computacionalmente mais eficiente
   - d) Porque funciona exclusivamente em imagens de alta resolução

## Questões Práticas

6. **Observe as imagens abaixo. Qual filtro foi aplicado na imagem da direita?**

   ![Imagem Original e Filtrada](lab04/saida.png)

   - a) Filtro de média (blur)
   - b) Filtro de Sobel
   - c) Filtro Gaussiano
   - d) Filtro de Canny

7. **Qual seria o resultado da aplicação do seguinte kernel em uma imagem?**
   ```
   [-1, -1, -1]
   [-1,  9, -1]
   [-1, -1, -1]
   ```
   - a) Suavização da imagem
   - b) Detecção de bordas
   - c) Aumento de nitidez (sharpening)
   - d) Emboss (efeito de relevo)

8. **Calcule o resultado da convolução da seguinte matriz de imagem 3x3 com o kernel 3x3 apresentado, considerando o pixel central:**
   ```
   Matriz da imagem:       Kernel:
   [10, 20, 30]            [0, 1, 0]
   [40, 50, 60]            [1, -4, 1]
   [70, 80, 90]            [0, 1, 0]
   ```
   - a) -60
   - b) 0
   - c) 60
   - d) 240

9. **Ao implementar um filtro de média 5x5 no OpenCV, qual seria o código correto?**
   - a) `cv2.blur(img, (5, 5))`
   - b) `cv2.filter2D(img, -1, np.ones((5,5))/25)`
   - c) `cv2.boxFilter(img, -1, (5, 5), normalize=True)`
   - d) Todas as alternativas acima produzem o mesmo resultado

10. **Analise o código abaixo e determine sua função:**
   ```python
   gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
   sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
   sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
   magnitude = np.sqrt(sobelx**2 + sobely**2)
   direction = np.arctan2(sobely, sobelx) * (180/np.pi)
   ```
   - a) Implementação do detector de bordas de Canny
   - b) Cálculo da magnitude e direção do gradiente usando operadores de Sobel
   - c) Aplicação de um filtro de Gabor para análise de textura
   - d) Implementação de um filtro passa-banda direcional

11. **Qual seria o efeito da seguinte sequência de operações em uma imagem com ruído?**
    ```python
    blurred = cv2.GaussianBlur(img, (5, 5), 0)
    sharpened = cv2.addWeighted(img, 1.5, blurred, -0.5, 0)
    ```
    - a) Remoção de ruído sem perda significativa de detalhes
    - b) Amplificação do ruído e aumento da nitidez
    - c) Remoção completa de bordas e detalhes
    - d) Conversão para escala de cinza com preservação de bordas

## Questões de Desafio

12. **Observe a imagem abaixo. Qual combinação de técnicas seria mais eficaz para detectar apenas as linhas do tabuleiro de sudoku?**

    ![Sudoku](lab04/sudoku.png)

    - a) Limiarização adaptativa seguida de operações morfológicas
    - b) Filtro Gaussiano seguido de detector de Canny e Transformada de Hough
    - c) Segmentação por watershed após aplicação de gradiente morfológico
    - d) K-means clustering seguido de detecção de contornos

13. **Qual é o impacto do "padding" em operações de convolução e como ele afeta o tamanho da imagem resultante?**
    - a) O padding SAME mantém as dimensões originais da imagem, enquanto o padding VALID reduz as dimensões
    - b) O padding não afeta o tamanho da imagem, apenas a intensidade dos pixels de borda
    - c) O padding sempre aumenta o tamanho da imagem final proporcionalmente ao tamanho do kernel
    - d) O padding é usado apenas para kernels de tamanho par

    ![Padding em Convolução](lab04/same_padding_no_strides.gif)

14. **Considere um filtro bilateral aplicado a uma imagem. O que diferencia este filtro de um filtro Gaussiano tradicional?**
    - a) O filtro bilateral é mais rápido computacionalmente
    - b) O filtro bilateral preserva bordas enquanto suaviza regiões homogêneas, pois considera tanto a proximidade espacial quanto a similaridade de intensidade
    - c) O filtro bilateral funciona apenas em imagens coloridas
    - d) O filtro bilateral aplica suavização apenas na direção do gradiente local

15. **Qual seria o resultado da aplicação do seguinte kernel em uma imagem em escala de cinza?**
    ```
    [ 0, -1,  0]
    [-1,  4, -1]
    [ 0, -1,  0]
    ```
    - a) Suavização da imagem
    - b) Detecção de bordas usando aproximação do Laplaciano
    - c) Aumento de nitidez (sharpening)
    - d) Detecção de cantos (corner detection)

16. **Observe a imagem abaixo. Que sequência de operações seria mais adequada para isolar apenas o pinguim Tux do fundo?**

    ![Tux](lab04/tux.png)

    - a) Conversão para escala de cinza, limiarização de Otsu e operações morfológicas
    - b) Segmentação baseada em cor no espaço HSV, seguida de detecção de contornos
    - c) Aplicação do algoritmo GrabCut com inicialização automática
    - d) Detector de Canny seguido de preenchimento de contornos fechados

17. **Em processamento de imagens médicas, qual técnica baseada em convolução é frequentemente usada para realçar estruturas tubulares como vasos sanguíneos?**
    - a) Filtros de Gabor em múltiplas escalas e orientações
    - b) Filtros de casamento (matched filters) baseados em perfis gaussianos
    - c) Filtros de difusão anisotrópica
    - d) Todas as alternativas acima

18. **Qual é o princípio matemático por trás da implementação eficiente de filtros de convolução separáveis?**
    - a) A decomposição do kernel 2D em dois vetores 1D, reduzindo a complexidade computacional de O(n²) para O(2n)
    - b) A aplicação da transformada rápida de Fourier (FFT) para converter a convolução em multiplicação no domínio da frequência
    - c) A utilização de integrais de imagem (summed area tables) para calcular somas em regiões retangulares
    - d) A implementação de algoritmos paralelos em GPU

19. **Qual destas afirmações sobre o detector de bordas de Canny é FALSA?**
    - a) Utiliza dois limiares para detectar bordas fortes e fracas
    - b) Inclui uma etapa de supressão não-máxima para afinar as bordas
    - c) É invariante a rotações e mudanças de escala
    - d) Geralmente aplica um filtro Gaussiano como pré-processamento

## Respostas

1. b
2. c
3. b
4. a
5. b
6. b
7. c
8. a
9. d
10. b
11. a
12. b
13. a
14. b
15. b
16. b
17. d
18. a
19. c

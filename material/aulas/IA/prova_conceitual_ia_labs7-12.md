# Prova Conceitual de Inteligência Artificial
## Laboratórios 07 a 12 - Redes Neurais e Deep Learning

**Nome:** _________________________________ **Data:** _____________

**Instruções:** Esta prova avalia conceitos teóricos abordados nos laboratórios de IA do lab07 ao lab12. Responda todas as questões de forma clara e objetiva. Não é necessário escrever código.

---

## **PARTE I - MÚLTIPLA ESCOLHA** (2,0 pontos - 0,2 cada)

**1.** Qual é a principal vantagem das Redes Neurais Convolucionais (CNNs) sobre as redes Multilayer Perceptron (MLP) para processamento de imagens?

a) CNNs têm sempre menos parâmetros que MLPs  
b) CNNs preservam a estrutura espacial das imagens e compartilham pesos  
c) CNNs são mais rápidas para treinar  
d) CNNs não precisam de função de ativação  

**2.** Em uma operação de convolução 2D, qual é o efeito do **padding='valid'** com kernel 3×3 e stride=1?

a) Aumenta o tamanho da saída  
b) Mantém o tamanho original  
c) Reduz a altura e largura em 2 pixels (1 de cada lado)  
d) Dobra as dimensões da imagem  

**3.** Qual é a principal diferença entre **Max Pooling** e **Average Pooling**?

a) Max Pooling reduz canais, Average Pooling aumenta canais  
b) Max Pooling preserva picos de ativação; Average Pooling suaviza respostas  
c) Average Pooling não é diferenciável  
d) São funcionalmente idênticos na prática  

**4.** No contexto de **Transfer Learning**, qual estratégia é mais adequada quando você tem um dataset pequeno e similar ao dataset original?

a) Treinar toda a rede do zero  
b) Congelar todas as camadas e treinar apenas o classificador final  
c) Fine-tuning de todas as camadas com learning rate alto  
d) Usar apenas as camadas convolucionais como extrator de características  

**5.** Qual **função de ativação** é mais apropriada para a camada de saída de um problema de classificação multiclasse?

a) ReLU  
b) Sigmoid  
c) Softmax  
d) Tanh  

**6.** O que é **Data Augmentation** e qual seu principal objetivo?

a) Técnica para aumentar o tamanho físico das imagens  
b) Método para criar variações dos dados de treino e reduzir overfitting  
c) Processo de limpeza e normalização dos dados  
d) Algoritmo para compressão de datasets  

**7.** Qual **callback** é usado para interromper o treinamento quando o modelo para de melhorar?

a) ModelCheckpoint  
b) ReduceLROnPlateau  
c) EarlyStopping  
d) LearningRateScheduler  

**8.** Em problemas de **regressão**, qual métrica é mais comumente usada como função de perda?

a) Categorical Crossentropy  
b) Binary Crossentropy  
c) Mean Squared Error (MSE)  
d) Sparse Categorical Crossentropy  

**9.** O **Batch Normalization** é aplicado principalmente para:

a) Reduzir overfitting apenas  
b) Acelerar convergência e estabilizar o treinamento  
c) Substituir funções de ativação  
d) Diminuir o número de parâmetros  

**10.** Qual é o efeito do **stride=2** em uma camada convolucional?

a) Aumenta a resolução espacial  
b) Diminui a resolução espacial e o custo computacional  
c) Substitui a função de ativação  
d) Torna o kernel maior  

---

## **PARTE II - VERDADEIRO OU FALSO** (1,5 pontos - 0,15 cada)

**11.** ( ) O Dropout é aplicado tanto durante o treinamento quanto durante a inferência.

**12.** ( ) A função ReLU é adequada para camadas intermediárias porque introduz não-linearidade e evita o problema do gradiente que desaparece.

**13.** ( ) Em Transfer Learning, é sempre melhor descongelar todas as camadas e treinar com learning rate alto.

**14.** ( ) Data Augmentation pode incluir transformações como rotação, translação, zoom e ajuste de brilho.

**15.** ( ) O callback ReduceLROnPlateau diminui automaticamente a taxa de aprendizado quando a métrica monitorada para de melhorar.

**16.** ( ) Batch Normalization normaliza as ativações mantendo a média próxima de 0 e desvio padrão próximo de 1.

**17.** ( ) Global Average Pooling pode substituir camadas densas finais, reduzindo significativamente o número de parâmetros.

**18.** ( ) Em problemas de classificação binária, a função Sigmoid na última camada produz uma probabilidade entre 0 e 1.

**19.** ( ) O padding='same' garante que a saída da convolução tenha o mesmo tamanho da entrada.

**20.** ( ) Modelos pré-treinados como VGG, ResNet ou MobileNet não podem ser adaptados para problemas específicos.

---

## **PARTE III - QUESTÕES DISSERTATIVAS** (6,5 pontos)

### **Questão 21** (1,5 pontos)
Explique o conceito de **Transfer Learning**. Como ele funciona e quais são suas principais vantagens? Cite dois cenários diferentes onde Transfer Learning seria aplicado e justifique as estratégias que você usaria em cada caso.

**Resposta:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### **Questão 22** (1,5 pontos)
Descreva o **pipeline completo de treinamento de uma rede neural** para visão computacional. Mencione pelo menos 6 etapas importantes e explique brevemente o propósito de cada uma.

**Resposta:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### **Questão 23** (1,5 pontos)
Compare **Multilayer Perceptrons (MLPs)** e **Redes Neurais Convolucionais (CNNs)** em termos de:
- Número de parâmetros
- Preservação de estrutura espacial  
- Robustez a deslocamentos na imagem
- Aplicabilidade para diferentes tipos de problemas

**Resposta:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### **Questão 24** (1,0 ponto)
Explique a diferença entre os tipos de **padding** em camadas convolucionais ('valid' vs 'same') e como isso afeta o tamanho da saída. Dê um exemplo prático.

**Resposta:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### **Questão 25** (1,0 ponto)
Descreva três **técnicas de regularização** estudadas nos laboratórios e explique como cada uma ajuda a prevenir overfitting em redes neurais.

**Resposta:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

## **PARTE IV - ANÁLISE DE CENÁRIO** (Total: 10,0 pontos)

### **Cenário Proposto:**
Você foi contratado para desenvolver um sistema de classificação de imagens médicas para detectar diferentes tipos de lesões de pele (melanoma, carcinoma basocelular, queratose actínica, etc.). O dataset disponível possui 5.000 imagens de alta resolução (512×512 pixels) distribuídas em 7 classes, mas com distribuição desbalanceada.

### **Questões do Cenário:**

**26.** Que tipo de arquitetura de rede neural você escolheria para este problema e por quê? (Justifique considerando as características do problema)

**27.** Quais técnicas de pré-processamento e Data Augmentation você aplicaria neste caso específico? (Considere que são imagens médicas)

**28.** Como você lidaria com o problema do dataset desbalanceado?

**29.** Que callbacks você configuraria durante o treinamento e com quais parâmetros aproximados?

**30.** Explique como você avaliaria a performance do modelo neste contexto médico. Que métricas seriam mais importantes além da acurácia?

---

**GABARITO DA PARTE I:**
1-b, 2-c, 3-b, 4-b, 5-c, 6-b, 7-c, 8-c, 9-b, 10-b

**GABARITO DA PARTE II:**
11-F, 12-V, 13-F, 14-V, 15-V, 16-V, 17-V, 18-V, 19-V, 20-F
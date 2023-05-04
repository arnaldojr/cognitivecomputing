# CHECKPOINT 3

Leia com atenção as instruções gerais sobre checkpoint;

O checkpoint3 é a cereja do bolo antes das férias e será sobre comunicação entre sistemas, no nosso caso Arduino e visão computacional.


## Descrição do problema:

O objetivo deste desafio é criar um sistema que utilize visão computacional em Python e um Arduino para realizar diferentes tarefas de acordo com o objetivo escolhido pelo grupo.

O grupo pode escolher entre três alternativas de objetivos: ``classificação de cores, detecção de mãos ou detecção de faces``. O sistema deve capturar imagens utilizando uma câmera e processá-las usando a biblioteca OpenCV e/ou Mediapipe. O sistema deve então comunicar-se com um Arduino via comunicação serial para realizar tarefas específicas com base no objetivo escolhido.

### Alternativas de objetivos:

- ``Classificação de cores``: O sistema deverá identificar e classificar objetos de diferentes cores e realizar ações específicas com base na cor identificada.
- ``Detecção de mãos com Mediapipe``: O sistema deverá detectar mãos em tempo real e identificar gestos específicos, realizando ações específicas com base nos gestos identificados.
- ``Detecção de faces``: O sistema deverá detectar faces em tempo real e realizar ações específicas com base na quantidade de faces detectadas ou nas características faciais (olho aberto/fechado, sorrindo..).

## Requisitos técnicos:

1. Utilização da linguagem Python para desenvolver a parte de visão computacional.
2. Utilização da biblioteca OpenCV para processar e analisar as imagens.
3. Comunicação serial entre o sistema de visão computacional em Python e o Arduino.
4. Implementação de tarefas específicas no Arduino com base na cor do objeto detectado.
5. Documentação em repositório github de forma clara e completa do projeto, incluindo instruções para replicar o sistema e testes realizados.

## Rubrica de avaliação:

### Funcionalidade (até 5 pontos)

- O sistema consegue capturar e processar imagens adequadamente.
- A comunicação serial entre o Python e o Arduino é estabelecida e funciona corretamente.
- O Arduino realiza as tarefas específicas de acordo com o objeto desejado.

### Qualidade do código (até 2 pontos)

- O código é bem estruturado e fácil de entender.
- Boas práticas de programação são utilizadas, incluindo comentários, nomes de variáveis e funções apropriados, facilitando a manutenção e a compreensão.


### Documentação (até 3 pontos)

- A documentação do projeto em repositório github de forma clara e completa, incluindo instruções para replicar o sistema.
- Video demonstrando o funcionamento do projeto de forma clara e completa.


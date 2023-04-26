## Conceitos básicos e introdutórios

A programação arduino não é complicada, vou apresentar alguns conceitos importante relacionados a software, ferramentas e hardware para te ajudar a embarcar nesse universo.

## Placa Arduino

Existem diversas placas e versões de Arduinos, vamos trabalhar com o mais simples e famoso, o Arduino UNO. Essa placa possui pinos que podem ser configurados como entradas e saidas para sensores atuadores ou para comunicação com outros sistemas de hardwares, como mostra a figura:

![](ArduinoUNO-hardware.jpg)

1. Microcontrolador - este é o cérebro de um Arduino, é nele que carregamos os programas. Pense nisso como um minúsculo computador, projetado para executar apenas um número específico de coisas.
2. Porta USB - usada para conectar sua placa Arduino a um computador.
3. Chip USB para Serial - o USB para Serial, responsável por fazer a conversão de protocolos, é um componente importante, pois é o que torna possível programar e comunicar a placa Arduino a partir do seu computador. 
4. Pinos digitais - pinos que usam lógica digital (0,1 ou LOW/HIGH). Comumente usado para chaves e para ligar/desligar um LED.
5. Pinos analógicos - pinos que podem ler valores analógicos em uma resolução de 10 bits (0-1023).
6. Pinos de 5V / 3,3V - esses pinos são usados para alimentar (energia) componentes externos.
7. GND - também conhecido como terra, negativo, Ground, é utilizado para completar um circuito, onde o nível elétrico está em 0 volt.
8. VIN - significa Voltage In, onde você pode conectar fontes de alimentação externas.

## Pinagem

A placa do Arduino UNO possui 14 pinos que podem ser configurados como Entrada/Saida (INPUT/OUTPUT) Digitai, 6 pinos de entrada Analogica com resolução de 10 bits, Alguns pinos podem ser configurados para funções especificas como Serial, PWM, SPI, TWI(I2C), ISR entre outros...   

![](Pinout-UNOrev3_latest.png)


## Software Embarcado

O software embarcado é o programa que define o funcionamento de um sistema embarcado, ou sejá, é o código que fica gravado no chip do Arduino. Ele é projetado para executar tarefas específicas, com um alto grau de eficiência e confiabilidade. De forma geral, a estrutura de um código segue um padrão, que pode ser dividido em três partes principais:

1. Inicialização: Nesta etapa, o código realiza a configuração inicial dos periféricos, como sensores e atuadores, e estabelece a comunicação com outros dispositivos ou sistemas. Isso inclui a configuração de pinos de entrada e saída, taxas de comunicação, entre outros, no Arduino inclue a "void setup()".
2. Laço de Repetição Infinito: O laço infinito, também conhecido no Arduino como "void loop()", é o coração do software embarcado. Ele é responsável por manter o programa em execução contínua, permitindo que o sistema embarcado execute suas tarefas de forma repetitiva e ininterrupta.
3. Interrupções: As interrupções são eventos que ocorrem de forma assíncrona ao laço infinito, permitindo que o software embarcado responda a eventos externos ou internos, como sinais de sensores ou temporizadores. Esses eventos são geralmente tratados por funções específicas chamadas rotinas de serviço de interrupção (ISR). 

Neste exemplo, a função "setup()" é responsável pela inicialização, enquanto a função "loop()" contém as tarefas a serem executadas repetidamente no laço infinito.

```c
int led = 13;

void setup(){
    pinMode(led,OUTPUT);
}
    
void loop(){
    digitalWrite(led, HIGH); 
    delay(1000); 
    digitalWrite(led, LOW); 
    delay(1000); 
}
```
A representação deste programa pode ser visualizada na figura abaixo: 

![](loop.png)

Para saber mais desse exemplo acesse: ``Laboratório -> IoT e Sistemas Embarcados --> Blink led``


## A linguagem arduino

A linguagem Arduino é propria MAS é baseada em C/C++ e simplifica a programação de microcontroladores através de um ambiente de desenvolvimento integrado (IDE) amigável e de fácil acesso.

Agumas semelhanças com as linguagens C/C++ (e outras tambem...) são:

 - Sintaxes e Estrutura básica: A estrutura básica do código Arduino, incluindo a definição de funções, variáveis, constantes e operadores, é semelhante à encontrada em C e C++.

 - Funções e bibliotecas: A linguagem Arduino permite a utilização de funções e bibliotecas padrão de C/C++, além de bibliotecas específicas para Arduino.

 - Ponteiros e alocação de memória: Assim como em C e C++, a linguagem Arduino permite o uso de ponteiros e a manipulação de memória, embora esses recursos sejam menos comuns em projetos de Arduino devido à sua complexidade e aos recursos limitados dos microcontroladores.

## Referencias

A comunidade Arduino é muito grande e gera muito material de qualidade, é facil encontrar foruns, tutoriais e videos que te auxiliam no aprendizado. De toda a forma, abaixo tem alguns link da documentação oficial que podem te ajudar.

- [https://www.arduino.cc/reference/en/?_gl=1*19zvap6*_ga*MTA5MDMxODM2My4xNjgyNTEwNDg3*_ga_NEXN8H46L5*MTY4MjUyNzkzMS4yLjEuMTY4MjUyODg0Ni4wLjAuMA..](https://www.arduino.cc/reference/en/?_gl=1*19zvap6*_ga*MTA5MDMxODM2My4xNjgyNTEwNDg3*_ga_NEXN8H46L5*MTY4MjUyNzkzMS4yLjEuMTY4MjUyODg0Ni4wLjAuMA..)
- [https://docs.arduino.cc/learn/starting-guide/getting-started-arduino#general](https://docs.arduino.cc/learn/starting-guide/getting-started-arduino#general)
- 

# Módulo 9: Interrupções e Timers

Bem-vindo ao **Módulo 9** do curso **"Programação em Arduino: Conceitos Fundamentais sem Hardware"**. Neste módulo, você irá explorar as **interrupções** e **timers** na linguagem de programação Arduino (C/C++). Esses conceitos são essenciais para criar programas responsivos e eficientes, capazes de lidar com eventos assíncronos e temporizações precisas.

---

## Objetivos do Módulo

- Compreender o conceito de interrupções e sua importância na programação Arduino.
- Aprender a configurar e utilizar interrupções externas e internas.
- Entender o funcionamento dos timers e como utilizá-los para gerar eventos temporizados.
- Implementar aplicações que utilizam interrupções e timers para melhorar a eficiência e a responsividade do programa.
- Resolver exercícios práticos para consolidar o conhecimento sobre interrupções e timers.

---

## 1. Introdução a Interrupções e Timers

### 1.1 O que são Interrupções?

**Interrupções** são sinais que indicam a ocorrência de um evento que requer atenção imediata do processador. Quando uma interrupção ocorre, o fluxo normal do programa é temporariamente interrompido para executar uma rotina de tratamento específica, conhecida como **ISR (Interrupt Service Routine)**. Após a execução da ISR, o programa retorna ao ponto onde foi interrompido.

### 1.2 Por que Usar Interrupções?

- **Responsividade:** Permite que o microcontrolador reaja rapidamente a eventos externos sem a necessidade de verificar constantemente o estado de entradas.
- **Eficiência:** Reduz o consumo de CPU, já que o processador pode executar outras tarefas enquanto espera por eventos.
- **Precisão:** Garante que eventos críticos sejam tratados imediatamente, aumentando a precisão das operações temporizadas.

### 1.3 O que são Timers?

**Timers** são módulos internos que contam ciclos de clock e geram eventos após um determinado período. Eles são usados para criar temporizações precisas, gerar sinais PWM, ou criar delays sem bloquear a execução do programa principal.

---

## 2. Trabalhando com Interrupções

### 2.1 Tipos de Interrupções no Arduino

- **Interrupções Externas:** Disparadas por sinais em pinos específicos (por exemplo, botões ou sensores).
- **Interrupções Internas:** Disparadas por eventos internos, como overflow de timers ou comunicação serial.

### 2.2 Configuração de Interrupções Externas

Os Arduinos possuem pinos específicos que suportam interrupções externas. Por exemplo, no Arduino Uno, os pinos 2 e 3 são comumente usados para esse propósito.

**Sintaxe:**

```cpp
attachInterrupt(digitalPinToInterrupt(pino), nomeISR, modo);
```

- **pino:** Número do pino que receberá a interrupção.
- **nomeISR:** Nome da função que será chamada quando a interrupção ocorrer.
- **modo:** Condição que dispara a interrupção (`LOW`, `CHANGE`, `RISING`, `FALLING`).

**Exemplo Prático:**

```cpp
volatile bool botaoPressionado = false;

void botaoISR() {
    botaoPressionado = true;
}

void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT_PULLUP); // Botão conectado ao pino 2
    attachInterrupt(digitalPinToInterrupt(2), botaoISR, FALLING);
}

void loop() {
    if(botaoPressionado) {
        Serial.println("Botão pressionado!");
        botaoPressionado = false;
    }
}
```

**Explicação:**

- **`volatile`:** Indica que a variável pode ser alterada por uma ISR, evitando otimizações que poderiam ignorar mudanças.
- **`botaoISR`:** ISR que altera o estado da variável `botaoPressionado` quando o botão é pressionado.
- **`attachInterrupt`:** Configura a interrupção no pino 2 para detectar bordas de descida (`FALLING`).

### 2.3 Boas Práticas com ISRs

- **Mantenha as ISRs Curtas:** Execute apenas o necessário dentro da ISR para evitar atrasos no processamento.
- **Use Variáveis Voláteis:** Variáveis compartilhadas entre a ISR e o loop principal devem ser declaradas como `volatile`.
- **Evite Funções Complexas:** Evite chamadas a funções que dependem de interrupções, como `Serial.print()`, dentro da ISR.

---

## 3. Trabalhando com Timers

### 3.1 Tipos de Timers no Arduino

- **Timer0:** Usado pelo `millis()` e `delay()`. Não deve ser alterado para evitar conflitos.
- **Timer1:** Um timer de 16 bits, ideal para aplicações que requerem precisão.
- **Timer2:** Um timer de 8 bits, útil para tarefas menos precisas.

### 3.2 Configuração de Timer1 para Gerar uma Interrupção

**Exemplo Prático:**

```cpp
volatile unsigned long contador = 0;

ISR(TIMER1_COMPA_vect) {
    contador++;
}

void setup() {
    Serial.begin(9600);

    // Configura Timer1 para CTC mode (Clear Timer on Compare Match)
    TCCR1A = 0;
    TCCR1B = 0;
    TCCR1B |= (1 << WGM12);

    // Define valor de comparação para gerar interrupção a cada 1 segundo
    OCR1A = 15624; // (16MHz / (Prescaler * Desired Frequency)) - 1
    TCCR1B |= (1 << CS12) | (1 << CS10); // Prescaler = 1024
    TIMSK1 |= (1 << OCIE1A); // Habilita interrupção por comparação

    sei(); // Habilita interrupções globais
}

void loop() {
    if(contador >= 5) { // Após 5 segundos
        Serial.println("5 segundos se passaram!");
        contador = 0;
    }
}
```

**Explicação:**

- **CTC Mode:** Configura o timer para limpar o contador quando atingir o valor de comparação.
- **OCR1A:** Define o valor de comparação para gerar uma interrupção a cada segundo.
- **Prescaler:** Reduz a frequência do clock do timer para atingir a temporização desejada.
- **`sei()`:** Habilita interrupções globais.
- **`ISR(TIMER1_COMPA_vect)`:** ISR chamada a cada vez que o timer atinge o valor de comparação, incrementando o contador.

### 3.3 Gerando PWM com Timers

Os timers também podem ser usados para gerar sinais PWM (Pulse Width Modulation) com maior precisão ou em pinos específicos.

**Exemplo Prático:**

```cpp
void setup() {
    // Configura o pino 9 como saída (usado pelo Timer1)
    pinMode(9, OUTPUT);

    // Configura Timer1 para Fast PWM mode
    TCCR1A |= (1 << COM1A1) | (1 << WGM11);
    TCCR1B |= (1 << WGM13) | (1 << WGM12) | (1 << CS10); // Prescaler = 1
    ICR1 = 19999; // Define frequência de 50Hz (usando 16MHz)

    // Define o ciclo de trabalho (Duty Cycle) para 7.5% (posição neutra)
    OCR1A = 1500; // 1.5ms pulse width
}

void loop() {
    // Pode ajustar OCR1A para alterar o ciclo de trabalho
}
```

**Explicação:**

- **Fast PWM Mode:** Configura o timer para modo de PWM rápido, permitindo uma frequência estável.
- **ICR1:** Define o período do PWM (por exemplo, 20ms para 50Hz).
- **OCR1A:** Define a largura do pulso, controlando o ciclo de trabalho.
- **PWM Aplicação:** Comumente usado para controlar servos ou LEDs com brilho ajustável.

---

## 4. Exemplos Práticos

### 4.1 Monitorando um Sensor com Interrupção

```cpp
volatile float leituraSensor = 0.0;

void sensorISR() {
    leituraSensor = analogRead(A0);
}

void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT_PULLUP); // Sensor conectado ao pino 2

    attachInterrupt(digitalPinToInterrupt(2), sensorISR, FALLING);
}

void loop() {
    if(leituraSensor > 0) {
        Serial.print("Leitura do Sensor: ");
        Serial.println(leituraSensor);
        leituraSensor = 0.0;
    }
}
```

**Explicação:**

- **`sensorISR`:** ISR que lê o valor analógico do sensor quando ocorre uma interrupção no pino 2.
- **Loop Principal:** Verifica se uma nova leitura está disponível e a imprime no Monitor Serial.

### 4.2 Blink com Timer1

```cpp
volatile bool toggle = false;

ISR(TIMER1_COMPA_vect) {
    toggle = !toggle;
}

void setup() {
    pinMode(13, OUTPUT);
    
    // Configura Timer1 para CTC mode
    TCCR1A = 0;
    TCCR1B = 0;
    TCCR1B |= (1 << WGM12);

    // Define valor de comparação para 1Hz
    OCR1A = 15624;
    TCCR1B |= (1 << CS12) | (1 << CS10); // Prescaler = 1024
    TIMSK1 |= (1 << OCIE1A); // Habilita interrupção

    sei(); // Habilita interrupções globais
}

void loop() {
    if(toggle) {
        digitalWrite(13, HIGH);
    } else {
        digitalWrite(13, LOW);
    }
}
```

**Explicação:**

- **ISR `TIMER1_COMPA_vect`:** Alterna o estado da variável `toggle` a cada segundo.
- **Loop Principal:** Liga ou desliga o LED conectado ao pino 13 com base no estado de `toggle`.

---

## 5. Exercícios Práticos

### Exercício 1: Contador de Pulsos com Interrupção

- **Tarefa:** Crie um programa que conta o número de pulsos recebidos em um pino específico usando interrupções e exibe o contador no Monitor Serial a cada segundo.

- **Dicas:**
  - Use Timer1 para criar uma interrupção a cada segundo.
  - Use uma ISR externa para contar os pulsos.

- **Exemplo de Código:**

```cpp
volatile unsigned int contadorPulsos = 0;
volatile bool atualizarDisplay = false;

// ISR para contar pulsos no pino 2
void pulseISR() {
    contadorPulsos++;
}

// ISR para Timer1 a cada segundo
ISR(TIMER1_COMPA_vect) {
    atualizarDisplay = true;
}

void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT_PULLUP); // Pino de entrada para pulsos
    attachInterrupt(digitalPinToInterrupt(2), pulseISR, RISING);

    // Configura Timer1 para CTC mode
    TCCR1A = 0;
    TCCR1B = 0;
    TCCR1B |= (1 << WGM12);

    OCR1A = 15624; // Para 1 segundo
    TCCR1B |= (1 << CS12) | (1 << CS10); // Prescaler = 1024
    TIMSK1 |= (1 << OCIE1A); // Habilita interrupção por comparação

    sei(); // Habilita interrupções globais
}

void loop() {
    if(atualizarDisplay) {
        Serial.print("Pulsos por segundo: ");
        Serial.println(contadorPulsos);
        contadorPulsos = 0;
        atualizarDisplay = false;
    }
}
```

### Exercício 2: PWM Controlado por Timer

- **Tarefa:** Desenvolva um programa que ajusta a intensidade de um LED usando PWM controlado por Timer1, permitindo aumentar e diminuir o brilho a cada 500ms.

- **Dicas:**
  - Configure Timer1 para gerar PWM em um pino específico.
  - Use uma ISR para alterar o ciclo de trabalho periodicamente.

- **Exemplo de Código:**

```cpp
volatile int cicloTrabalho = 128; // Valor inicial (50%)

ISR(TIMER1_COMPA_vect) {
    cicloTrabalho += 32;
    if(cicloTrabalho > 255) {
        cicloTrabalho = 0;
    }
    OCR1A = cicloTrabalho;
}

void setup() {
    pinMode(9, OUTPUT); // LED conectado ao pino 9

    // Configura Timer1 para Fast PWM mode
    TCCR1A |= (1 << COM1A1) | (1 << WGM11);
    TCCR1B |= (1 << WGM13) | (1 << WGM12) | (1 << CS12); // Prescaler = 256
    ICR1 = 4999; // Define período para 500ms (supondo 16MHz)

    OCR1A = cicloTrabalho; // Define ciclo de trabalho inicial

    // Configura interrupção para alterar ciclo de trabalho
    TIMSK1 |= (1 << OCIE1A);
    sei(); // Habilita interrupções globais
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- **ISR `TIMER1_COMPA_vect`:** Incrementa o ciclo de trabalho do PWM a cada 500ms, alterando o brilho do LED.
- **PWM no Pino 9:** Controla a intensidade do LED usando PWM gerado pelo Timer1.

### Exercício 3: Debounce de Botão com Interrupção

- **Tarefa:** Implemente um sistema que detecta pressionamentos de botão usando interrupções, com debounce para evitar múltiplas detecções indesejadas.

- **Dicas:**
  - Use uma variável para armazenar o último tempo de interrupção.
  - Ignore interrupções que ocorram muito próximas umas das outras.

- **Exemplo de Código:**

```cpp
volatile bool botaoPressionado = false;
unsigned long ultimoTempo = 0;
const unsigned long debounceDelay = 200; // 200ms

void botaoISR() {
    unsigned long tempoAtual = millis();
    if (tempoAtual - ultimoTempo > debounceDelay) {
        botaoPressionado = true;
        ultimoTempo = tempoAtual;
    }
}

void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT_PULLUP); // Botão conectado ao pino 2
    attachInterrupt(digitalPinToInterrupt(2), botaoISR, FALLING);
}

void loop() {
    if(botaoPressionado) {
        Serial.println("Botão pressionado!");
        botaoPressionado = false;
    }
}
```

**Explicação:**

- **Debounce:** Garante que apenas pressões de botão com intervalo maior que `debounceDelay` sejam consideradas válidas.
- **ISR `botaoISR`:** Marca que o botão foi pressionado se o debounce permitir.

---

## 6. Conceitos Importantes

### 6.1 ISR (Interrupt Service Routine)

- **Definição:** Funções que são chamadas automaticamente em resposta a interrupções.
- **Características:**
  - Não podem retornar valores.
  - Devem ser rápidas e eficientes.
  - Devem evitar o uso de funções que dependem de interrupções, como `Serial.print()`.

### 6.2 Aritmética de Ponteiros e Timers

- **Aritmética de Ponteiros:** Permite navegar por arrays e estruturas de dados de forma eficiente.
- **Timers:** Facilitam a criação de temporizações precisas e a geração de sinais PWM.

### 6.3 Gerenciamento de Tempo

- **Uso de Timers e `millis()`:** Evita o bloqueio do loop principal, permitindo a execução de múltiplas tarefas simultaneamente.
- **Comparação com `delay()`:** `delay()` bloqueia a execução, enquanto timers e interrupções permitem um controle mais granular e eficiente.

### 6.4 Boas Práticas com Interrupções e Timers

- **Minimize o Código nas ISRs:** Execute apenas o essencial dentro das ISRs para evitar atrasos no processamento.
- **Evite Variáveis Complexas:** Use variáveis simples e do tipo `volatile` para comunicação entre ISRs e o loop principal.
- **Gerencie a Memória dos Timers:** Configure corretamente os timers para evitar conflitos e sobrecargas.

---

## 7. Recursos Adicionais

- **Documentação Oficial do Arduino:**
  
  - [Interrupções](https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/)
  - [Timers](https://www.arduino.cc/reference/en/language/functions/time/timers/)

- **Tutoriais e Guias:**
  
  - [Guia Completo de Interrupções no Arduino](https://www.arduino.cc/en/Tutorial/BuiltInExamples/Interrupt)
  - [Manipulação Avançada de Timers](https://www.arduino.cc/en/Tutorial/Timer1Interrupt)

- **Vídeos Educacionais:**
  
  - [Entendendo Interrupções no Arduino](https://www.youtube.com/watch?v=XYZ123)
  - [Timers e PWM Avançados](https://www.youtube.com/watch?v=ABC456)

---

## 8. Exercícios Práticos

### Exercício 1: LED Pisca com Timer e Interrupção

- **Tarefa:** Crie um programa que faz um LED piscar a cada 250ms usando Timer1 e uma interrupção.

- **Dicas:**
  - Configure Timer1 para gerar interrupções a cada 250ms.
  - Use uma ISR para alternar o estado do LED.

- **Exemplo de Código:**

```cpp
volatile bool ledEstado = false;

ISR(TIMER1_COMPA_vect) {
    ledEstado = !ledEstado;
}

void setup() {
    pinMode(13, OUTPUT);
    // Configura Timer1 para CTC mode
    TCCR1A = 0;
    TCCR1B = 0;
    TCCR1B |= (1 << WGM12);
    
    OCR1A = 3906; // Para 250ms (16MHz / (Prescaler * Desired Frequency)) - 1
    TCCR1B |= (1 << CS12) | (1 << CS10); // Prescaler = 1024
    TIMSK1 |= (1 << OCIE1A); // Habilita interrupção por comparação
    
    sei(); // Habilita interrupções globais
}

void loop() {
    digitalWrite(13, ledEstado ? HIGH : LOW);
}
```

### Exercício 2: Leitura de Sensor com Interrupção

- **Tarefa:** Desenvolva um programa que lê um valor de sensor sempre que um botão é pressionado, usando interrupções para detectar o pressionamento.

- **Dicas:**
  - Use uma ISR externa para detectar o botão.
  - Armazene o valor do sensor em uma variável `volatile`.

- **Exemplo de Código:**

```cpp
volatile bool lerSensor = false;
volatile int valorSensor = 0;

void botaoISR() {
    lerSensor = true;
}

void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT_PULLUP); // Botão conectado ao pino 2
    attachInterrupt(digitalPinToInterrupt(2), botaoISR, FALLING);
}

void loop() {
    if(lerSensor) {
        valorSensor = analogRead(A0);
        Serial.print("Valor do Sensor: ");
        Serial.println(valorSensor);
        lerSensor = false;
    }
}
```

### Exercício 3: Controlar Servo com Timer e Interrupção

- **Tarefa:** Implemente um sistema que controla a posição de um servo motor utilizando Timer1 e interrupções para ajustar a posição a cada 500ms.

- **Dicas:**
  - Use uma ISR para alterar o ângulo do servo.
  - Utilize a biblioteca `Servo` para facilitar o controle do servo.

- **Exemplo de Código:**

```cpp
#include <Servo.h>

Servo meuServo;
volatile int angulo = 0;

ISR(TIMER1_COMPA_vect) {
    angulo += 10;
    if(angulo > 180) {
        angulo = 0;
    }
    meuServo.write(angulo);
}

void setup() {
    meuServo.attach(9); // Servo conectado ao pino 9
    meuServo.write(angulo);
    
    // Configura Timer1 para CTC mode
    TCCR1A = 0;
    TCCR1B = 0;
    TCCR1B |= (1 << WGM12);
    
    OCR1A = 15624; // Para 1 segundo
    TCCR1B |= (1 << CS12) | (1 << CS10); // Prescaler = 1024
    TIMSK1 |= (1 << OCIE1A); // Habilita interrupção por comparação
    
    sei(); // Habilita interrupções globais
}

void loop() {
    // Não há código no loop
}
```

---

## 9. Conceitos Importantes

### 9.1 Variáveis Voláteis

- **Definição:** Variáveis declaradas como `volatile` informam ao compilador que seu valor pode mudar a qualquer momento, prevenindo otimizações que poderiam ignorar atualizações provenientes de ISRs.
  
  ```cpp
  volatile int contador = 0;
  ```

### 9.2 Prioridade de Interrupções

- **Definição:** Em sistemas com múltiplas interrupções, a prioridade determina qual ISR será executada primeiro.
- **Considerações:**
  - No Arduino, todas as interrupções têm a mesma prioridade.
  - Planeje o uso de interrupções de forma que não haja conflito entre diferentes ISRs.

### 9.3 Uso de Funções nas ISRs

- **Limitações:** Evite usar funções que não sejam seguras para serem chamadas dentro de uma ISR, como `Serial.print()`.
- **Alternativas:** Utilize flags (`bool`) para indicar ao loop principal que uma ação deve ser executada.

### 9.4 Configuração Correta dos Timers

- **Importância:** Configurações incorretas dos timers podem levar a temporizações erradas ou ao não funcionamento das interrupções.
- **Verifique:**
  - Modo de operação (CTC, Fast PWM, etc.).
  - Prescaler adequado para a temporização desejada.
  - Valores de comparação (`OCRnA`).

### 9.5 Boas Práticas com Interrupções e Timers

- **Evite Loops Longos nas ISRs:** Mantenha as ISRs curtas e rápidas.
- **Use Variáveis Voláteis para Comunicação:** Utilize variáveis `volatile` para comunicar eventos entre ISRs e o loop principal.
- **Gerencie a Prioridade e Frequência de Interrupções:** Planeje a frequência de interrupções para evitar sobrecarga no processador.

---

## 10. Recursos Adicionais

- **Documentação Oficial do Arduino:**
  
  - [Interrupções](https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/)
  - [Timers](https://www.arduino.cc/reference/en/language/functions/time/timers/)

- **Tutoriais e Guias:**
  
  - [Guia Completo de Interrupções no Arduino](https://www.arduino.cc/en/Tutorial/BuiltInExamples/Interrupt)
  - [Manipulação Avançada de Timers](https://www.arduino.cc/en/Tutorial/Timer1Interrupt)

- **Vídeos Educacionais:**
  
  - [Entendendo Interrupções no Arduino](https://www.youtube.com/watch?v=V7aH7Zeo79Q)
  - [Timers e PWM Avançados](https://www.youtube.com/watch?v=3dWk6mP2f8g)

---

## 11. Conclusão do Módulo

Neste módulo, você aprendeu:

- O que são interrupções e timers e sua importância na programação Arduino.
- Como configurar e utilizar interrupções externas para reagir a eventos assíncronos.
- Como configurar e utilizar timers para criar temporizações precisas e gerar sinais PWM.
- Boas práticas para implementar ISRs eficientes e seguras.
- Como integrar interrupções e timers em projetos reais para melhorar a responsividade e eficiência.
- Praticou com exemplos e exercícios que reforçam o entendimento das interrupções e timers.

Você está agora preparado para avançar para o próximo módulo, onde exploraremos **Comunicação Serial Avançada**, aprofundando seu conhecimento em protocolos de comunicação e troca de dados entre dispositivos Arduino e computadores.

---

## 12. Próximos Passos

- **Revisar o conteúdo deste módulo e certificar-se de que compreendeu os conceitos apresentados.**
- **Completar os exercícios propostos para consolidar o aprendizado.**
- **Preparar-se para o Módulo 10: Comunicação Serial Avançada.**
  
Se tiver dúvidas ou precisar de assistência, não hesite em procurar recursos adicionais ou participar de comunidades de aprendizagem para obter suporte.

---

**Bom trabalho e continue assim!**

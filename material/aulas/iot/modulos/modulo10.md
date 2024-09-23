# Módulo 10: Comunicação Serial Avançada

Bem-vindo ao **Módulo 10** do curso **"Programação em Arduino: Conceitos Fundamentais sem Hardware"**. Neste módulo, você irá aprofundar seu conhecimento sobre **comunicação serial** na linguagem de programação Arduino (C/C++). A comunicação serial é essencial para a troca de dados entre o Arduino e outros dispositivos, como computadores, módulos de comunicação e outros microcontroladores.

---

## Objetivos do Módulo

- Compreender os conceitos avançados de comunicação serial.
- Aprender a configurar e utilizar diferentes protocolos de comunicação serial, incluindo UART, I2C e SPI.
- Implementar comunicação serial entre múltiplos dispositivos Arduino.
- Utilizar a biblioteca `SoftwareSerial` para criar portas seriais adicionais.
- Gerenciar a transferência e o parsing de dados de forma eficiente.
- Resolver exercícios práticos para consolidar o conhecimento sobre comunicação serial avançada.

---

## 1. Introdução à Comunicação Serial Avançada

### 1.1 Revisão da Comunicação Serial Básica

Anteriormente, aprendemos a utilizar o Monitor Serial para enviar e receber dados entre o Arduino e o computador. Neste módulo, expandiremos esse conhecimento para incluir comunicação entre dispositivos e utilização de protocolos mais complexos.

### 1.2 Importância da Comunicação Serial Avançada

- **Interconectividade:** Permite que o Arduino se comunique com uma variedade de dispositivos, como sensores avançados, módulos de comunicação (Wi-Fi, Bluetooth) e outros microcontroladores.
- **Controle Remoto:** Facilita o controle e monitoramento do Arduino a partir de dispositivos externos.
- **Transferência de Dados:** Habilita a troca eficiente de grandes volumes de dados entre dispositivos.

---

## 2. Protocolos de Comunicação Serial

### 2.1 UART (Universal Asynchronous Receiver/Transmitter)

**UART** é um protocolo de comunicação serial assíncrona que utiliza dois fios principais: TX (transmissão) e RX (recepção).

**Características:**

- Comunicação ponto a ponto.
- Não requer um relógio compartilhado.
- Configurações comuns: baud rate, paridade, bits de dados e bits de parada.

**Exemplo de Configuração UART:**

˜˜˜cpp
void setup() {
    Serial.begin(9600); // Inicializa a comunicação serial a 9600 baud
}

void loop() {
    if (Serial.available() > 0) {
        char recebido = Serial.read();
        Serial.print("Você digitou: ");
        Serial.println(recebido);
    }
}
˜˜˜

### 2.2 I2C (Inter-Integrated Circuit)

**I2C** é um protocolo de comunicação serial síncrona que utiliza dois fios: SDA (Serial Data) e SCL (Serial Clock).

**Características:**

- Comunicação multi-mestre e multi-escravo.
- Utiliza endereçamento para identificar dispositivos.
- Ideal para comunicação com sensores e dispositivos que possuem suporte a I2C.

**Exemplo de Comunicação I2C:**

˜˜˜cpp
#include <Wire.h>

void setup() {
    Wire.begin(); // Inicia o I2C como mestre
    Serial.begin(9600);
}

void loop() {
    Wire.beginTransmission(8); // Endereço do dispositivo escravo
    Wire.write("Hello");
    Wire.endTransmission();
    delay(1000);
}
˜˜˜

### 2.3 SPI (Serial Peripheral Interface)

**SPI** é um protocolo de comunicação serial síncrona que utiliza quatro fios: MOSI (Master Out Slave In), MISO (Master In Slave Out), SCK (Serial Clock) e SS (Slave Select).

**Características:**

- Comunicação full-duplex.
- Alta velocidade de transferência de dados.
- Utilizado para comunicação com dispositivos de alta velocidade, como cartões SD e displays LCD.

**Exemplo de Comunicação SPI:**

˜˜˜cpp
#include <SPI.h>

void setup() {
    SPI.begin(); // Inicia o SPI como mestre
    pinMode(10, OUTPUT); // SS
    digitalWrite(10, HIGH);
    Serial.begin(9600);
}

void loop() {
    digitalWrite(10, LOW);
    SPI.transfer(0xFF); // Envia byte
    digitalWrite(10, HIGH);
    delay(1000);
}
˜˜˜

---

## 3. Comunicação Serial Entre Múltiplos Dispositivos Arduino

### 3.1 Comunicação UART Entre Dois Arduinos

**Configuração:**

- Conectar o pino TX do Arduino A ao pino RX do Arduino B.
- Conectar o pino RX do Arduino A ao pino TX do Arduino B.
- Conectar GND entre os dois Arduinos.

**Exemplo de Código para o Arduino A (Transmissor):**

˜˜˜cpp
void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.println("Olá Arduino B!");
    delay(1000);
}
˜˜˜

**Exemplo de Código para o Arduino B (Receptor):**

˜˜˜cpp
void setup() {
    Serial.begin(9600);
}

void loop() {
    if (Serial.available() > 0) {
        String mensagem = Serial.readString();
        Serial.print("Recebi: ");
        Serial.println(mensagem);
    }
}
˜˜˜

### 3.2 Comunicação I2C Entre Múltiplos Dispositivos Arduino

**Configuração:**

- Conectar SDA a SDA e SCL a SCL entre os Arduinos.
- Definir endereços únicos para cada dispositivo escravo.

**Exemplo de Código para o Arduino Mestre:**

˜˜˜cpp
#include <Wire.h>

void setup() {
    Wire.begin(); // Inicia como mestre
    Serial.begin(9600);
}

void loop() {
    Wire.beginTransmission(8); // Endereço do escravo
    Wire.write("Dados do Mestre");
    Wire.endTransmission();
    delay(1000);
}
˜˜˜

**Exemplo de Código para o Arduino Escravo:**

˜˜˜cpp
#include <Wire.h>

void setup() {
    Wire.begin(8); // Endereço do escravo
    Wire.onReceive(receiveEvent);
    Serial.begin(9600);
}

void loop() {
    // Não há código no loop
}

void receiveEvent(int bytes) {
    while (Wire.available()) {
        char c = Wire.read();
        Serial.print(c);
    }
    Serial.println();
}
˜˜˜

---

## 4. Utilizando a Biblioteca `SoftwareSerial`

A biblioteca `SoftwareSerial` permite criar portas seriais adicionais em pinos digitais, permitindo comunicação com múltiplos dispositivos seriais.

### 4.1 Configuração da `SoftwareSerial`

**Exemplo de Uso:**

˜˜˜cpp
#include <SoftwareSerial.h>

// Define os pinos RX e TX para a SoftwareSerial
SoftwareSerial meuSerial(10, 11); // RX, TX

void setup() {
    Serial.begin(9600);        // Porta serial padrão
    meuSerial.begin(4800);     // Porta serial adicional
    Serial.println("Iniciando comunicação serial...");
}

void loop() {
    if (meuSerial.available()) {
        char c = meuSerial.read();
        Serial.print("Recebi via SoftwareSerial: ");
        Serial.println(c);
    }
    
    if (Serial.available()) {
        char c = Serial.read();
        meuSerial.print(c);
    }
}
˜˜˜

**Explicação:**

- **Definição:** `SoftwareSerial meuSerial(10, 11);` define pinos 10 e 11 como RX e TX adicionais.
- **Inicialização:** `meuSerial.begin(4800);` configura a velocidade da porta serial adicional.
- **Transferência de Dados:** Dados recebidos na `SoftwareSerial` são enviados para a porta serial padrão e vice-versa.

---

## 5. Gerenciamento de Transferência e Parsing de Dados

### 5.1 Formatação de Dados

Para uma comunicação eficiente, é importante definir um protocolo de formatação de dados, utilizando delimitadores ou estruturas específicas.

**Exemplo de Dados Delimitados por Vírgulas:**

˜˜˜cpp
String dados = "23.5,47.8,15.2"; // Temperatura, Umidade, Pressão
Serial.println(dados);
˜˜˜

### 5.2 Parsing de Dados Recebidos

No lado receptor, os dados podem ser divididos e convertidos para os tipos apropriados.

**Exemplo de Parsing:**

˜˜˜cpp
void setup() {
    Serial.begin(9600);
}

void loop() {
    if (Serial.available() > 0) {
        String recebidos = Serial.readStringUntil('\n');
        int primeiraVirgula = recebidos.indexOf(',');
        int segundaVirgula = recebidos.indexOf(',', primeiraVirgula + 1);
        
        float temperatura = recebidos.substring(0, primeiraVirgula).toFloat();
        float umidade = recebidos.substring(primeiraVirgula + 1, segundaVirgula).toFloat();
        float pressao = recebidos.substring(segundaVirgula + 1).toFloat();
        
        Serial.print("Temperatura: ");
        Serial.println(temperatura);
        Serial.print("Umidade: ");
        Serial.println(umidade);
        Serial.print("Pressão: ");
        Serial.println(pressao);
    }
}
˜˜˜

**Explicação:**

- **Delimitação:** Utiliza vírgulas para separar os valores.
- **Parsing:** Usa `indexOf` e `substring` para extrair e converter os valores para `float`.

---

## 6. Comunicação Serial com Múltiplos Dispositivos

### 6.1 Comunicação entre Arduino e Computador via Serial USB

O Arduino pode se comunicar com o computador através da porta USB utilizando a porta serial padrão.

**Exemplo de Envio de Dados para o Computador:**

˜˜˜cpp
void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.println("Dados do Arduino");
    delay(1000);
}
˜˜˜

### 6.2 Comunicação entre Arduino e Módulos Bluetooth

Utilizando módulos como o HC-05, o Arduino pode se comunicar sem fio com dispositivos como smartphones.

**Exemplo de Configuração com `SoftwareSerial`:**

˜˜˜cpp
#include <SoftwareSerial.h>

SoftwareSerial bluetooth(10, 11); // RX, TX

void setup() {
    Serial.begin(9600);
    bluetooth.begin(9600);
    Serial.println("Conectado ao Bluetooth.");
}

void loop() {
    if (bluetooth.available()) {
        char c = bluetooth.read();
        Serial.print("Recebi via Bluetooth: ");
        Serial.println(c);
    }
    
    if (Serial.available()) {
        char c = Serial.read();
        bluetooth.print(c);
    }
}
˜˜˜

**Explicação:**

- **Definição:** Pinos 10 e 11 são usados para comunicação serial com o módulo Bluetooth.
- **Transferência de Dados:** Dados recebidos do Bluetooth são enviados para o Monitor Serial e vice-versa.

---

## 7. Exemplos Práticos

### 7.1 Comunicação Serial Entre Dois Arduinos Usando I2C

˜˜˜cpp
// Código para o Arduino Mestre
#include <Wire.h>

void setup() {
    Wire.begin(); // Inicia como mestre
    Serial.begin(9600);
}

void loop() {
    Wire.beginTransmission(8); // Endereço do escravo
    Wire.write("Dados do Mestre");
    Wire.endTransmission();
    delay(1000);
}
˜˜˜

˜˜˜cpp
// Código para o Arduino Escravo
#include <Wire.h>

void setup() {
    Wire.begin(8); // Endereço do escravo
    Wire.onReceive(receiveEvent);
    Serial.begin(9600);
}

void loop() {
    // Não há código no loop
}

void receiveEvent(int bytes) {
    while (Wire.available()) {
        char c = Wire.read();
        Serial.print(c);
    }
    Serial.println();
}
˜˜˜

**Explicação:**

- **Mestre:** Envia uma string "Dados do Mestre" para o escravo a cada segundo.
- **Escravo:** Recebe os dados e os imprime no Monitor Serial.

### 7.2 Utilizando `SoftwareSerial` para Comunicação com um Módulo Bluetooth

˜˜˜cpp
#include <SoftwareSerial.h>

SoftwareSerial bluetooth(10, 11); // RX, TX

void setup() {
    Serial.begin(9600);
    bluetooth.begin(9600);
    Serial.println("Conectado ao Bluetooth.");
}

void loop() {
    if (bluetooth.available()) {
        char c = bluetooth.read();
        Serial.print("Recebi via Bluetooth: ");
        Serial.println(c);
    }
    
    if (Serial.available()) {
        char c = Serial.read();
        bluetooth.print(c);
    }
}
˜˜˜

**Explicação:**

- **Envio e Recebimento:** Permite enviar e receber dados entre o Arduino e um dispositivo Bluetooth, como um smartphone, utilizando a porta serial adicional criada pela biblioteca `SoftwareSerial`.

### 7.3 Comunicação Serial com Parsing de Dados Delimitados

˜˜˜cpp
void setup() {
    Serial.begin(9600);
    Serial.println("Envie dados no formato: temperatura,umidade,pressao");
}

void loop() {
    if (Serial.available() > 0) {
        String recebidos = Serial.readStringUntil('\n');
        int primeiraVirgula = recebidos.indexOf(',');
        int segundaVirgula = recebidos.indexOf(',', primeiraVirgula + 1);
        
        if (primeiraVirgula > 0 && segundaVirgula > primeiraVirgula) {
            float temperatura = recebidos.substring(0, primeiraVirgula).toFloat();
            float umidade = recebidos.substring(primeiraVirgula + 1, segundaVirgula).toFloat();
            float pressao = recebidos.substring(segundaVirgula + 1).toFloat();
            
            Serial.print("Temperatura: ");
            Serial.println(temperatura);
            Serial.print("Umidade: ");
            Serial.println(umidade);
            Serial.print("Pressão: ");
            Serial.println(pressao);
        } else {
            Serial.println("Formato inválido. Tente novamente.");
        }
    }
}
˜˜˜

**Explicação:**

- **Formato de Dados:** Espera uma string no formato "temperatura,umidade,pressao".
- **Parsing:** Divide a string com base nas vírgulas e converte os segmentos para `float`.
- **Validação:** Verifica se o formato dos dados está correto antes de processar.

---

## 8. Exercícios Práticos

### Exercício 1: Comunicação Serial Entre Arduino e PC com Comando de Controle

- **Tarefa:** Crie um programa onde o Arduino recebe comandos do computador via Serial para ligar e desligar um LED. Use comandos como "LIGAR" e "DESLIGAR".

- **Dicas:**
  - Utilize `Serial.readStringUntil('\n')` para ler comandos completos.
  - Compare strings para identificar o comando recebido.

- **Exemplo de Código:**

˜˜˜cpp
const int ledPin = 13;

void setup() {
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);
    Serial.println("Digite 'LIGAR' ou 'DESLIGAR' para controlar o LED.");
}

void loop() {
    if (Serial.available() > 0) {
        String comando = Serial.readStringUntil('\n');
        comando.trim(); // Remove espaços em branco
        
        if (comando.equalsIgnoreCase("LIGAR")) {
            digitalWrite(ledPin, HIGH);
            Serial.println("LED Ligado.");
        } else if (comando.equalsIgnoreCase("DESLIGAR")) {
            digitalWrite(ledPin, LOW);
            Serial.println("LED Desligado.");
        } else {
            Serial.println("Comando inválido. Use 'LIGAR' ou 'DESLIGAR'.");
        }
    }
}
˜˜˜

### Exercício 2: Comunicação Serial com Arduino e Módulo Bluetooth para Controle de Servo

- **Tarefa:** Desenvolva um sistema onde um smartphone envia comandos via Bluetooth para o Arduino controlar a posição de um servo motor. Utilize comandos como "ESQUERDA" e "DIREITA" para ajustar o ângulo do servo.

- **Dicas:**
  - Utilize a biblioteca `SoftwareSerial` para comunicação com o módulo Bluetooth.
  - Controle o servo utilizando a biblioteca `Servo`.

- **Exemplo de Código:**

˜˜˜cpp
#include <SoftwareSerial.h>
#include <Servo.h>

SoftwareSerial bluetooth(10, 11); // RX, TX
Servo meuServo;

void setup() {
    Serial.begin(9600);
    bluetooth.begin(9600);
    meuServo.attach(9); // Servo conectado ao pino 9
    meuServo.write(90); // Posição inicial
    Serial.println("Controle do Servo via Bluetooth iniciado.");
}

void loop() {
    if (bluetooth.available() > 0) {
        String comando = bluetooth.readStringUntil('\n');
        comando.trim();
        
        if (comando.equalsIgnoreCase("ESQUERDA")) {
            int pos = meuServo.read();
            pos -= 10;
            if (pos < 0) pos = 0;
            meuServo.write(pos);
            Serial.print("Servo movido para a esquerda: ");
            Serial.println(pos);
        } else if (comando.equalsIgnoreCase("DIREITA")) {
            int pos = meuServo.read();
            pos += 10;
            if (pos > 180) pos = 180;
            meuServo.write(pos);
            Serial.print("Servo movido para a direita: ");
            Serial.println(pos);
        } else {
            Serial.println("Comando inválido. Use 'ESQUERDA' ou 'DIREITA'.");
        }
    }
}
˜˜˜

### Exercício 3: Comunicação Serial com Parsing de Dados para Monitoramento de Sensores

- **Tarefa:** Crie um programa onde o Arduino envia dados de múltiplos sensores formatados em JSON para o computador. Utilize parsing para organizar os dados recebidos.

- **Dicas:**
  - Utilize delimitadores para estruturar os dados em formato JSON.
  - Implemente funções para criar e interpretar strings JSON.

- **Exemplo de Código:**

˜˜˜cpp
#include <ArduinoJson.h>

void setup() {
    Serial.begin(9600);
    Serial.println("Monitoramento de Sensores Iniciado.");
}

void loop() {
    // Simulação de leituras de sensores
    float temperatura = 23.5;
    float umidade = 47.8;
    float pressao = 1013.25;
    
    // Cria um documento JSON
    StaticJsonDocument<200> doc;
    doc["temperatura"] = temperatura;
    doc["umidade"] = umidade;
    doc["pressao"] = pressao;
    
    // Serializa o JSON
    String output;
    serializeJson(doc, output);
    Serial.println(output);
    
    delay(1000);
}
˜˜˜

**Explicação:**

- **Biblioteca `ArduinoJson`:** Facilita a criação e parsing de dados em formato JSON.
- **Criação do JSON:** Armazena os valores dos sensores em um documento JSON e o envia via Serial.
- **Monitoramento:** O computador pode receber e interpretar os dados estruturados para visualização ou processamento.

---

## 9. Conceitos Importantes

### 9.1 Baud Rate

- **Definição:** Taxa de transmissão de dados na comunicação serial, medida em bits por segundo (bps).
- **Considerações:**
  - Deve ser consistente entre os dispositivos comunicantes.
  - Baud rates comuns: 9600, 19200, 38400, 57600, 115200.

### 9.2 Paridade e Bits de Parada

- **Paridade:** Método de verificação de erros que adiciona um bit extra para garantir a integridade dos dados.
- **Bits de Parada:** Indicam o final de um byte de dados.
- **Configuração:** Geralmente configurada como 8N1 (8 bits de dados, sem paridade, 1 bit de parada).

### 9.3 SoftwareSerial vs. HardwareSerial

- **HardwareSerial:**
  - Utiliza a porta serial padrão do Arduino.
  - Mais eficiente e rápido.
  - Limitado a uma única porta serial (exceto em Arduinos com múltiplas portas seriais).
  
- **SoftwareSerial:**
  - Permite criar portas seriais adicionais em pinos digitais.
  - Menos eficiente e pode ser mais lenta.
  - Útil para comunicação com múltiplos dispositivos seriais.

### 9.4 Parsing de Dados

- **Definição:** Processo de interpretar e extrair informações de uma string ou fluxo de dados.
- **Importância:** Essencial para organizar e utilizar dados recebidos de forma estruturada.

### 9.5 Boas Práticas na Comunicação Serial

- **Consistência:** Mantenha as configurações de baud rate e parâmetros de comunicação consistentes entre os dispositivos.
- **Delimitação de Dados:** Utilize delimitadores claros para separar diferentes partes dos dados.
- **Validação:** Sempre verifique e valide os dados recebidos para evitar erros de interpretação.
- **Gerenciamento de Buffer:** Evite sobrecarregar o buffer serial, controlando a quantidade e a frequência dos dados enviados.

---

## 10. Recursos Adicionais

- **Documentação Oficial do Arduino:**
  
  - [Comunicação Serial](https://www.arduino.cc/reference/en/language/functions/communication/serial/)
  - [Biblioteca `SoftwareSerial`](https://www.arduino.cc/en/Reference/SoftwareSerial)
  - [Biblioteca `ArduinoJson`](https://arduinojson.org/)
  
- **Tutoriais e Guias:**
  
  - [Guia Completo de Comunicação Serial no Arduino](https://www.tutorialspoint.com/arduino/arduino_serial_communication.htm)
  - [Utilizando I2C e SPI no Arduino](https://www.geeksforgeeks.org/i2c-communication-on-arduino/)
  - [Introdução ao JSON com Arduino](https://www.baldengineer.com/arduino-json-library.html)
  
- **Vídeos Educacionais:**
  
  - [Comunicação Serial Avançada no Arduino](https://www.youtube.com/watch?v=V7aH7Zeo79Q)
  - [Entendendo I2C e SPI no Arduino](https://www.youtube.com/watch?v=3dWk6mP2f8g)
  - [Utilizando a Biblioteca `ArduinoJson`](https://www.youtube.com/watch?v=GjxIYy5gvYk)

---

## 11. Conclusão do Módulo

Neste módulo, você aprendeu:

- Conceitos avançados de comunicação serial, incluindo UART, I2C e SPI.
- Como configurar e utilizar diferentes protocolos de comunicação serial no Arduino.
- Implementação de comunicação serial entre múltiplos dispositivos Arduino.
- Utilização da biblioteca `SoftwareSerial` para criar portas seriais adicionais.
- Técnicas de transferência e parsing de dados para comunicação eficiente.
- Integração de comunicação serial com módulos de comunicação como Bluetooth.
- Praticou com exemplos e exercícios que reforçam o entendimento da comunicação serial avançada.

Você está agora preparado para avançar para o próximo módulo, onde exploraremos **Controle de Motores e Atuadores**, aprofundando seu conhecimento em automação e controle com Arduino.

---

## 12. Próximos Passos

- **Revisar o conteúdo deste módulo e certificar-se de que compreendeu os conceitos apresentados.**
- **Completar os exercícios propostos para consolidar o aprendizado.**
- **Preparar-se para o Módulo 11: Controle de Motores e Atuadores.**
  
Se tiver dúvidas ou precisar de assistência, não hesite em procurar recursos adicionais ou participar de comunidades de aprendizagem para obter suporte.

---

**Bom trabalho e continue assim!**

# Sistemas Embarcados: Integrando ESP32 com Sensor MPU6050

Sistemas embarcados que monitoram movimento e orientação estão presentes em inúmeras aplicações modernas, desde dispositivos vestíveis até drones e sistemas de navegação. Nesta aula, vamos explorar a integração do `ESP32` com o sensor de movimento `MPU6050`, que combina acelerômetro e giroscópio em um único chip.

Esta combinação permite criar sistemas capazes de detectar movimentos, medir inclinação, identificar vibrações e muito mais. O ESP32, com sua capacidade de processamento superior e conectividade sem fio, complementa perfeitamente o MPU6050, permitindo aplicações IoT avançadas.

O MPU6050 é um dispositivo de 6 eixos que combina:

![mpu6050](https://i0.wp.com/randomnerdtutorials.com/wp-content/uploads/2020/12/MPU6050-Module-Accelerometer-Gyroscope-Temperature-Sensor.jpg?w=750&quality=100&strip=all&ssl=1)

- Acelerômetro de 3 eixos (X, Y, Z)
- Giroscópio de 3 eixos (X, Y, Z)
- Processador Digital de Movimento (DMP - Digital Motion Processor)
- Conversor analógico-digital de 16 bits para cada canal
- Buffer FIFO de 1024 bytes
- Sensor de temperatura integrado

**Princípios de funcionamento:**

![acc](https://i0.wp.com/randomnerdtutorials.com/wp-content/uploads/2020/12/roll-pitch-yaw.png?resize=1024%2C928&quality=100&strip=all&ssl=1)

**Acelerômetro:** 
Mede aceleração linear nos três eixos. Em repouso, detecta apenas a aceleração gravitacional (9,8 m/s²). A aceleração é medida em g (1g = 9,8 m/s²).

O acelerômetro utiliza estruturas microscópicas capacitivas que se movem em resposta à aceleração, alterando a capacitância, que é convertida em um sinal elétrico proporcional à aceleração.

**Giroscópio:**
Mede velocidade angular (taxa de rotação) em torno dos três eixos, comumente expressa em graus por segundo (°/s). Baseia-se no princípio do efeito Coriolis, onde uma massa vibrante sofre uma força perpendicular quando submetida a rotação.

**Escalas configuráveis:**
- Acelerômetro: ±2g, ±4g, ±8g ou ±16g
- Giroscópio: ±250°/s, ±500°/s, ±1000°/s ou ±2000°/s

### Comunicação I2C

O MPU6050 utiliza o protocolo I2C para comunicação, um barramento serial que requer apenas dois fios:
- SCL (Serial Clock): Sinal de clock
- SDA (Serial Data): Linha de dados

Características do I2C:
- Comunicação half-duplex, multi-master, multi-slave
- Cada dispositivo possui um endereço único (MPU6050 usa 0x68 por padrão)
- Velocidades típicas: 100kHz (modo padrão), 400kHz (modo rápido)
- Protocolo baseado em transações de endereçamento, escrita e leitura

O ESP32 possui múltiplos controladores I2C e pode utilizar praticamente qualquer par de pinos GPIO para implementar o barramento.

## Ambiente de Desenvolvimento

Para esta aula, utilizaremos:

1. **Hardware:**
   - Placa de desenvolvimento ESP32 (DevKit ou NodeMCU ESP32)
   - Módulo MPU6050
   - Cabos jumper
   - Protoboard
   - Cabo USB para programação

2. **Software:**
   - Arduino IDE
   - Biblioteca ESP32 para Arduino
   - Biblioteca para MPU6050 (Adafruit MPU6050 ou outra biblioteca compatível)

<!-- ### Configuração do Arduino IDE v1.x para ESP32:

1. Instale a Arduino IDE a partir de [arduino.cc](https://www.arduino.cc/en/software)
2. Abra Arduino IDE → Preferências
3. Em "URLs Adicionais para Gerenciadores de Placas", adicione:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Vá para Ferramentas → Placa → Gerenciador de Placas
5. Procure "ESP32" e instale o pacote mais recente da Espressif Systems
6. Selecione sua placa ESP32 específica em Ferramentas → Placa -->

### Instalação das Bibliotecas Necessárias:

Através do Gerenciador de Bibliotecas (Sketch → Incluir Biblioteca → Gerenciar Bibliotecas):

1. Instale "Adafruit MPU6050" (que também instalará dependências como "Adafruit Unified Sensor")
2. Alternativamente, você pode usar a biblioteca "MPU6050" de Jeff Rowberg

## Montagem do Circuito

A conexão do MPU6050 ao ESP32 é relativamente simples:

| MPU6050 | ESP32       | Função               |
|---------|-------------|----------------------|
| VCC     | 3.3V        | Alimentação          |
| GND     | GND         | Terra                |
| SCL     | GPIO22      | Clock I2C            |
| SDA     | GPIO21      | Dados I2C            |
| XDA     | Não conectado | Mestre I2C auxiliar (opcional) |
| XCL     | Não conectado | Clock I2C auxiliar (opcional) |
| AD0     | GND         | Seleção de endereço I2C (Low = 0x68) |
| INT     | GPIO17 (opcional) | Interrupção de dados prontos  |

![Diagrama de Conexão](https://i0.wp.com/randomnerdtutorials.com/wp-content/uploads/2020/12/MPU6050_ESP32_Wiring-Schematic-Diagram.png?w=726&quality=100&strip=all&ssl=1)

**Considerações importantes:**

- `O MPU6050 opera com 3,3V. Conectá-lo a 5V pode danificar o sensor`.
- Recomenda-se usar resistores pull-up de 4,7kΩ nas linhas SCL e SDA para maior estabilidade, embora o ESP32 e o MPU6050 já possuam pull-ups internos que podem ser suficientes para distâncias curtas.
- Mantenha os cabos de conexão I2C o mais curtos possível para minimizar ruído.

## Implementação de Software

### Bibliotecas Necessárias

Para facilitar o desenvolvimento, utilizaremos bibliotecas que abstraem a complexidade da comunicação com o MPU6050:

```cpp
#include <Wire.h>              // Biblioteca I2C padrão
#include <Adafruit_MPU6050.h>  // Abstrai comandos para o MPU6050
#include <Adafruit_Sensor.h>   // Interface unificada para sensores
```

### Código Base

Vamos começar com um código básico para inicializar e ler dados do MPU6050:

```cpp
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);  // Aguarda conexão serial (para Arduino Leonardo/Micro)
  
  Serial.println("Teste do Sensor MPU6050");

  // Inicializa o MPU6050
  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar o chip MPU6050");
    while (1) {
      delay(10);
    }
  }
  
  Serial.println("MPU6050 encontrado!");

  // Configura o alcance do acelerômetro
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  
  // Configura o alcance do giroscópio
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  
  // Configura filtro passa-baixa
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  Serial.println("Configuração concluída!");
  delay(100);
}

void loop() {
  // Obtém novos eventos do sensor com as leituras
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Imprime os dados do acelerômetro
  Serial.print("Aceleração (m/s^2): X=");
  Serial.print(a.acceleration.x);
  Serial.print(", Y=");
  Serial.print(a.acceleration.y);
  Serial.print(", Z=");
  Serial.println(a.acceleration.z);

  // Imprime os dados do giroscópio
  Serial.print("Rotação (rad/s): X=");
  Serial.print(g.gyro.x);
  Serial.print(", Y=");
  Serial.print(g.gyro.y);
  Serial.print(", Z=");
  Serial.println(g.gyro.z);

  // Imprime a temperatura
  Serial.print("Temperatura: ");
  Serial.print(temp.temperature);
  Serial.println(" °C");

  Serial.println("------------------------");
  delay(500);
}
```

#### Desafio

Monte o circuito e grave o código acima para testes testar e validar o funcionamento do sensor.


### Calibração do Sensor

O MPU6050, como a maioria dos sensores inerciais de baixo custo, possui deriva (bias) e ruído. A calibração é essencial para medições precisas.

Procedimento de calibração simplificado:

```cpp
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;

// Variáveis para armazenar os valores de calibração
float accel_x_offset = 0;
float accel_y_offset = 0;
float accel_z_offset = 0;
float gyro_x_offset = 0;
float gyro_y_offset = 0;
float gyro_z_offset = 0;

const int numReadings = 1000;  // Número de leituras para calibração

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  
  Serial.println("Calibração do MPU6050");

  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar chip MPU6050");
    while (1) {
      delay(10);
    }
  }
  
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  // Calibração:
  Serial.println("Mantenha o sensor parado e nivelado para calibração...");
  delay(2000);  // Tempo para posicionar o sensor
  
  Serial.println("Iniciando calibração...");
  
  // Coleta múltiplas leituras para média
  for (int i = 0; i < numReadings; i++) {
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    
    // Somando leituras
    accel_x_offset += a.acceleration.x;
    accel_y_offset += a.acceleration.y;
    accel_z_offset += a.acceleration.z - 9.8; // Subtrair a gravidade no eixo Z
    gyro_x_offset += g.gyro.x;
    gyro_y_offset += g.gyro.y;
    gyro_z_offset += g.gyro.z;
    
    delay(5);
  }
  
  // Calculando médias
  accel_x_offset /= numReadings;
  accel_y_offset /= numReadings;
  accel_z_offset /= numReadings;
  gyro_x_offset /= numReadings;
  gyro_y_offset /= numReadings;
  gyro_z_offset /= numReadings;
  
  Serial.println("Calibração concluída!");
  Serial.print("Offsets do acelerômetro: X=");
  Serial.print(accel_x_offset);
  Serial.print(", Y=");
  Serial.print(accel_y_offset);
  Serial.print(", Z=");
  Serial.println(accel_z_offset);
  
  Serial.print("Offsets do giroscópio: X=");
  Serial.print(gyro_x_offset);
  Serial.print(", Y=");
  Serial.print(gyro_y_offset);
  Serial.print(", Z=");
  Serial.println(gyro_z_offset);
}

void loop() {
  // Lê os dados do sensor
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Aplica os offsets
  float accel_x = a.acceleration.x - accel_x_offset;
  float accel_y = a.acceleration.y - accel_y_offset;
  float accel_z = a.acceleration.z - accel_z_offset;
  float gyro_x = g.gyro.x - gyro_x_offset;
  float gyro_y = g.gyro.y - gyro_y_offset;
  float gyro_z = g.gyro.z - gyro_z_offset;

  // Exibe os dados calibrados
  Serial.print("Aceleração calibrada (m/s^2): X=");
  Serial.print(accel_x);
  Serial.print(", Y=");
  Serial.print(accel_y);
  Serial.print(", Z=");
  Serial.println(accel_z);

  Serial.print("Rotação calibrada (rad/s): X=");
  Serial.print(gyro_x);
  Serial.print(", Y=");
  Serial.print(gyro_y);
  Serial.print(", Z=");
  Serial.println(gyro_z);

  delay(500);
}
```

#### Desafio

Caso o seu sensor apresente muito ruido e variação, faça o procedimento de calibração para tentar melhorar as medições.


## Processamento de Dados

### Acelerômetro

O **acelerômetro** é um sensor capaz de medir a **aceleração linear** nos três eixos: $X$, $Y$ e $Z$.  
Essas medições incluem tanto movimentos dinâmicos quanto a aceleração causada pela **gravidade**.

A partir das leituras, podemos realizar diferentes tipos de processamento:


1. **Cálculo de ângulos de inclinação:**

Quando o sensor está **estático** (sem movimento), a única aceleração presente é a **gravidade** ($g = 9{,}8\ \mathrm{m/s^2}$).

Sabemos que:

- Para o eixo $X$: o ângulo de inclinação $	heta_x$ é dado pela projeção da gravidade nos eixos $Y$ e $Z$.
- Para o eixo $Y$: o ângulo de inclinação $	heta_y$ é dado pela projeção da gravidade nos eixos $X$ e $Z$.

As equações são:

$$
\theta_x = \arctan\left(\frac{a_y}{\sqrt{a_x^2 + a_z^2}}\right)
$$

$$
\theta_y = \arctan\left(\frac{-a_x}{\sqrt{a_y^2 + a_z^2}}\right)
$$

Onde:
$g = 9.8\ \mathrm{m/s^2}$
- $a_x$, $a_y$, $a_z$ são as leituras brutas do acelerômetro em cada eixo.
- A função $arctan$ é a função arcotangente (em radianos).

Se quisermos os ângulos em graus, multiplicamos por:

$$
\text{graus} = \text{radianos} \times \left( \frac{180}{\pi} \right)
$$

```cpp
// Cálculo de ângulos usando acelerômetro
float accel_angle_x = atan2(accel_y, sqrt(accel_x * accel_x + accel_z * accel_z)) * 180 / PI;
float accel_angle_y = atan2(-accel_x, sqrt(accel_y * accel_y + accel_z * accel_z)) * 180 / PI;
```

2. **Detecção de movimento:**
   
Quando o dispositivo se move, a aceleração total se altera. Para identificar esse movimento, calculamos a **magnitude da aceleração**:

A equação da magnitude vetorial é:

$$
|a| = \sqrt{a_x^2 + a_y^2 + a_z^2}
$$

Se a magnitude diferir significativamente da aceleração gravitacional padrão $g = 9.8\ \mathrm{m/s^2}$, interpretamos isso como movimento.


```cpp
// Magnitude da aceleração total (removendo a gravidade)
float accel_magnitude = sqrt(accel_x * accel_x + accel_y * accel_y + accel_z * accel_z);

// Detecta movimento baseado na diferença em relação à gravidade
if (abs(accel_magnitude - 9.8) > 2.0) {
  Serial.println("Movimento detectado!");
}
```

**Critério utilizado:**

- Um desvio maior que $2\ \mathrm{m/s^2}$ da gravidade indica presença de movimento.


3. **Detecção de queda livre:**
   
Durante a **queda livre**, o acelerômetro tende a medir uma aceleração próxima de **zero** em todos os eixos, pois o sensor e seu corpo de referência estão acelerando juntos sob a gravidade.

O mesmo cálculo da magnitude da aceleração é usado:

$$
|a| = \sqrt{a_x^2 + a_y^2 + a_z^2}
$$

**Condição de detecção:**
- Se \(|a|\) for muito próximo de \(0\ \mathrm{m/s^2}\) (por exemplo, menor que \(2.0\ \mathrm{m/s^2}\)), assumimos que o sensor está em queda livre.

```cpp
// Magnitude da aceleração total
float accel_magnitude = sqrt(accel_x * accel_x + accel_y * accel_y + accel_z * accel_z);

// Detecta queda livre
if (accel_magnitude < 2.0) {  // Próximo a zero, mas com alguma margem
  Serial.println("Queda livre detectada!");
}
```

### Giroscópio

O **giroscópio** mede **velocidade angular** nos três eixos: $X$, $Y$ e $Z$.

Com essas medições, podemos realizar diversos processamentos:

---

## 1. Cálculo de Ângulo por Integração

A velocidade angular é integrada no tempo para estimar o ângulo de rotação.

A equação básica é:

$$
\theta(t) = \theta_0 + \int_0^t \omega(t) \ dt
$$

Onde:
- $\theta(t)$ é o ângulo acumulado.
- $\omega(t)$ é a velocidade angular.
- $dt$ é o intervalo de tempo entre as leituras.

```cpp
// Variáveis globais
float angle_x = 0;
float angle_y = 0;
float angle_z = 0;
unsigned long last_time = 0;

void loop() {
  // ...código para ler o MPU6050...
  
  // Conversão de rad/s para graus/s
  float gyro_x_deg = gyro_x * 180 / PI;
  float gyro_y_deg = gyro_y * 180 / PI;
  float gyro_z_deg = gyro_z * 180 / PI;
  
  // Cálculo do intervalo de tempo
  unsigned long current_time = millis();
  float dt = (current_time - last_time) / 1000.0; // Converter para segundos
  last_time = current_time;
  
  // Integração (ângulo = ângulo anterior + velocidade angular * tempo)
  angle_x += gyro_x_deg * dt;
  angle_y += gyro_y_deg * dt;
  angle_z += gyro_z_deg * dt;
  
  Serial.print("Ângulos por giroscópio (graus): X=");
  Serial.print(angle_x);
  Serial.print(", Y=");
  Serial.print(angle_y);
  Serial.print(", Z=");
  Serial.println(angle_z);
  
  // ... resto do código ...
}
```
**Limitação:** A integração acumula erro ao longo do tempo (**deriva**), tornando os ângulos cada vez menos precisos.

### Filtro Complementar

Para obter melhores estimativas de orientação, combinamos os dados do acelerômetro e giroscópio usando um filtro complementar. 

O filtro complementar combina:
- **Acelerômetro:** Fornece referência absoluta mas é sensível a acelerações externas
- **Giroscópio:** Possui boa resposta a curto prazo, mas deriva ao longo do tempo

A equação do filtro é:

$$
\text{angle}_{\text{final}} = \alpha (\text{angle}_{\text{gyro}}) + (1 - \alpha)(\text{angle}_{\text{accel}})
$$

Onde:
- $\alpha$ é o coeficiente de ponderação (ex.: 0.96).

```cpp
// Definições globais
float angle_x = 0;
float angle_y = 0;
unsigned long last_time = 0;
float alpha = 0.96; // Fator de filtragem (ajustável)

void loop() {
  // ...código para ler o MPU6050...
  
  // Cálculo dos ângulos do acelerômetro
  float accel_angle_x = atan2(accel_y, sqrt(accel_x * accel_x + accel_z * accel_z)) * 180 / PI;
  float accel_angle_y = atan2(-accel_x, sqrt(accel_y * accel_y + accel_z * accel_z)) * 180 / PI;
  
  // Conversão de rad/s para deg/s
  float gyro_x_deg = gyro_x * 180 / PI;
  float gyro_y_deg = gyro_y * 180 / PI;
  
  // Cálculo do intervalo de tempo
  unsigned long current_time = millis();
  float dt = (current_time - last_time) / 1000.0;
  last_time = current_time;
  
  // Aplicação do filtro complementar
  angle_x = alpha * (angle_x + gyro_x_deg * dt) + (1 - alpha) * accel_angle_x;
  angle_y = alpha * (angle_y + gyro_y_deg * dt) + (1 - alpha) * accel_angle_y;
  
  Serial.print("Ângulos filtrados (graus): X=");
  Serial.print(angle_x);
  Serial.print(", Y=");
  Serial.println(angle_y);
  
  delay(10);
}
```

## Aplicações Práticas

### Detecção de Movimento (Acionamento de LED)

Sistema de detecção de movimento baseado em acelerômetro para acionar um LED:


```cpp
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;

const int ledPin = 2;  // LED conectado ao GPIO2
float accel_threshold = 2.0;  // Threshold para detecção de movimento (m/s²)

// Variáveis de calibração
float accel_x_offset = 0;
float accel_y_offset = 0;
float accel_z_offset = 0;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  
  // Inicialização do MPU6050
  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar chip MPU6050");
    while (1) {
      delay(10);
    }
  }
  
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  
  // Calibração rápida (pode ser expandida conforme exemplo anterior)
  calibrarSensor();
  
  Serial.println("Sistema de detecção de movimento iniciado");
}

void calibrarSensor() {
  Serial.println("Calibrando sensor...");
  
  // Média de 100 leituras
  for (int i = 0; i < 100; i++) {
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    accel_x_offset += a.acceleration.x;
    accel_y_offset += a.acceleration.y;
    accel_z_offset += a.acceleration.z - 9.8; // Remove a gravidade
    delay(10);
  }
  
  accel_x_offset /= 100;
  accel_y_offset /= 100;
  accel_z_offset /= 100;
  
  Serial.println("Calibração concluída");
}

bool detectarMovimento() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  // Aplicar calibração
  float accel_x = a.acceleration.x - accel_x_offset;
  float accel_y = a.acceleration.y - accel_y_offset;
  float accel_z = a.acceleration.z - accel_z_offset;
  
  // Calcular magnitude da aceleração
  float magnitude = sqrt(accel_x * accel_x + accel_y * accel_y + accel_z * accel_z);
  
  // Verificar se excede o threshold (removendo a componente da gravidade)
  if (abs(magnitude - 9.8) > accel_threshold) {
    return true;
  }
  return false;
}

void loop() {
  if (detectarMovimento()) {
    Serial.println("Movimento detectado!");
    digitalWrite(ledPin, HIGH);  // Acende o LED
    delay(1000);                 // Mantém aceso por 1 segundo
  } else {
    digitalWrite(ledPin, LOW);   // Desliga o LED
  }
  
  delay(50);  // Pequeno atraso para estabilidade
}
```

### 3.2 Controle de Orientação (Servo Motor)

Controle de servo motor baseado na inclinação detectada:

```cpp
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ESP32Servo.h>

Adafruit_MPU6050 mpu;
Servo myServo;

const int servoPin = 13;  // Servo conectado ao GPIO13
float angle_x = 0;
float angle_y = 0;
unsigned long last_time = 0;
float alpha = 0.96; // Fator de filtragem

void setup() {
  Serial.begin(115200);
  
  // Inicialização do MPU6050
  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar chip MPU6050");
    while (1) {
      delay(10);
    }
  }
  
  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  mpu.setGyroRange(MPU6050_RANGE_250_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  
  // Inicialização do servo
  ESP32PWM::allocateTimer(0);
  myServo.setPeriodHertz(50);    // PWM frequency
  myServo.attach(servoPin, 500, 2400); // pino, pulso mínimo, pulso máximo
  
  last_time = millis();
  Serial.println("Sistema de controle por inclinação iniciado");
}

void loop() {
  // Obter dados do sensor
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  // Cálculo dos ângulos do acelerômetro
  float accel_angle_x = atan2(a.acceleration.y, 
                              sqrt(a.acceleration.x * a.acceleration.x + 
                                   a.acceleration.z * a.acceleration.z)) * 180 / PI;
  
  // Conversão de rad/s para graus/s
  float gyro_x_deg = g.gyro.x * 180 / PI;
  
  // Cálculo do intervalo de tempo
  unsigned long current_time = millis();
  float dt = (current_time - last_time) / 1000.0;
  last_time = current_time;
  
  // Filtro complementar
  angle_x = alpha * (angle_x + gyro_x_deg * dt) + (1 - alpha) * accel_angle_x;
  
  // Mapeamento do ângulo para posição do servo (ajuste conforme necessário)
  // Limitando entre -45 e +45 graus, para servo entre 0 e 180
  float servo_angle = map(constrain(angle_x, -45, 45), -45, 45, 0, 180);
  
  // Posição do servo
  myServo.write(servo_angle);
  
  // Exibição de dados
  Serial.print("Ângulo X: ");
  Serial.print(angle_x);
  Serial.print(" | Posição do servo: ");
  Serial.println(servo_angle);
  
  delay(20);
}

// Função auxiliar para mapear valores float
float map(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
```


## Projeto Completo: Monitoramento de Orientação com ESP32

Vamos construir um **sistema embarcado interativo** para **monitoramento de orientação** em **tempo real**, usando:

- **ESP32** como microcontrolador e servidor Wi-Fi
- **Sensor MPU6050** para medir aceleração e rotação
- **Página Web** que visualiza a orientação em **3D** via navegador

<video width="600" controls>
  <source src="esp-imu.mp4" type="video/mp4">
  Seu navegador não suporta vídeo HTML5.
</video>


Vamos dividir o projeto em etapas para facilitar o entendimento:

### 1. Estrutura Geral do Projeto

- **Sensor MPU6050**: Captura dados de aceleração (forças) e giroscópio (velocidade angular).
- **ESP32**: Processa os dados, aplica filtro complementar e cria um servidor web para transmitir os valores.
- **Frontend Web**: Página HTML com um cubo 3D que gira conforme a orientação medida.
- **Comunicação**: Navegador se conecta via **HTTP local** para receber dados a cada 100 ms.

### 2. Configuração e Inicialização

- Configuramos a conexão Wi-Fi do ESP32.
- Inicializamos o sensor MPU6050 ajustando:
  - Faixa do acelerômetro para ±2G
  - Faixa do giroscópio para ±250°/s
  - Largura de banda do filtro interno

O objetivo é garantir alta sensibilidade e estabilidade para medição dos movimentos.

### 3. Aquisição de Dados do Sensor

- Usamos a função `mpu.getEvent(&a, &g, &temp)` para ler:
  - Aceleração (`a`)
  - Velocidade angular (`g`)
  - Temperatura (`temp`, opcional)

- Calculamos os ângulos:
  - **Inclinação X**: Baseado no eixo Y do acelerômetro.
  - **Inclinação Y**: Baseado no eixo X do acelerômetro.
  - **Yaw (rotação Z)**: Integrando a velocidade do giroscópio Z ao longo do tempo.

- Aplicamos um **filtro complementar** para combinar as informações de acelerômetro e giroscópio, compensando ruídos e drift.

### 4. Visualização Gráfica no Navegador

- Como o Frontend Funciona: 
  - Página HTML simples, com um canvas onde desenhamos o cubo.
  - Implementamos um mini "motor gráfico" 3D usando apenas JavaScript puro + Canvas 2D.
  - As faces do cubo recebem cores diferentes e iluminação simulada, para melhorar a percepção visual.

- Atualização em Tempo Real:
  - A cada 100 ms, o navegador faz um fetch('/data').
  - Os novos ângulos são aplicados no cubo para atualizar a orientação.

### 5. Código Fonte Completo

```cpp
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// ======== Protótipos de funções =========
void atualizarDadosSensor(unsigned long dt_ms);

// ======== Variáveis Wi-Fi e Servidor ========
// Credenciais da rede Wi-Fi
const char* ssid = "SeuSSID";
const char* password = "SuaSenha";
WebServer server(80);

// ======== Objeto Sensor ========
Adafruit_MPU6050 mpu;

// ======== Variáveis de processamento ========
float angle_x = 0;
float angle_y = 0;
float yaw_angle = 0;
unsigned long last_sensor_update = 0;
const unsigned long sensor_update_interval = 10; // em ms
float alpha = 0.96; // Filtro complementar

// ======== HTML da página web (corrigido UTF-8 e com 3D) ========
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Monitor MPU6050 3D</title>
  <style>
    body { margin: 0; overflow: hidden; font-family: Arial; text-align: center; background-color: #1a1a2e; }
    #canvas3d { width: 100vw; height: 100vh; display: block; background: #1a1a2e; }
    #info { 
      position: absolute; 
      top: 10px; 
      left: 10px; 
      color: white; 
      font-size: 18px; 
      background-color: rgba(0,0,0,0.5); 
      padding: 10px; 
      border-radius: 10px; 
    }
  </style>
</head>
<body>
<div id="info">
  <h2>Monitor de Orientação MPU6050</h2>
  Ângulo X: <span id="angleX">0</span>°<br>
  Ângulo Y: <span id="angleY">0</span>°<br>
  Yaw: <span id="yaw">0</span>°
</div>
<canvas id="canvas3d"></canvas>
<script>
// ===== Mini 3D Engine =====
const canvas = document.getElementById('canvas3d');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Definição do cubo em 3D
const vertices = [
  [-1, -1, -1], [1, -1, -1],
  [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1],
  [1, 1, 1], [-1, 1, 1]
];

// Definição das faces do cubo
const faces = [
  [0, 1, 2, 3], // Face frente
  [1, 5, 6, 2], // Face direita
  [5, 4, 7, 6], // Face trás
  [4, 0, 3, 7], // Face esquerda
  [3, 2, 6, 7], // Face superior
  [4, 5, 1, 0]  // Face inferior
];

// Cores para cada face
const faceColors = [
  "#FF5733", // Laranja
  "#33FF57", // Verde
  "#3357FF", // Azul
  "#FF33A8", // Rosa
  "#FFFF33", // Amarelo
  "#33FFFF"  // Ciano
];

// Definição das arestas do cubo
const edges = [
  [0,1],[1,2],[2,3],[3,0],
  [4,5],[5,6],[6,7],[7,4],
  [0,4],[1,5],[2,6],[3,7]
];

let angleX = 0;
let angleY = 0;
let yaw = 0;

// Função para calcular a normal de uma face
function getFaceNormal(faceVertices) {
  const [a, b, c] = faceVertices;
  
  // Vetores de dois lados da face
  const v1 = [
    b[0] - a[0],
    b[1] - a[1],
    b[2] - a[2]
  ];
  
  const v2 = [
    c[0] - a[0],
    c[1] - a[1],
    c[2] - a[2]
  ];
  
  // Produto vetorial para obter a normal
  const normal = [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0]
  ];
  
  // Normalização
  const length = Math.sqrt(normal[0]**2 + normal[1]**2 + normal[2]**2);
  return [normal[0]/length, normal[1]/length, normal[2]/length];
}

// Função para desenhar cubo
function drawCube() {
  ctx.clearRect(0, 0, width, height);
  
  // Calcular posições dos vértices após rotação
  const rotatedVertices = vertices.map(v => {
    let [x,y,z] = v;
    
    // Rotação em X
    let rx = x;
    let ry = y*Math.cos(angleX) - z*Math.sin(angleX);
    let rz = y*Math.sin(angleX) + z*Math.cos(angleX);
    
    // Rotação em Y
    let rrx = rx*Math.cos(angleY) + rz*Math.sin(angleY);
    let rry = ry;
    let rrz = -rx*Math.sin(angleY) + rz*Math.cos(angleY);
    
    // Rotação em Z (Yaw)
    let rrrx = rrx*Math.cos(yaw) - rry*Math.sin(yaw);
    let rrry = rrx*Math.sin(yaw) + rry*Math.cos(yaw);
    let rrrz = rrz;
    
    return [rrrx, rrry, rrrz];
  });
  
  // Calcular centro de cada face e sua profundidade para ordenação
  const facesWithDepth = faces.map((face, i) => {
    const faceVertices = face.map(idx => rotatedVertices[idx]);
    
    // Calcular centro da face
    const centerX = faceVertices.reduce((sum, v) => sum + v[0], 0) / 4;
    const centerY = faceVertices.reduce((sum, v) => sum + v[1], 0) / 4;
    const centerZ = faceVertices.reduce((sum, v) => sum + v[2], 0) / 4;
    
    // Calcular normal da face
    const normal = getFaceNormal(faceVertices);
    
    // Direção da luz (simplificada)
    const lightDir = [0, 0, -1];
    
    // Calcular intensidade da luz na face
    const lightIntensity = -(normal[0] * lightDir[0] + normal[1] * lightDir[1] + normal[2] * lightDir[2]);
    
    return {
      index: i,
      vertices: faceVertices,
      depth: centerZ,
      normal: normal,
      lightIntensity: Math.max(0.4, lightIntensity)  // Garantir iluminação mínima
    };
  });
  
  // Ordenar faces por profundidade (painter's algorithm)
  facesWithDepth.sort((a, b) => b.depth - a.depth);
  
  // Projetar vértices para 2D
  const points = rotatedVertices.map(v => {
    let [x, y, z] = v;
    let scale = 400 / (z + 5);
    return [
      x * scale + width/2,
      y * scale + height/2
    ];
  });
  
  // Desenhar as faces em ordem de profundidade
  facesWithDepth.forEach(face => {
    const faceIdx = face.index;
    const faceVertexIndices = faces[faceIdx];
    
    // Obter cor da face e ajustar com a intensidade da luz
    const baseColor = faceColors[faceIdx];
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Aplicar intensidade da luz
    const lightIntensity = face.lightIntensity;
    const shadedColor = `rgb(${Math.floor(r * lightIntensity)}, ${Math.floor(g * lightIntensity)}, ${Math.floor(b * lightIntensity)})`;
    
    // Desenhar face
    ctx.beginPath();
    ctx.moveTo(points[faceVertexIndices[0]][0], points[faceVertexIndices[0]][1]);
    for (let i = 1; i < faceVertexIndices.length; i++) {
      ctx.lineTo(points[faceVertexIndices[i]][0], points[faceVertexIndices[i]][1]);
    }
    ctx.closePath();
    
    // Preencher face com a cor ajustada pela iluminação
    ctx.fillStyle = shadedColor;
    ctx.fill();
    
    // Desenhar contornos
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

// Atualização contínua
function animate() {
  drawCube();
  requestAnimationFrame(animate);
}
animate();

// Atualizar ângulos vindo do ESP32
setInterval(function() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      document.getElementById('angleX').textContent = data.angleX.toFixed(2);
      document.getElementById('angleY').textContent = data.angleY.toFixed(2);
      document.getElementById('yaw').textContent = data.yaw.toFixed(2);
      angleX = data.angleX * Math.PI / 180;
      angleY = data.angleY * Math.PI / 180;
      yaw = data.yaw * Math.PI / 180;
    });
}, 100);
</script>
</body>
</html>
)rawliteral";


// ======== Setup ========
void setup() {
  Serial.begin(115200);

  // Inicialização do sensor MPU6050
  if (!mpu.begin()) {
    Serial.println("Erro ao inicializar o MPU6050");
    while (true) delay(10);
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  mpu.setGyroRange(MPU6050_RANGE_250_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  // Conectar no Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWi-Fi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Servidor Web
  server.on("/", HTTP_GET, []() {
    server.send_P(200, "text/html", index_html);
  });

  server.on("/data", HTTP_GET, []() {
    StaticJsonDocument<300> doc;
    doc["angleX"] = angle_x;
    doc["angleY"] = angle_y;
    doc["yaw"] = yaw_angle;
    String jsonResponse;
    serializeJson(doc, jsonResponse);
    server.send(200, "application/json", jsonResponse);
  });

  server.begin();
  Serial.println("Servidor HTTP iniciado");

  last_sensor_update = millis();
}

// ======== Loop ESP32 ========
void loop() {
  server.handleClient();

  unsigned long current_time = millis();
  if (current_time - last_sensor_update >= sensor_update_interval) {
    unsigned long dt_ms = current_time - last_sensor_update;
    last_sensor_update = current_time;
    atualizarDadosSensor(dt_ms);
  }
}

// ======== Função de Atualizar Dados do Sensor ========
void atualizarDadosSensor(unsigned long dt_ms) {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float accel_angle_x = atan2(a.acceleration.y, sqrt(a.acceleration.x * a.acceleration.x + a.acceleration.z * a.acceleration.z)) * 180.0 / PI;
  float accel_angle_y = atan2(-a.acceleration.x, sqrt(a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z)) * 180.0 / PI;

  float gyro_x_deg = g.gyro.x * 180.0 / PI;
  float gyro_y_deg = g.gyro.y * 180.0 / PI;
  float gyro_z_deg = g.gyro.z * 180.0 / PI;

  float dt = dt_ms / 1000.0;

  // Filtro complementar
  angle_x = alpha * (angle_x + gyro_x_deg * dt) + (1.0 - alpha) * accel_angle_x;
  angle_y = alpha * (angle_y + gyro_y_deg * dt) + (1.0 - alpha) * accel_angle_y;

  // Yaw - integração direta do giroscópio z
  yaw_angle += gyro_z_deg * dt;

  if (yaw_angle < 0) yaw_angle += 360;
  if (yaw_angle >= 360) yaw_angle -= 360;
}
```

## Desafios

   - Crie um sistema de `detecção de movimento` para fazer o ESP32 emitir um sinal sonoro (usando um buzzer) quando o movimento ultrapassar determinado limiar.
   - Implemente uma função que detecte "tap" no sensor (batida rápida) e conte o número de taps em sequência.
   - Implemente um pedômetro que detecte passos usando o padrão de aceleração característico ao caminhar.
   - Implemente um filtro de Kalman para fusão de sensores, em vez do filtro complementar.
   - Crie um sistema que use o ESP32 e o MPU6050 para controlar um modelo 3D em um navegador via WebSocket, mostrando a orientação em tempo real.
  
<!-- ## Referências

1. [Documentação oficial do ESP32](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
2. [Datasheet do MPU6050](https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf)
3. [Biblioteca Adafruit MPU6050](https://github.com/adafruit/Adafruit_MPU6050)
4. [Adafruit Learning System - MPU6050](https://learn.adafruit.com/mpu6050-6-dof-accelerometer-and-gyro)
5. [Filtros para Fusão de Sensores](https://www.mdpi.com/1424-8220/15/8/19302)
6. [Guia de Programação ESP32](https://randomnerdtutorials.com/esp32-web-server-arduino-ide/)
7. [Teoria do Filtro Complementar](https://www.pieter-jan.com/node/11)
8. [Teoria do Filtro de Kalman](https://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/) -->
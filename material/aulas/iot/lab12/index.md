## Integração com Python e Emulação de Teclado

Vamos criar uma interface entre nosso sistema embarcado e o computador, transformando o ESP32+MPU6050 em um dispositivo de entrada alternativo.

Especificamente, vamos desenvolver um sistema que:

1. Captura dados de movimento/orientação do MPU6050
2. Transmite esses dados para o computador via comunicação serial
3. Processa os dados usando um script Python
4. Emula pressionamentos de teclas baseados nos movimentos detectados

Esta interface permite criar controles baseados em gestos para diversas aplicações, como jogos, apresentações, navegadores, entre outros. O sistema funciona como um tradutor que converte movimentos físicos em comandos de teclado para qualquer software em execução no computador.

## Comunicação ESP32-Computador

### Transmissão de Dados via Serial

A porta USB que usamos para programar o ESP32 também pode ser usada para comunicação durante a execução do programa. Esta é a forma mais direta de enviar dados do microcontrolador para o computador.

**Características da comunicação serial:**

- Conexão bidirecional (podemos enviar e receber dados)
- Não requer hardware adicional 
- Velocidades típicas de 9600 a 115200 bps (bits por segundo)
- Permite transmissão de texto ou dados binários

**No lado do ESP32 (Arduino IDE):**

```cpp
void setup() {
  // Inicializa a comunicação serial a 115200 bits por segundo
  Serial.begin(115200);
}

void loop() {
  // Envia uma mensagem simples
  Serial.println("Olá, computador!");
  delay(1000);
}
```

**Do lado do Python:**

```python
import serial

# Abre a porta serial (ajustar a porta COM conforme necessário)
# No Windows será algo como 'COM3', 'COM4', etc.
# No Linux/Mac será algo como '/dev/ttyUSB0' ou '/dev/cu.usbserial'
ser = serial.Serial('COM3', 115200)

# Lê e imprime dados recebidos
while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').rstrip()
        print(f"Recebido: {line}")
```

### Protocolo de dados

Para facilitar o processamento dos dados no Python, é importante enviar informações em um formato estruturado. Algumas opções comuns:

1. **Valores Separados por Vírgula (CSV):**
   ```
   angulo_x,angulo_y,aceleracao_z
   ```

2. **Notação JSON:**
   ```
   {"ax": 0.1, "ay": -0.5, "az": 9.8, "gx": 0.01, "gy": 0.02, "gz": -0.01}
   ```

3. **Formato Personalizado com Delimitadores:**
   ```
   <BEGIN>0.1,-0.5,9.8,0.01,0.02,-0.01<END>
   ```

Por enquanto, usaremos o formato CSV por sua simplicidade e baixo overhead.

**Implementação no ESP32:**

```cpp
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// ======== Protótipos de funções =========
void atualizarDadosSensor(unsigned long dt_ms);

// ======== Objeto Sensor ========
Adafruit_MPU6050 mpu;

// ======== Variáveis de processamento ========
float angle_x = 0;
float angle_y = 0;
float yaw_angle = 0;
unsigned long last_sensor_update = 0;
unsigned long last_data_send = 0;
const unsigned long sensor_update_interval = 10; // em ms
const unsigned long data_update = 50; // em ms
float alpha = 0.96; // Filtro complementar



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

  last_sensor_update = millis();
}

// ======== Loop ESP32 ========
void loop() {

  unsigned long current_time = millis();
  if (current_time - last_sensor_update >= sensor_update_interval) {
    unsigned long dt_ms = current_time - last_sensor_update;
    last_sensor_update = current_time;
    atualizarDadosSensor(dt_ms);
  }
  if (current_time - last_data_send >= data_update) {
    last_data_send = current_time;
    Serial.print(angle_x);
    Serial.print(",");
    Serial.print(angle_y);
    Serial.print(",");
    Serial.println(yaw_angle);
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

## Desenvolvimento do Script Python

### Leitura de Dados Seriais

Para comunicação serial em Python, usamos a biblioteca `pyserial`. Vamos instalar as dependências necessárias:

```bash
pip install pyserial pyautogui
```

Estrutura básica para leitura de dados seriais:

```python
import serial
import time

# Configuração da porta serial
# No Windows será algo como 'COM3', 'COM4', etc.
# No Linux/Mac será algo como '/dev/ttyUSB0' ou '/dev/cu.usbserial'
SERIAL_PORT = '/dev/cu.usbserial-0001'  # Ajuste conforme seu sistema
BAUD_RATE = 115200

try:
    # Abrir conexão serial
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE)
    print(f"Conectado a {SERIAL_PORT} a {BAUD_RATE} bps")
    
    # Esperar pela inicialização da conexão
    time.sleep(2)
    
    while True:
        # Verificar se há dados disponíveis
        if ser.in_waiting > 0:
            # Ler uma linha de dados
            line = ser.readline().decode('utf-8').rstrip()
            
            try:
                # Dividir a linha CSV em valores individuais
                values = line.split(',')
                if len(values) == 3:
                    angle_x = float(values[0])
                    angle_y = float(values[1])
                    angle_z = float(values[2])
                    
                    print(f"X: {angle_x:.2f}°, Y: {angle_y:.2f}°, Z-Accel: {angle_z:.2f}°")
            except ValueError:
                # Ignorar linhas inválidas
                pass
                
except serial.SerialException as e:
    print(f"Erro ao abrir porta serial: {e}")
except KeyboardInterrupt:
    print("Programa interrompido pelo usuário")
finally:
    # Garantir que a porta seja fechada
    if 'ser' in locals() and ser.is_open:
        ser.close()
        print("Porta serial fechada")
```

### Processamento de Dados

Antes de emular teclas, precisamos processar os dados do sensor para reconhecer gestos ou movimentos específicos:

```python
def process_movement(angle_x, angle_y, angle_z):
    """
    Processa os dados de movimento e retorna o comando correspondente
    """
    # Definir os limiares para detecção de movimentos
    TILT_THRESHOLD = 20  # Graus
    
    # Inicializar comando vazio
    command = None
    
    # Inclinação para esquerda
    if angle_y < -TILT_THRESHOLD:
        command = "LEFT"
    # Inclinação para direita
    elif angle_y > TILT_THRESHOLD:
        command = "RIGHT"
    # Inclinação para frente
    elif angle_x < -TILT_THRESHOLD:
        command = "UP"
    # Inclinação para trás
    elif angle_x > TILT_THRESHOLD:
        command = "DOWN"
        
    return command
```

### Emulação de Teclado com PyAutoGUI

A biblioteca PyAutoGUI permite simular pressionamentos de teclas e movimentos do mouse:

```python
import pyautogui

# Configuração de segurança (pausa entre comandos)
pyautogui.PAUSE = 0.1

def execute_command(command):
    """
    Executa um comando através da emulação de teclas
    """
    if command is None:
        return
        
    # Mapear comandos para teclas
    key_mapping = {
        "UP": "up",
        "DOWN": "down",
        "LEFT": "left",
        "RIGHT": "right"
    }
    
    # Verificar se o comando existe no mapeamento
    if command in key_mapping:
        # Pressionar a tecla correspondente
        key = key_mapping[command]
        print(f"Pressionando tecla: {key}")
        pyautogui.press(key)
```

## Projeto: Controle de Jogos/Aplicações com Gestos

Vamos integrar tudo em um projeto completo que usa o ESP32+MPU6050 como controle de movimento para aplicações no computador


### Script Python Completo

```python
import serial
import time
import pyautogui
import argparse
import sys

# Configurações padrão
# no macOS, a porta pode ser algo como '/dev/cu.usb**XXXX'
# no Linux, pode ser '/dev/ttyUSB0' ou '/dev/ttyACM0'
# no Windows, pode ser 'COM3', 'COM4', etc.
DEFAULT_PORT = '/dev/cu.usbserial-0001'  # Altere conforme necessário
DEFAULT_BAUD = 115200
DEFAULT_THRESHOLD = 20  # Graus para ativação
DEFAULT_COOLDOWN = 0.5  # Segundos entre comandos

# Configuração do PyAutoGUI
pyautogui.PAUSE = 0.1  # Pausa de 100ms entre comandos
pyautogui.FAILSAFE = True  # Mova o mouse para o canto superior esquerdo para abortar

class MotionController:
    def __init__(self, port=DEFAULT_PORT, baud=DEFAULT_BAUD, 
                 threshold=DEFAULT_THRESHOLD, cooldown=DEFAULT_COOLDOWN):
        """Inicializa o controlador de movimento"""
        self.port = port
        self.baud = baud
        self.threshold = threshold
        self.cooldown = cooldown
        
        self.ser = None
        self.last_command = None
        self.last_command_time = 0
        
        # Mapeamento de comandos para teclas
        self.key_mapping = {
            "UP": "up",
            "DOWN": "down",
            "LEFT": "left",
            "RIGHT": "right"
        }
    
    def connect(self):
        """Estabelece conexão com a porta serial"""
        try:
            self.ser = serial.Serial(self.port, self.baud)
            print(f"Conectado a {self.port} a {self.baud} bps")
            time.sleep(2)  # Aguarda estabilização
            return True
        except serial.SerialException as e:
            print(f"Erro ao abrir porta serial: {e}")
            return False
    
    def process_movement(self, angle_x, angle_y, accel_z):
        """Processa os dados de movimento e retorna o comando"""
        # Inicializar comando vazio
        command = None
        
        # Inclinação para esquerda
        if angle_y < -self.threshold:
            command = "LEFT"
        # Inclinação para direita
        elif angle_y > self.threshold:
            command = "RIGHT"
        # Inclinação para frente
        elif angle_x < -self.threshold:
            command = "UP"
        # Inclinação para trás
        elif angle_x > self.threshold:
            command = "DOWN"
            
        return command
    
    def execute_command(self, command):
        """Executa um comando via emulação de tecla"""
        # Verifica se o comando existe e se passou o tempo de cooldown
        current_time = time.time()
        
        if (command is not None and 
            (command != self.last_command or 
             current_time - self.last_command_time >= self.cooldown)):
            
            # Verifica se o comando está no mapeamento
            if command in self.key_mapping:
                # Pressiona a tecla correspondente
                key = self.key_mapping[command]
                print(f"Pressionando tecla: {key}")
                pyautogui.press(key)
                
                # Atualiza o último comando e o tempo
                self.last_command = command
                self.last_command_time = current_time
    
    def run(self):
        """Loop principal do controlador"""
        if not self.connect():
            return
            
        print("Iniciando monitoramento de movimentos...")
        print("Pressione Ctrl+C para sair")
        
        try:
            while True:
                # Verifica se há dados disponíveis
                if self.ser.in_waiting > 0:
                    # Lê uma linha de dados
                    line = self.ser.readline().decode('utf-8').rstrip()
                    
                    try:
                        # Divide a linha em valores
                        values = line.split(',')
                        if len(values) == 3:
                            angle_x = float(values[0])
                            angle_y = float(values[1])
                            accel_z = float(values[2])
                            
                            # Exibe os valores para debug
                            print(f"X: {angle_x:.1f}°, Y: {angle_y:.1f}°, Z: {accel_z:.1f}m/s²", end="")
                            
                            # Processa o movimento e executa o comando
                            command = self.process_movement(angle_x, angle_y, accel_z)
                            if command:
                                print(f" | Comando: {command}")
                                self.execute_command(command)
                            else:
                                print(" | Sem comando")
                    except ValueError:
                        # Ignora linhas inválidas
                        pass
                        
                time.sleep(0.01)  # Pequena pausa para não sobrecarregar a CPU
                
        except KeyboardInterrupt:
            print("\nPrograma interrompido pelo usuário")
        finally:
            # Garante que a porta seja fechada
            if self.ser and self.ser.is_open:
                self.ser.close()
                print("Porta serial fechada")

def main():
    """Função principal para execução via linha de comando"""
    # Configuração do parser de argumentos
    parser = argparse.ArgumentParser(description='Controle por gestos com ESP32 e MPU6050')
    parser.add_argument('-p', '--port', default=DEFAULT_PORT,
                        help=f'Porta serial (default: {DEFAULT_PORT})')
    parser.add_argument('-b', '--baud', type=int, default=DEFAULT_BAUD,
                        help=f'Taxa de transmissão (default: {DEFAULT_BAUD})')
    parser.add_argument('-t', '--threshold', type=float, default=DEFAULT_THRESHOLD,
                        help=f'Limiar de inclinação em graus (default: {DEFAULT_THRESHOLD})')
    parser.add_argument('-c', '--cooldown', type=float, default=DEFAULT_COOLDOWN,
                        help=f'Tempo mínimo entre comandos em segundos (default: {DEFAULT_COOLDOWN})')
    
    # Analisa os argumentos da linha de comando
    args = parser.parse_args()
    
    # Cria e executa o controlador
    controller = MotionController(
        port=args.port,
        baud=args.baud,
        threshold=args.threshold,
        cooldown=args.cooldown
    )
    controller.run()

if __name__ == "__main__":
    main()
```

**Como usar o script:**

1. Carregue o firmware no ESP32 usando a Arduino IDE
2. Conecte o ESP32 ao computador via USB
3. Execute o script Python
4. Incline o ESP32+MPU6050 para emular as teclas de seta

Opções da linha de comando:
```
python motion_controller.py --port COM3 --threshold 15 --cooldown 0.3
```

## Casos de Uso Avançados

### Controle de Apresentações

Podemos adaptar o código para controlar apresentações de slides:

```python
# Modificação no mapeamento de teclas para controle de apresentações
self.key_mapping = {
    "LEFT": "left",     # Slide anterior
    "RIGHT": "right",   # Próximo slide
    "UP": "home",       # Primeira slide
    "DOWN": "end"       # Último slide
}
```

Também podemos adicionar gestos mais complexos:

```python
# No método process_movement:
# Detectar gesto de "picar" para iniciar/parar apresentação
if abs(accel_z) > 15:  # Detecta movimento brusco vertical
    return "TOGGLE"

# No mapeamento:
self.key_mapping["TOGGLE"] = "f5"  # Inicia/termina apresentação no PowerPoint
```

### Controle de Jogos

Para jogos simples, podemos mapear movimentos para teclas usadas no jogo:

```python
# Mapeamento para jogos de corrida
self.key_mapping = {
    "LEFT": "a",       # Esquerda
    "RIGHT": "d",      # Direita
    "UP": "w",         # Acelerar
    "DOWN": "s"        # Frear
}
```

Para jogos mais complexos, podemos adicionar detecção de rotação:

```python
def process_movement(self, angle_x, angle_y, gyro_z):
    # Comandos básicos de inclinação
    if angle_y < -self.threshold:
        return "LEFT"
    elif angle_y > self.threshold:
        return "RIGHT"
    # ...
    
    # Detectar rotação para ações adicionais
    if gyro_z > 100:  # Rotação rápida no sentido horário
        return "ACTION1"
    elif gyro_z < -100:  # Rotação rápida no sentido anti-horário
        return "ACTION2"
```

### Controle de Mídia

Podemos adaptar para controle de reprodução de mídia:

```python
# Mapeamento para controle de mídia
self.key_mapping = {
    "LEFT": "prevtrack",    # Faixa anterior
    "RIGHT": "nexttrack",   # Próxima faixa
    "UP": "volumeup",       # Aumentar volume
    "DOWN": "volumedown",   # Diminuir volume
}

# Adicionar detecção de "shake" para play/pause
if abs(accel_z) > 20:
    return "PLAYPAUSE"

self.key_mapping["PLAYPAUSE"] = "playpause"
```

## Otimizações e Boas Práticas

### Otimização do Firmware ESP32

1. **Redução de Jitter:**
   ```cpp
   // Usar o temporizador de hardware para timing mais preciso
   hw_timer_t *timer = NULL;
   portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;
   
   void IRAM_ATTR onTimer() {
     portENTER_CRITICAL_ISR(&timerMux);
     // Leitura do sensor
     portEXIT_CRITICAL_ISR(&timerMux);
   }
   
   void setup() {
     // ...
     // Configurar timer a 100Hz (10ms)
     timer = timerBegin(0, 80, true);
     timerAttachInterrupt(timer, &onTimer, true);
     timerAlarmWrite(timer, 10000, true);
     timerAlarmEnable(timer);
   }
   ```

2. **Redução do Consumo de Energia:**
   ```cpp
   // Modo de baixo consumo quando inativo
   if (current_time - last_activity_time > INACTIVE_TIMEOUT) {
     mpu.setSleepEnabled(true);
     esp_sleep_enable_timer_wakeup(5 * 1000000); // Acordar em 5 segundos
     esp_light_sleep_start();
     mpu.setSleepEnabled(false);
     last_activity_time = millis();
   }
   ```

### Otimização do Script Python

1. **Interface Gráfica:**
   ```python
   def create_gui():
       """Cria uma interface gráfica simples"""
       import tkinter as tk
       from matplotlib.figure import Figure
       from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
       
       root = tk.Tk()
       root.title("Controle de Movimento ESP32+MPU6050")
       
       # Criar figura para visualização dos ângulos
       fig = Figure(figsize=(6, 4))
       ax = fig.add_subplot(111)
       ax.set_ylim(-90, 90)
       ax.set_xlabel("Tempo")
       ax.set_ylabel("Ângulo (graus)")
       ax.grid(True)
       
       # Linhas para ângulos X e Y
       line_x, = ax.plot([], [], 'r-', label='Ângulo X')
       line_y, = ax.plot([], [], 'b-', label='Ângulo Y')
       ax.legend()
       
       # Adicionar canvas à janela
       canvas = FigureCanvasTkAgg(fig, master=root)
       canvas.draw()
       canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)
       
       # Controles
       frame = tk.Frame(root)
       frame.pack(side=tk.BOTTOM, fill=tk.X)
       
       # Botão para conectar/desconectar
       btn_connect = tk.Button(frame, text="Conectar")
       btn_connect.pack(side=tk.LEFT, padx=5, pady=5)
       
       # Botão para calibrar
       btn_calibrate = tk.Button(frame, text="Calibrar")
       btn_calibrate.pack(side=tk.LEFT, padx=5, pady=5)
       
       # Slider para ajustar threshold
       lbl_threshold = tk.Label(frame, text="Limiar:")
       lbl_threshold.pack(side=tk.LEFT, padx=5, pady=5)
       
       threshold_var = tk.DoubleVar(value=DEFAULT_THRESHOLD)
       slider_threshold = tk.Scale(frame, from_=5, to=45, 
                                   orient=tk.HORIZONTAL, 
                                   variable=threshold_var)
       slider_threshold.pack(side=tk.LEFT, padx=5, pady=5)
       
       return root, line_x, line_y, threshold_var
   ```

## Desafios e Exercícios
   - Adapte o sistema para controlar o volume do computador com movimentos de inclinação
   - Implemente um novo gesto ("shake" ou batida dupla) para função de mudo (mute/unmute)
   - Crie um sistema para calibração interativa via interface gráfica
   - Adicione suporte para mapear diferentes gestos para diferentes aplicações
   - Implemente um sistema de aprendizagem de gestos personalizados
   - Integre com reconhecimento de gestos mais complexos (círculos, desenhos no ar)
   - Crie um controle para drone ou robô que use os dados do MPU6050 via Wi-Fi em vez de USB

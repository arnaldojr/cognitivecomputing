# Laboratório - Comunicação Arduino-Python com OpenCV

## Visão Geral
Neste laboratório, você aprenderá a estabelecer comunicação bidirecional entre o Arduino e um computador executando Python com OpenCV. Este tipo de integração permite que você crie sistemas interativos onde o processamento de imagem pode controlar atuadores físicos, criando uma ponte entre o mundo virtual e o real.

## Objetivos de Aprendizado
Ao final deste laboratório, você será capaz de:
- Estabelecer comunicação serial entre Arduino e Python
- Processar imagens em tempo real com OpenCV
- Implementar detecção de cores e movimento em vídeo
- Enviar comandos baseados em eventos visuais para o Arduino
- Criar um sistema interativo controlado por visão computacional

## Materiais Necessários
- Placa Arduino (Uno ou similar)
- Cabo USB
- 3 LEDs (vermelho, verde e azul)
- 3 Resistores de 220Ω
- Webcam ou câmera integrada do notebook
- Breadboard e jumpers
- Computador com Python, PySerial e OpenCV instalados

## 1. Fundamentos da Comunicação Serial Arduino-Python

A comunicação entre Arduino e Python é estabelecida através da porta serial, permitindo a troca de dados em ambas as direções:

- O **Arduino** envia dados de sensores ou estados de dispositivos
- O **Python** envia comandos para controlar atuadores ou solicitar informações

### 1.1 Preparação do Ambiente

Antes de começar, instale as bibliotecas Python necessárias:

```bash
pip install pyserial opencv-python numpy
```

### 1.2 Esquema de Montagem do Circuito

Monte o seguinte circuito no Arduino:

![Diagrama do Circuito](assets/images/circuito_arduino_leds.png)

**Conexões:**
- LED Vermelho: Pino 9 (com resistor de 220Ω)
- LED Verde: Pino 10 (com resistor de 220Ω)
- LED Azul: Pino 11 (com resistor de 220Ω)

## 2. Programação do Arduino

O código Arduino abaixo estabelece a comunicação serial e permite controlar os LEDs através de comandos recebidos:

```cpp
// Definição dos pinos
const int ledVermelho = 9;
const int ledVerde = 10;
const int ledAzul = 11;

String comandoRecebido = "";
boolean comandoCompleto = false;

void setup() {
  // Configuração dos pinos como saída
  pinMode(ledVermelho, OUTPUT);
  pinMode(ledVerde, OUTPUT);
  pinMode(ledAzul, OUTPUT);
  
  // Inicia a comunicação serial
  Serial.begin(9600);
  Serial.println("Arduino pronto para receber comandos!");
  
  // Teste inicial dos LEDs
  testarLEDs();
}

void loop() {
  // Verifica se há dados disponíveis na porta serial
  if (Serial.available() > 0) {
    // Lê o caractere recebido
    char caracterRecebido = Serial.read();
    
    // Se o caractere for uma quebra de linha, o comando está completo
    if (caracterRecebido == '\n') {
      comandoCompleto = true;
    } else {
      // Adiciona o caractere ao comando atual
      comandoRecebido += caracterRecebido;
    }
  }
  
  // Se o comando estiver completo, processa-o
  if (comandoCompleto) {
    processarComando(comandoRecebido);
    
    // Limpa o comando e reseta a flag
    comandoRecebido = "";
    comandoCompleto = false;
  }
}

// Função para processar o comando recebido
void processarComando(String comando) {
  comando.trim(); // Remove espaços e quebras de linha extras
  
  Serial.print("Comando recebido: ");
  Serial.println(comando);
  
  if (comando == "VERMELHO_ON") {
    digitalWrite(ledVermelho, HIGH);
    Serial.println("LED Vermelho ligado");
  } 
  else if (comando == "VERMELHO_OFF") {
    digitalWrite(ledVermelho, LOW);
    Serial.println("LED Vermelho desligado");
  }
  else if (comando == "VERDE_ON") {
    digitalWrite(ledVerde, HIGH);
    Serial.println("LED Verde ligado");
  }
  else if (comando == "VERDE_OFF") {
    digitalWrite(ledVerde, LOW);
    Serial.println("LED Verde desligado");
  }
  else if (comando == "AZUL_ON") {
    digitalWrite(ledAzul, HIGH);
    Serial.println("LED Azul ligado");
  }
  else if (comando == "AZUL_OFF") {
    digitalWrite(ledAzul, LOW);
    Serial.println("LED Azul desligado");
  }
  else if (comando == "TODOS_ON") {
    digitalWrite(ledVermelho, HIGH);
    digitalWrite(ledVerde, HIGH);
    digitalWrite(ledAzul, HIGH);
    Serial.println("Todos os LEDs ligados");
  }
  else if (comando == "TODOS_OFF") {
    digitalWrite(ledVermelho, LOW);
    digitalWrite(ledVerde, LOW);
    digitalWrite(ledAzul, LOW);
    Serial.println("Todos os LEDs desligados");
  }
  else if (comando == "STATUS") {
    enviarStatus();
  }
  else {
    Serial.println("Comando não reconhecido");
  }
}

// Função para testar os LEDs
void testarLEDs() {
  // Testa cada LED em sequência
  digitalWrite(ledVermelho, HIGH);
  delay(500);
  digitalWrite(ledVermelho, LOW);
  
  digitalWrite(ledVerde, HIGH);
  delay(500);
  digitalWrite(ledVerde, LOW);
  
  digitalWrite(ledAzul, HIGH);
  delay(500);
  digitalWrite(ledAzul, LOW);
  
  // Pisca todos juntos
  for (int i = 0; i < 3; i++) {
    digitalWrite(ledVermelho, HIGH);
    digitalWrite(ledVerde, HIGH);
    digitalWrite(ledAzul, HIGH);
    delay(200);
    digitalWrite(ledVermelho, LOW);
    digitalWrite(ledVerde, LOW);
    digitalWrite(ledAzul, LOW);
    delay(200);
  }
}

// Envia o status dos LEDs via serial
void enviarStatus() {
  Serial.print("STATUS:");
  Serial.print(digitalRead(ledVermelho));
  Serial.print(",");
  Serial.print(digitalRead(ledVerde));
  Serial.print(",");
  Serial.println(digitalRead(ledAzul));
}
```

## 3. Script Python para Teste de Comunicação

Antes de implementar a detecção por OpenCV, vamos testar a comunicação com um script Python simples:

```python
import serial
import time

# Configuração da porta serial
# Em Windows, use 'COMx' (ex: 'COM3')
# Em Linux/Mac, use '/dev/ttyUSBx' ou '/dev/ttyACMx' (ex: '/dev/ttyACM0')
porta_serial = '/dev/ttyACM0'  # Ajuste para sua porta

try:
    # Abre a conexão serial
    arduino = serial.Serial(porta_serial, 9600, timeout=1)
    print(f"Conectado à porta {porta_serial}")
    time.sleep(2)  # Espera a conexão estabilizar
    
    # Lê a mensagem inicial do Arduino
    linha = arduino.readline().decode('utf-8').strip()
    print(f"Arduino diz: {linha}")
    
    # Testa os comandos
    comandos = [
        "VERMELHO_ON", "VERDE_ON", "AZUL_ON",
        "TODOS_OFF", "STATUS", "TODOS_ON",
        "VERMELHO_OFF", "VERDE_OFF", "AZUL_OFF"
    ]
    
    for comando in comandos:
        print(f"\nEnviando comando: {comando}")
        arduino.write(f"{comando}\n".encode())
        time.sleep(1)
        
        # Lê a resposta do Arduino
        while arduino.in_waiting > 0:
            resposta = arduino.readline().decode('utf-8').strip()
            print(f"Resposta: {resposta}")
        
        time.sleep(1)
        
except serial.SerialException as e:
    print(f"Erro de conexão serial: {e}")
except KeyboardInterrupt:
    print("\nPrograma encerrado pelo usuário")
finally:
    # Fecha a conexão serial se estiver aberta
    if 'arduino' in locals() and arduino.is_open:
        arduino.close()
        print("Conexão serial fechada")
```

### Instruções para execução:
1. Carregue o código no Arduino
2. Identifique a porta COM do Arduino (verificando em Ferramentas > Porta no Arduino IDE)
3. Ajuste a variável `porta_serial` no script Python
4. Execute o script e verifique se os LEDs respondem aos comandos

## 4. Detector de Cores com OpenCV

Agora vamos criar um sistema que detecta cores na câmera e controla os LEDs do Arduino:

```python
import cv2
import numpy as np
import serial
import time
import argparse

# Função para encontrar a porta serial automaticamente
def encontrar_arduino():
    import serial.tools.list_ports
    
    portas = list(serial.tools.list_ports.comports())
    for p in portas:
        if 'Arduino' in p.description or 'CH340' in p.description or 'ACM' in p.device:
            return p.device
    return None

# Parser de argumentos
parser = argparse.ArgumentParser(description='Controle de LEDs do Arduino com detecção de cores')
parser.add_argument('--porta', type=str, default=None, help='Porta serial do Arduino (ex: COM3, /dev/ttyACM0)')
args = parser.parse_args()

# Configuração da porta serial
porta_serial = args.porta
if porta_serial is None:
    porta_serial = encontrar_arduino()
    if porta_serial is None:
        print("Arduino não encontrado. Especifique a porta manualmente com --porta")
        exit(1)

print(f"Tentando conectar na porta {porta_serial}...")

# Conecta ao Arduino
try:
    arduino = serial.Serial(porta_serial, 9600, timeout=1)
    print(f"Conectado à porta {porta_serial}")
    time.sleep(2)  # Espera a inicialização
except serial.SerialException as e:
    print(f"Erro ao conectar: {e}")
    exit(1)

# Inicializa a câmera
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Erro ao abrir a câmera")
    arduino.close()
    exit(1)

# Status dos LEDs
led_status = {"vermelho": False, "verde": False, "azul": False}

# Faixas de cores HSV
# Vermelho (devido à natureza circular do HSV, dividimos em duas faixas)
vermelho_baixo1 = np.array([0, 100, 100])
vermelho_alto1 = np.array([10, 255, 255])
vermelho_baixo2 = np.array([160, 100, 100])
vermelho_alto2 = np.array([180, 255, 255])

# Verde
verde_baixo = np.array([40, 100, 100])
verde_alto = np.array([80, 255, 255])

# Azul
azul_baixo = np.array([100, 100, 100])
azul_alto = np.array([140, 255, 255])

print("Sistema iniciado! Mostre objetos coloridos para a câmera.")
print("Pressione 'q' para sair.")

# Para evitar enviar comandos repetidos
ultimo_comando = ""
ultimo_envio = time.time()

try:
    while True:
        # Captura o frame
        ret, frame = cap.read()
        if not ret:
            print("Erro ao capturar frame")
            break
            
        # Espelha horizontalmente para interface mais natural
        frame = cv2.flip(frame, 1)
        
        # Converte para HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Cria máscaras para cada cor
        mascara_vermelho1 = cv2.inRange(hsv, vermelho_baixo1, vermelho_alto1)
        mascara_vermelho2 = cv2.inRange(hsv, vermelho_baixo2, vermelho_alto2)
        mascara_vermelho = cv2.bitwise_or(mascara_vermelho1, mascara_vermelho2)
        
        mascara_verde = cv2.inRange(hsv, verde_baixo, verde_alto)
        mascara_azul = cv2.inRange(hsv, azul_baixo, azul_alto)
        
        # Aplica operações morfológicas para reduzir ruído
        kernel = np.ones((5, 5), np.uint8)
        mascara_vermelho = cv2.morphologyEx(mascara_vermelho, cv2.MORPH_OPEN, kernel)
        mascara_verde = cv2.morphologyEx(mascara_verde, cv2.MORPH_OPEN, kernel)
        mascara_azul = cv2.morphologyEx(mascara_azul, cv2.MORPH_OPEN, kernel)
        
        # Encontra contornos
        contornos_vermelho, _ = cv2.findContours(mascara_vermelho, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contornos_verde, _ = cv2.findContours(mascara_verde, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contornos_azul, _ = cv2.findContours(mascara_azul, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Analisa contornos e determina ações
        comando = None
        
        # Verifica vermelho
        area_vermelha = 0
        for c in contornos_vermelho:
            area = cv2.contourArea(c)
            area_vermelha += area
            if area > 5000:  # Área mínima para considerar
                cv2.drawContours(frame, [c], 0, (0, 0, 255), 3)
                if not led_status["vermelho"]:
                    comando = "VERMELHO_ON"
                    led_status["vermelho"] = True
                    
        if area_vermelha < 3000 and led_status["vermelho"]:
            comando = "VERMELHO_OFF"
            led_status["vermelho"] = False
            
        # Verifica verde
        area_verde = 0
        for c in contornos_verde:
            area = cv2.contourArea(c)
            area_verde += area
            if area > 5000:
                cv2.drawContours(frame, [c], 0, (0, 255, 0), 3)
                if not led_status["verde"]:
                    comando = "VERDE_ON"
                    led_status["verde"] = True
                    
        if area_verde < 3000 and led_status["verde"]:
            comando = "VERDE_OFF"
            led_status["verde"] = False
            
        # Verifica azul
        area_azul = 0
        for c in contornos_azul:
            area = cv2.contourArea(c)
            area_azul += area
            if area > 5000:
                cv2.drawContours(frame, [c], 0, (255, 0, 0), 3)
                if not led_status["azul"]:
                    comando = "AZUL_ON"
                    led_status["azul"] = True
                    
        if area_azul < 3000 and led_status["azul"]:
            comando = "AZUL_OFF"
            led_status["azul"] = False
        
        # Envia comando se for diferente do último e tiver passado pelo menos 0.5 segundos
        tempo_atual = time.time()
        if comando and (comando != ultimo_comando or tempo_atual - ultimo_envio > 1.0):
            arduino.write(f"{comando}\n".encode())
            ultimo_comando = comando
            ultimo_envio = tempo_atual
            print(f"Comando enviado: {comando}")
            
            # Lê resposta do Arduino
            time.sleep(0.1)  # Pequena pausa para garantir que o Arduino tenha tempo de responder
            while arduino.in_waiting > 0:
                resposta = arduino.readline().decode('utf-8').strip()
                print(f"Arduino: {resposta}")
        
        # Exibe informações na imagem
        cv2.putText(frame, f"LED Vermelho: {led_status['vermelho']}", (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        cv2.putText(frame, f"LED Verde: {led_status['verde']}", (10, 60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(frame, f"LED Azul: {led_status['azul']}", (10, 90), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
                    
        # Exibe um quadro de referência para colocar os objetos
        cv2.rectangle(frame, (int(frame.shape[1]/2)-100, int(frame.shape[0]/2)-100),
                     (int(frame.shape[1]/2)+100, int(frame.shape[0]/2)+100), (255, 255, 255), 2)
        cv2.putText(frame, "Coloque objetos coloridos aqui", 
                   (int(frame.shape[1]/2)-140, int(frame.shape[0]/2)-110),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        # Mostra o resultado
        cv2.imshow("Detector de Cores", frame)
        
        # Sai com 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except KeyboardInterrupt:
    print("\nPrograma encerrado pelo usuário")
except Exception as e:
    print(f"Erro: {e}")
finally:
    # Desliga todos os LEDs antes de sair
    arduino.write("TODOS_OFF\n".encode())
    time.sleep(0.5)
    
    # Libera os recursos
    cap.release()
    cv2.destroyAllWindows()
    arduino.close()
    print("Programa finalizado")
```

## 5. Detector de Movimentos

Como desafio adicional, implemente um sistema que detecta movimento e controla os LEDs:

```python
import cv2
import numpy as np
import serial
import time
import argparse
from collections import deque

# Função para encontrar a porta serial automaticamente
def encontrar_arduino():
    import serial.tools.list_ports
    
    portas = list(serial.tools.list_ports.comports())
    for p in portas:
        if 'Arduino' in p.description or 'CH340' in p.description or 'ACM' in p.device:
            return p.device
    return None

# Parser de argumentos
parser = argparse.ArgumentParser(description='Detector de movimentos para Arduino')
parser.add_argument('--porta', type=str, default=None, help='Porta serial do Arduino')
parser.add_argument('--sensibilidade', type=float, default=20, help='Sensibilidade do detector (5-50)')
args = parser.parse_args()

# Configuração da porta serial
porta_serial = args.porta
if porta_serial is None:
    porta_serial = encontrar_arduino()
    if porta_serial is None:
        print("Arduino não encontrado. Especifique a porta manualmente com --porta")
        exit(1)
        
# Sensibilidade ajustável (maior = mais sensível)
sensibilidade = max(5, min(50, args.sensibilidade))
print(f"Sensibilidade: {sensibilidade}")

# Conecta ao Arduino
try:
    arduino = serial.Serial(porta_serial, 9600, timeout=1)
    print(f"Conectado à porta {porta_serial}")
    time.sleep(2)  # Espera a inicialização
except serial.SerialException as e:
    print(f"Erro ao conectar: {e}")
    exit(1)

# Inicializa a câmera
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Erro ao abrir a câmera")
    arduino.close()
    exit(1)

# Histórico dos últimos níveis de movimento
historico_movimentos = deque(maxlen=10)
todos_leds_ligados = False

# Captura o primeiro frame para comparação
ret, frame1 = cap.read()
if not ret:
    print("Erro ao capturar o frame inicial")
    cap.release()
    arduino.close()
    exit(1)
    
# Converte para escala de cinza e aplica blur
cinza1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
cinza1 = cv2.GaussianBlur(cinza1, (21, 21), 0)

print("Sistema de detecção de movimento iniciado!")
print("Pressione 'q' para sair.")

try:
    while True:
        # Captura o próximo frame
        ret, frame2 = cap.read()
        if not ret:
            print("Erro ao capturar frame")
            break
            
        # Converte para escala de cinza e aplica blur
        cinza2 = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
        cinza2 = cv2.GaussianBlur(cinza2, (21, 21), 0)
        
        # Calcula a diferença entre os frames
        frameDelta = cv2.absdiff(cinza1, cinza2)
        thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]
        
        # Dilata a imagem para preencher buracos
        thresh = cv2.dilate(thresh, None, iterations=2)
        
        # Encontra contornos
        contornos, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Variável para medir quantidade de movimento
        movimento_total = 0
        
        # Processa cada contorno
        for contorno in contornos:
            area = cv2.contourArea(contorno)
            movimento_total += area
            
            # Se o contorno é maior que um certo tamanho, consideramos movimento significativo
            if area > 500:
                (x, y, w, h) = cv2.boundingRect(contorno)
                cv2.rectangle(frame2, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
        # Atualiza o histórico
        historico_movimentos.append(movimento_total)
        
        # Calcula a média de movimento recente
        movimento_medio = sum(historico_movimentos) / len(historico_movimentos) if historico_movimentos else 0
        
        # Determina ação com base no nível de movimento
        if movimento_medio > sensibilidade * 1000:  # Movimento significativo
            if not todos_leds_ligados:
                arduino.write("TODOS_ON\n".encode())
                todos_leds_ligados = True
                print("Movimento detectado - LEDs LIGADOS")
        elif todos_leds_ligados and movimento_medio < sensibilidade * 500:  # Pouco movimento
            arduino.write("TODOS_OFF\n".encode())
            todos_leds_ligados = False
            print("Movimento cessou - LEDs DESLIGADOS")
            
        # Se houver movimento moderado, pisca o LED azul
        if sensibilidade * 500 <= movimento_medio < sensibilidade * 1000:
            if time.time() % 1 < 0.5:  # Pisca a cada meio segundo
                arduino.write("AZUL_ON\n".encode())
            else:
                arduino.write("AZUL_OFF\n".encode())
        
        # Exibe informações na tela
        cv2.putText(frame2, f"Movimento: {int(movimento_medio)}", (10, 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        
        # Adiciona uma barra de movimento
        barra_comprimento = int(min(movimento_medio / 100, frame2.shape[1]-20))
        cv2.rectangle(frame2, (10, 40), (10 + barra_comprimento, 60), (0, 0, 255), -1)
        
        # Status dos LEDs
        cv2.putText(frame2, f"LEDs: {'LIGADOS' if todos_leds_ligados else 'DESLIGADOS'}", 
                   (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Exibe o frame
        cv2.imshow("Detector de Movimento", frame2)
        cv2.imshow("Threshold", thresh)
        
        # Atualiza o frame anterior
        cinza1 = cinza2
        
        # Verifica se o usuário quer sair
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        # Aumenta sensibilidade
        elif key == ord('+') or key == ord('='):
            sensibilidade = min(50, sensibilidade + 2)
            print(f"Sensibilidade aumentada para: {sensibilidade}")
        # Diminui sensibilidade
        elif key == ord('-'):
            sensibilidade = max(5, sensibilidade - 2)
            print(f"Sensibilidade reduzida para: {sensibilidade}")

except KeyboardInterrupt:
    print("\nPrograma encerrado pelo usuário")
except Exception as e:
    print(f"Erro: {e}")
finally:
    # Desliga todos os LEDs
    arduino.write("TODOS_OFF\n".encode())
    time.sleep(0.5)
    
    # Libera recursos
    cap.release()
    cv2.destroyAllWindows()
    arduino.close()
    print("Programa finalizado")
```

## 6. Desafio Final: Controle por Gestos

Como desafio final, implemente um sistema que reconhece gestos simples da mão para controlar os LEDs do Arduino. Para isso, você pode utilizar bibliotecas como MediaPipe ou implementar seu próprio detector baseado em contornos.

### Exemplos de gestos:
- 1 dedo: Liga LED Vermelho
- 2 dedos: Liga LED Verde
- 3 dedos: Liga LED Azul
- 5 dedos (mão aberta): Liga todos os LEDs
- Punho fechado: Desliga todos os LEDs

## Critérios de Avaliação

1. **Comunicação Arduino-Python**: Implementação correta da comunicação bidirecional
2. **Detecção de cores**: Calibração adequada das faixas de cores e implementação da detecção
3. **Detecção de movimento**: Algoritmo de detecção robusto e parametrizável
4. **Interface de usuário**: Visualização clara do estado do sistema e feedback visual
5. **Código limpo**: Organização, comentários e tratamento de erros
6. **Relatório**: Documentação clara do funcionamento do sistema e análise dos resultados

## Referências e Recursos Adicionais

- [Documentação PySerial](https://pyserial.readthedocs.io/)
- [Tutoriais OpenCV](https://docs.opencv.org/master/d9/df8/tutorial_root.html)
- [Biblioteca MediaPipe para Detecção de Mãos](https://google.github.io/mediapipe/solutions/hands)
- [Tutorial de Comunicação Serial Arduino-Python](https://www.arduino.cc/en/Tutorial/SerialEvent)
- [Guia de Detecção de Cores com OpenCV](https://docs.opencv.org/4.x/df/d9d/tutorial_py_colorspaces.html)

## Entrega
Submeta:
1. Código Arduino (.ino)
2. Scripts Python (.py)
3. Relatório com:
   - Descrição da implementação
   - Capturas de tela ou vídeos demonstrando o funcionamento
   - Desafios encontrados e soluções adotadas
   - Possíveis melhorias e aplicações práticas
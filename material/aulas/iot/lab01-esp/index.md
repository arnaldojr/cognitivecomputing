
# Lab 01: Introdução ao ESP32 e Conectividade IoT

Neste laboratório, vamos explorar o ESP32, um microcontrolador poderoso com recursos integrados de Wi-Fi e Bluetooth, tornando-o ideal para projetos IoT. Aprenderemos como configurar o ambiente de desenvolvimento, conectar à internet, utilizar Bluetooth e enviar dados para plataformas IoT.

## Objetivos de Aprendizado

- Configurar o ambiente de desenvolvimento para ESP32 no Arduino IDE
- Conectar o ESP32 a uma rede Wi-Fi
- Implementar comunicação por Bluetooth
- Enviar dados para uma plataforma IoT (ThingSpeak)
- Criar um servidor web simples com ESP32

## Pré-requisitos

- Arduino IDE instalado
- Placa ESP32
- Cabo micro-USB
- Acesso a uma rede Wi-Fi
- Conhecimentos básicos de Arduino e eletrônica

## 1. Configurando o ESP32 no Arduino IDE

### 1.1 Instalando o Suporte à Placa ESP32

Para programar o ESP32 usando o `Arduino IDE **1.X**`, precisamos adicionar o pacote de suporte:

1. Abra o Arduino IDE
2. Vá para **Arquivo > Preferências**
3. No campo "URLs Adicionais para Gerenciadores de Placas", adicione:
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
4. Clique em "OK"
5. Vá para **Ferramentas > Placa > Gerenciador de Placas**
6. Pesquise por "ESP32" e instale "ESP32 by Espressif Systems"
7. Após a instalação, selecione sua placa ESP32 em **Ferramentas > Placa > ESP32**

!!! warning
    Faça isso apenas para a versão 1.x do arduino IDE, para a versão 2.X você pode pesquisar e instalar diretamente a placa esp32.

### 1.2 Testando a Instalação: Blink com ESP32

Vamos começar com um exemplo simples para garantir que tudo esteja configurado corretamente:

```cpp
// Programa básico de piscar LED para ESP32

// LED interno do ESP32 (pode variar dependendo da placa)
const int LED_BUILTIN = 2;

void setup() {
  // Inicializa o pino digital como saída
  pinMode(LED_BUILTIN, OUTPUT);
  
  // Inicia a comunicação serial
  Serial.begin(115200);
  Serial.println("ESP32 Blink Test");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // Liga o LED
  Serial.println("LED ON");
  delay(1000);                      // Espera 1 segundo
  
  digitalWrite(LED_BUILTIN, LOW);    // Desliga o LED
  Serial.println("LED OFF");
  delay(1000);                      // Espera 1 segundo
}
```

Carregue este código e verifique se o LED interno do ESP32 pisca. Se funcionar, sua configuração está correta.

## 2. Conectando ESP32 à Internet via Wi-Fi

### 2.1 Conexão Wi-Fi Básica

O ESP32 tem capacidade Wi-Fi integrada. Vamos criar um exemplo simples para conectar à sua rede Wi-Fi:

```cpp
#include <WiFi.h>

// Credenciais da rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\nConectando à rede Wi-Fi");
  
  // Inicia conexão com Wi-Fi
  WiFi.begin(ssid, password);
  
  // Aguarda conexão
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("Conectado à rede Wi-Fi!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Seu código aqui
  delay(1000);
}
```

!!! warning
    Antes de carregar o código, substitua "SUA_REDE_WIFI" e "SUA_SENHA_WIFI" pelas informações da sua rede Wi-Fi.

### 2.2 Criando um Servidor Web Simples

Vamos aproveitar a conexão Wi-Fi para criar um servidor web simples que exibe dados e controla um LED:

```cpp
#include <WiFi.h>
#include <WebServer.h>

// Credenciais da rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

// Definindo a porta do servidor web (padrão: 80)
WebServer server(80);

// LED pin
const int ledPin = 2;
bool ledStatus = LOW;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  
  // Conectar à rede Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("Conectado à rede Wi-Fi!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
  
  // Rotas para o servidor web
  server.on("/", handleRoot);
  server.on("/led/on", handleLedOn);
  server.on("/led/off", handleLedOff);
  
  // Inicia o servidor
  server.begin();
  Serial.println("Servidor HTTP iniciado");
}

void loop() {
  server.handleClient();
}

// Função para página inicial
void handleRoot() {
  String html = "<!DOCTYPE html><html><head>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  html += "<style>body{font-family:Arial;text-align:center;margin-top:50px;}";
  html += "button{background-color:#4CAF50;border:none;color:white;padding:15px 32px;";
  html += "text-align:center;font-size:16px;margin:4px 2px;cursor:pointer;border-radius:10px;}</style>";
  html += "</head><body>";
  html += "<h1>ESP32 Web Server</h1>";
  html += "<p>Status do LED: ";
  html += (ledStatus == HIGH) ? "LIGADO" : "DESLIGADO";
  html += "</p>";
  html += "<button onclick=\"location.href='/led/on'\">LIGAR LED</button>";
  html += "<button onclick=\"location.href='/led/off'\">DESLIGAR LED</button>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// Função para ligar o LED
void handleLedOn() {
  ledStatus = HIGH;
  digitalWrite(ledPin, ledStatus);
  server.sendHeader("Location", "/");
  server.send(303);
}

// Função para desligar o LED
void handleLedOff() {
  ledStatus = LOW;
  digitalWrite(ledPin, ledStatus);
  server.sendHeader("Location", "/");
  server.send(303);
}
```

Após carregar o código, abra um navegador e digite o endereço IP exibido no monitor serial. Você verá uma página web simples que permite controlar o LED do ESP32.

## 3. Comunicação Bluetooth com ESP32

O ESP32 possui Bluetooth integrado, tanto o clássico quanto o BLE (Bluetooth Low Energy). Vamos criar um exemplo usando BLE:

### 3.1 Servidor BLE Simples

```cpp
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// Definição dos UUIDs para serviço e característica BLE
// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando servidor BLE...");

  // Cria o dispositivo BLE
  BLEDevice::init("ESP32-BLE-Demo");
  
  // Cria o servidor BLE
  BLEServer *pServer = BLEDevice::createServer();
  
  // Cria um serviço BLE
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  // Cria uma característica BLE
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  
  // Define o valor inicial da característica
  pCharacteristic->setValue("Hello from ESP32!");
  
  // Inicia o serviço
  pService->start();
  
  // Inicia a publicidade do serviço
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  
  Serial.println("Servidor BLE iniciado! Aguardando conexões...");
}

void loop() {
  // O BLE funciona em segundo plano, então não precisamos fazer nada específico no loop
  delay(2000);
}
```

Para testar, você pode usar aplicativos como "nRF Connect" (disponível para Android e iOS) para escanear, conectar e interagir com o servidor BLE do ESP32.

## 4. Enviando Dados para Plataformas IoT: ThingSpeak

[ThingSpeak](https://thingspeak.com/) é uma plataforma IoT popular que permite coletar e armazenar dados de sensores na nuvem, além de analisá-los e visualizá-los.

### 4.1 Configurando ThingSpeak

Antes de começar:

1. Crie uma conta no [ThingSpeak](https://thingspeak.com/)
2. Crie um novo canal (Channel)
3. Configure os campos (Fields) que deseja usar para seus dados
4. Anote a API Key do canal (Write API Key)

### 4.2 Enviando Dados de Temperatura e Umidade

Para este exemplo, vamos simular dados de temperatura e umidade e enviá-los para o ThingSpeak:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

// Credenciais da rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

// Credenciais ThingSpeak
String apiKey = "SUA_API_KEY_THINGSPEAK";
const char* server = "api.thingspeak.com";

// Intervalo entre envios de dados (em milissegundos)
const unsigned long intervaloEnvio = 20000;  // 20 segundos
unsigned long tempoUltimoEnvio = 0;

void setup() {
  Serial.begin(115200);
  
  // Conectar à rede Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando à rede Wi-Fi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("Wi-Fi conectado");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Verifica se é hora de enviar dados
  if ((millis() - tempoUltimoEnvio) > intervaloEnvio) {
    // Simula leituras de sensores
    float temperatura = random(20, 30) + (float)random(0, 100) / 100.0; // 20-30°C
    float umidade = random(40, 90) + (float)random(0, 100) / 100.0;     // 40-90%
    
    // Mostra leituras no monitor serial
    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.println(" °C");
    Serial.print("Umidade: ");
    Serial.print(umidade);
    Serial.println(" %");
    
    // Verifica se a conexão Wi-Fi ainda está ativa
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      
      // Monta a URL com os dados
      String url = "http://api.thingspeak.com/update?api_key=" + apiKey;
      url += "&field1=" + String(temperatura);
      url += "&field2=" + String(umidade);
      
      // Inicia conexão HTTP
      http.begin(url);
      
      // Envia requisição GET
      int httpCode = http.GET();
      
      // Verifica o código de retorno
      if (httpCode > 0) {
        String resposta = http.getString();
        Serial.println("Resposta do ThingSpeak: " + resposta);
      } else {
        Serial.println("Falha na requisição HTTP");
      }
      
      http.end();
    } else {
      Serial.println("Conexão Wi-Fi perdida. Tentando reconectar...");
      WiFi.reconnect();
    }
    
    // Atualiza o tempo do último envio
    tempoUltimoEnvio = millis();
  }
}
```

!!! warning
    Substitua "SUA_API_KEY_THINGSPEAK" pela chave de API que você obteve ao criar seu canal no ThingSpeak.

## 5. MQTT com ESP32: Comunicação com Broker

O protocolo MQTT é amplamente utilizado em aplicações IoT devido à sua leveza e eficiência. Vamos criar um exemplo de publicação/assinatura usando MQTT:

### 5.1 Instalando a biblioteca PubSubClient

1. No Arduino IDE, vá para **Ferramentas > Gerenciar Bibliotecas**
2. Pesquise por "PubSubClient"
3. Instale a biblioteca criada por Nick O'Leary

### 5.2 Cliente MQTT Básico

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

// Credenciais da rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

// Configuração do servidor MQTT (Broker)
const char* mqtt_server = "broker.mqtt.cool";  // Broker público
const int mqtt_port = 1883;
const char* mqtt_clientID = "ESP32Client";
const char* mqtt_username = "";  // Se não precisar de autenticação
const char* mqtt_password = "";  // Se não precisar de autenticação

// Tópicos MQTT
const char* topico_pub = "esp32/dados";    // Tópico para publicar
const char* topico_sub = "esp32/comandos";  // Tópico para assinar

// Instanciando objetos
WiFiClient espClient;
PubSubClient client(espClient);

// Variáveis para controle de tempo
unsigned long ultimoEnvio = 0;
const long intervalo = 5000;  // Intervalo de envio (5 segundos)

// LED para indicação visual
const int ledPin = 2;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando à rede ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

// Função de callback chamada quando uma mensagem é recebida em um tópico assinado
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida no tópico: ");
  Serial.println(topic);
  
  Serial.print("Conteúdo: ");
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
  
  // Verifica se a mensagem é para ligar ou desligar o LED
  if (String(topic) == topico_sub) {
    if (message == "ON") {
      digitalWrite(ledPin, HIGH);
      Serial.println("LED ligado");
    } else if (message == "OFF") {
      digitalWrite(ledPin, LOW);
      Serial.println("LED desligado");
    }
  }
}

void reconnect() {
  // Loop até reconectar
  while (!client.connected()) {
    Serial.print("Tentando conexão MQTT...");
    
    // Tenta conectar
    if (client.connect(mqtt_clientID, mqtt_username, mqtt_password)) {
      Serial.println("conectado");
      
      // Assina o tópico
      client.subscribe(topico_sub);
    } else {
      Serial.print("falhou, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      
      // Aguarda antes de tentar novamente
      delay(5000);
    }
  }
}

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
  
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  // Verifica conexão com o broker MQTT
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Publica dados periodicamente
  unsigned long agora = millis();
  if (agora - ultimoEnvio > intervalo) {
    ultimoEnvio = agora;
    
    // Simula dados de sensor
    float temperatura = random(20, 30) + (float)random(0, 100) / 100.0;
    
    // Converte float para String
    String temp_str = String(temperatura);
    
    // Publica a temperatura
    Serial.print("Publicando temperatura: ");
    Serial.println(temp_str);
    client.publish(topico_pub, temp_str.c_str());
  }
}
```

Para testar este exemplo, você pode usar clientes MQTT como o [MQTT Explorer](http://mqtt-explorer.com/) ou o aplicativo [MQTT Dash](https://play.google.com/store/apps/details?id=net.routix.mqttdash) para Android.

## 6. Criando um Projeto Integrado: Estação Meteorológica IoT

Agora, vamos combinar várias técnicas em um projeto mais completo: uma estação meteorológica que publica dados via MQTT e também pode ser acessada por uma página web.

Para este projeto, você precisará:

- ESP32
- Sensor DHT11 (temperatura e umidade)
- Resistor de 10K (para o DHT11)
- Jumpers

### 6.1 Instalação da Biblioteca DHT

1. No Arduino IDE, vá para **Ferramentas > Gerenciar Bibliotecas**
2. Pesquise por "DHT sensor library"
3. Instale a biblioteca criada por Adafruit

### 6.2 Código Completo da Estação Meteorológica

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Configuração do DHT
#define DHTPIN 4      // Pino do DHT
#define DHTTYPE DHT11 // Tipo do sensor DHT
DHT dht(DHTPIN, DHTTYPE);

// Configuração da rede Wi-Fi
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA_WIFI";

// Configuração do servidor MQTT
const char* mqtt_server = "broker.mqtt.cool";
const int mqtt_port = 1883;
const char* mqtt_clientID = "ESP32WeatherStation";
const char* mqtt_topic = "estacao/dados";

// Servidor Web
WebServer server(80);

// Variáveis para armazenar leituras
float temperatura = 0;
float umidade = 0;
unsigned long ultimaLeitura = 0;
const long intervaloLeitura = 2000;  // Intervalo entre leituras (2 segundos)
unsigned long ultimoEnvioMQTT = 0;
const long intervaloEnvioMQTT = 10000;  // Intervalo entre envios MQTT (10 segundos)

// Objetos de comunicação
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Configuração do WiFi
void setupWiFi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando à rede ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

// Reconexão ao broker MQTT
void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Tentando conectar ao MQTT...");
    if (mqttClient.connect(mqtt_clientID)) {
      Serial.println("conectado");
    } else {
      Serial.print("falhou, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

// Lê os dados do sensor DHT
void lerSensorDHT() {
  // Verifica se já passou o intervalo para nova leitura
  unsigned long agora = millis();
  if (agora - ultimaLeitura > intervaloLeitura) {
    ultimaLeitura = agora;
    
    // Lê temperatura e umidade
    float novaUmidade = dht.readHumidity();
    float novaTemperatura = dht.readTemperature();
    
    // Verifica se a leitura foi bem-sucedida
    if (!isnan(novaUmidade) && !isnan(novaTemperatura)) {
      umidade = novaUmidade;
      temperatura = novaTemperatura;
      Serial.print("Temperatura: ");
      Serial.print(temperatura);
      Serial.print("°C, Umidade: ");
      Serial.print(umidade);
      Serial.println("%");
    } else {
      Serial.println("Falha na leitura do sensor DHT!");
    }
  }
}

// Envia dados via MQTT
void enviarDadosMQTT() {
  unsigned long agora = millis();
  if (agora - ultimoEnvioMQTT > intervaloEnvioMQTT) {
    ultimoEnvioMQTT = agora;
    
    if (mqttClient.connected()) {
      // Cria JSON com os dados
      StaticJsonDocument<128> doc;
      doc["dispositivo"] = mqtt_clientID;
      doc["temperatura"] = temperatura;
      doc["umidade"] = umidade;
      
      char buffer[128];
      serializeJson(doc, buffer);
      
      // Publica no tópico
      mqttClient.publish(mqtt_topic, buffer);
      Serial.println("Dados enviados via MQTT");
    }
  }
}

// Configuração do servidor web
void configureWebServer() {
  // Rota principal - página HTML
  server.on("/", HTTP_GET, []() {
    String html = "<!DOCTYPE html><html><head>";
    html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    html += "<meta http-equiv='refresh' content='5'>"; // Atualiza a página a cada 5 segundos
    html += "<style>body{font-family:Arial;text-align:center;margin-top:50px;background-color:#f0f0f0;}";
    html += ".container{max-width:400px;margin:0 auto;background-color:white;padding:20px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);}";
    html += ".data{font-size:24px;margin:20px 0;}";
    html += ".temp{color:#e74c3c;}.humid{color:#3498db;}";
    html += "h1{color:#2c3e50;}</style>";
    html += "</head><body>";
    html += "<div class='container'>";
    html += "<h1>ESP32 Estação Meteorológica</h1>";
    html += "<div class='data temp'>Temperatura: <strong>" + String(temperatura) + " °C</strong></div>";
    html += "<div class='data humid'>Umidade: <strong>" + String(umidade) + " %</strong></div>";
    html += "<p>Última atualização: " + String(millis() / 1000) + " segundos atrás</p>";
    html += "<p><small>Endereço IP: " + WiFi.localIP().toString() + "</small></p>";
    html += "</div></body></html>";
    server.send(200, "text/html", html);
  });
  
  // API REST para obter dados em formato JSON
  server.on("/api/dados", HTTP_GET, []() {
    StaticJsonDocument<128> doc;
    doc["temperatura"] = temperatura;
    doc["umidade"] = umidade;
    doc["timestamp"] = millis() / 1000;
    
    String json;
    serializeJson(doc, json);
    server.send(200, "application/json", json);
  });
  
  // Inicia o servidor
  server.begin();
  Serial.println("Servidor web iniciado");
}

void setup() {
  Serial.begin(115200);
  
  // Inicia o sensor DHT
  dht.begin();
  
  // Configura o Wi-Fi
  setupWiFi();
  
  // Configura o cliente MQTT
  mqttClient.setServer(mqtt_server, mqtt_port);
  
  // Configura o servidor web
  configureWebServer();
  
  Serial.println("Sistema inicializado");
}

void loop() {
  // Verifica conexão MQTT
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();
  
  // Lê o sensor
  lerSensorDHT();
  
  // Envia dados por MQTT
  enviarDadosMQTT();
  
  // Processa requisições web
  server.handleClient();
}
```

!!! warning
    Lembre-se de alterar as credenciais de Wi-Fi e outras configurações conforme necessário.

## 7. Desafios e Exercícios

### Desafio 1: Controle Remoto via MQTT

Modifique o código da estação meteorológica para receber comandos via MQTT que possam controlar um componente adicional, como um LED RGB ou um buzzer.

### Desafio 2: Armazenamento de Dados no SPIFFS

Utilize o sistema de arquivos SPIFFS do ESP32 para armazenar dados históricos quando a conexão com a internet estiver indisponível.

### Desafio 3: Integração com Alexa

Pesquise e implemente uma integração do ESP32 com a Alexa da Amazon para controle de voz de dispositivos conectados.

## Recursos Adicionais

- [Documentação oficial do ESP32](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Biblioteca ESP32 para Arduino](https://github.com/espressif/arduino-esp32)
- [Biblioteca WiFi para ESP32](https://github.com/espressif/arduino-esp32/tree/master/libraries/WiFi)
- [PubSubClient para MQTT](https://github.com/knolleary/pubsubclient)
- [ThingSpeak Documentation](https://www.mathworks.com/help/thingspeak/)


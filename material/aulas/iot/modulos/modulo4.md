# Módulo 4: Funções e Modularização

Bem-vindo ao **Módulo 4** do curso **"Programação em Arduino: Conceitos Fundamentais sem Hardware"**. Neste módulo, você irá aprofundar seu conhecimento sobre funções na linguagem de programação Arduino (C/C++) e aprenderá sobre modularização de código. Compreender como criar e utilizar funções de forma eficiente é essencial para escrever códigos mais organizados, reutilizáveis e fáceis de manter.

---

## Objetivos do Módulo

- Compreender o conceito de funções e sua importância na programação.
- Aprender a definir e chamar funções em Arduino.
- Trabalhar com parâmetros e valores de retorno em funções.
- Entender o escopo de variáveis e a diferença entre variáveis locais e globais.
- Implementar modularização de código para melhorar a organização e reutilização.
- Resolver exercícios práticos para consolidar o conhecimento sobre funções e modularização.

---

## 1. Introdução às Funções

### 1.1 O que são Funções?

Funções são blocos de código que realizam tarefas específicas e podem ser reutilizadas em diferentes partes de um programa. Elas ajudam a dividir um programa em partes menores e mais gerenciáveis, facilitando o desenvolvimento e a manutenção do código.

### 1.2 Benefícios do Uso de Funções

- **Reutilização de Código:** Escreva o código uma vez e use-o múltiplas vezes.
- **Organização:** Separe o código em blocos lógicos para melhorar a legibilidade.
- **Manutenção:** Facilite a correção e atualização do código.
- **Abstração:** Simplifique a complexidade do programa escondendo detalhes de implementação.

---

## 2. Definindo e Chamando Funções

### 2.1 Definição de Funções

Para definir uma função em Arduino, você especifica o tipo de retorno, o nome da função e, opcionalmente, os parâmetros que ela recebe.

**Sintaxe:**

```
tipo_retorno nome_funcao(tipo_parametro1 param1, tipo_parametro2 param2, ...) {
    // Corpo da função
}
```

**Exemplo:**

```cpp
void saudacao() {
    Serial.println("Bem-vindo ao curso de Arduino!");
}
```

### 2.2 Chamando Funções

Após definir uma função, você pode chamá-la em qualquer parte do seu código (desde que esteja no escopo correto).

**Exemplo de Chamada:**

```cpp
void setup() {
    Serial.begin(9600);
    saudacao(); // Chamada da função saudacao
}

void loop() {
    // Código do loop
}
```

**Explicação:**

- A função `saudacao()` é chamada dentro da função `setup()`.
- Quando o programa é executado, o texto "Bem-vindo ao curso de Arduino!" será impresso no Monitor Serial uma vez no início.

---

## 3. Parâmetros e Valores de Retorno

### 3.1 Funções com Parâmetros

Parâmetros permitem que você passe informações para as funções, tornando-as mais flexíveis e reutilizáveis.

**Sintaxe:**

```
void nome_funcao(tipo_parametro1 param1, tipo_parametro2 param2) {
    // Corpo da função
}
```

**Exemplo:**

```cpp
void imprimirMensagem(String mensagem) {
    Serial.println(mensagem);
}

void setup() {
    Serial.begin(9600);
    imprimirMensagem("Olá, Arduino!");
}

void loop() {
    // Código do loop
}
```

**Explicação:**

- A função `imprimirMensagem` recebe uma `String` como parâmetro e imprime no Monitor Serial.
- Isso permite que você passe diferentes mensagens para a função sem precisar alterá-la.

### 3.2 Funções com Retorno

Funções podem retornar valores que podem ser utilizados em outras partes do programa.

**Sintaxe:**

```
tipo_retorno nome_funcao(tipo_parametro1 param1, tipo_parametro2 param2) {
    // Corpo da função
    return valor;
}
```

**Exemplo:**

```cpp
int soma(int a, int b) {
    return a + b;
}

void setup() {
    Serial.begin(9600);
    int resultado = soma(5, 3);
    Serial.print("Resultado da soma: ");
    Serial.println(resultado);
}

void loop() {
    // Código do loop
}
```

**Explicação:**

- A função `soma` recebe dois inteiros como parâmetros e retorna a soma deles.
- O valor retornado é armazenado na variável `resultado` e impresso no Monitor Serial.

---

## 4. Escopo de Variáveis

### 4.1 Variáveis Locais

Variáveis declaradas dentro de uma função são chamadas de variáveis locais e só podem ser acessadas dentro dessa função.

**Exemplo:**

```cpp
void setup() {
    Serial.begin(9600);
    int numero = 10; // Variável local
    Serial.println(numero);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A variável `numero` só existe dentro da função `setup()`.
- Tentativas de acessar `numero` fora de `setup()` resultarão em erro.

### 4.2 Variáveis Globais

Variáveis declaradas fora de todas as funções são chamadas de variáveis globais e podem ser acessadas por qualquer função no programa.

**Exemplo:**

```cpp
int contador = 0; // Variável global

void setup() {
    Serial.begin(9600);
    Serial.println(contador);
}

void loop() {
    contador++;
    Serial.println(contador);
    delay(1000);
}
```

**Explicação:**

- A variável `contador` é acessível tanto em `setup()` quanto em `loop()`.
- O valor de `contador` é incrementado e impresso a cada segundo.

---

## 5. Modularização de Código

### 5.1 Por que Modularizar?

Modularizar significa dividir o código em módulos ou funções menores que realizam tarefas específicas. Isso melhora a legibilidade, facilita a manutenção e permite a reutilização de código.

### 5.2 Exemplos de Modularização

**Exemplo 1: Separar Cálculo da Impressão**

```cpp
int calcularSoma(int a, int b) {
    return a + b;
}

void imprimirSoma(int a, int b) {
    int resultado = calcularSoma(a, b);
    Serial.print("A soma de ");
    Serial.print(a);
    Serial.print(" e ");
    Serial.print(b);
    Serial.print(" é: ");
    Serial.println(resultado);
}

void setup() {
    Serial.begin(9600);
    imprimirSoma(5, 7);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `calcularSoma` realiza o cálculo da soma.
- A função `imprimirSoma` gerencia a impressão do resultado.
- Isso separa as responsabilidades, tornando o código mais organizado.

**Exemplo 2: Controle de LEDs com Funções**

```cpp
const int ledVerde = 9;
const int ledVermelho = 10;

void ligarLedVerde() {
    digitalWrite(ledVerde, HIGH);
}

void desligarLedVerde() {
    digitalWrite(ledVerde, LOW);
}

void ligarLedVermelho() {
    digitalWrite(ledVermelho, HIGH);
}

void desligarLedVermelho() {
    digitalWrite(ledVermelho, LOW);
}

void setup() {
    pinMode(ledVerde, OUTPUT);
    pinMode(ledVermelho, OUTPUT);
}

void loop() {
    ligarLedVerde();
    delay(1000);
    desligarLedVerde();
    ligarLedVermelho();
    delay(1000);
    desligarLedVermelho();
}
```

**Explicação:**

- Funções específicas para ligar e desligar LEDs verde e vermelho.
- Facilita a manipulação dos LEDs sem repetir o código.

---

## 6. Exemplos Práticos

### 6.1 Função para Calcular Fatorial

```cpp
long calcularFatorial(int numero) {
    if (numero < 0) return -1; // Retorna -1 para números negativos
    long fatorial = 1;
    for (int i = 1; i <= numero; i++) {
        fatorial *= i;
    }
    return fatorial;
}

void setup() {
    Serial.begin(9600);
    int num = 5;
    long resultado = calcularFatorial(num);
    if (resultado != -1) {
        Serial.print("Fatorial de ");
        Serial.print(num);
        Serial.print(" é ");
        Serial.println(resultado);
    } else {
        Serial.println("Erro: Fatorial de número negativo não existe.");
    }
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `calcularFatorial` retorna o fatorial de um número.
- Verifica se o número é negativo e retorna erro se for.
- O resultado é impresso no Monitor Serial.

### 6.2 Função para Verificar Palíndromo

```cpp
bool ehPalindromo(String palavra) {
    int inicio = 0;
    int fim = palavra.length() - 1;
    while (inicio < fim) {
        if (tolower(palavra[inicio]) != tolower(palavra[fim])) {
            return false;
        }
        inicio++;
        fim--;
    }
    return true;
}

void setup() {
    Serial.begin(9600);
    String palavra = "Radar";
    if (ehPalindromo(palavra)) {
        Serial.println(palavra + " é um palíndromo.");
    } else {
        Serial.println(palavra + " não é um palíndromo.");
    }
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `ehPalindromo` verifica se uma palavra é um palíndromo.
- Compara caracteres do início e fim da string.
- Ignora diferenças de maiúsculas e minúsculas.

### 6.3 Função para Converter Celsius em Fahrenheit

```cpp
float celsiusParaFahrenheit(float celsius) {
    return (celsius * 9.0 / 5.0) + 32.0;
}

void setup() {
    Serial.begin(9600);
    float tempC = 25.0;
    float tempF = celsiusParaFahrenheit(tempC);
    Serial.print(tempC);
    Serial.print("°C é igual a ");
    Serial.print(tempF);
    Serial.println("°F.");
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `celsiusParaFahrenheit` converte uma temperatura de Celsius para Fahrenheit.
- O resultado é impresso no Monitor Serial.

---

## 7. Exercícios Práticos

### Exercício 1: Função para Calcular Média

- **Tarefa:** Crie uma função que calcula a média de três números fornecidos pelo usuário e imprime o resultado.

- **Dicas:**
  
  - Utilize uma função que recebe três parâmetros e retorna a média.
  
  ```cpp
  float calcularMedia(float a, float b, float c) {
      return (a + b + c) / 3.0;
  }
  
  void setup() {
      Serial.begin(9600);
      float num1 = 7.5;
      float num2 = 8.0;
      float num3 = 9.5;
      float media = calcularMedia(num1, num2, num3);
      Serial.print("A média é: ");
      Serial.println(media);
  }
  
  void loop() {
      // Não há código no loop
  }
  ```

### Exercício 2: Função para Determinar o Maior Número

- **Tarefa:** Escreva uma função que recebe dois números e retorna o maior deles. Use essa função no seu programa para comparar dois números fornecidos pelo usuário.

- **Exemplo de Código:**
  
  ```cpp
  int encontrarMaior(int a, int b) {
      if (a > b) {
          return a;
      } else {
          return b;
      }
  }
  
  void setup() {
      Serial.begin(9600);
      int num1 = 15;
      int num2 = 20;
      int maior = encontrarMaior(num1, num2);
      Serial.print("O maior número é: ");
      Serial.println(maior);
  }
  
  void loop() {
      // Não há código no loop
  }
  ```

### Exercício 3: Função para Verificar Número Par ou Ímpar

- **Tarefa:** Desenvolva uma função que recebe um número inteiro e retorna `true` se o número for par ou `false` se for ímpar. Utilize essa função para verificar a paridade de um número fornecido pelo usuário.

- **Exemplo de Código:**
  
  ```cpp
  bool ehPar(int numero) {
      return (numero % 2 == 0);
  }
  
  void setup() {
      Serial.begin(9600);
      int num = 7;
      if (ehPar(num)) {
          Serial.println("O número é par.");
      } else {
          Serial.println("O número é ímpar.");
      }
  }
  
  void loop() {
      // Não há código no loop
  }
  ```

---

## 8. Conceitos Importantes

### 8.1 Recursão

A recursão ocorre quando uma função chama a si mesma para resolver um problema. É uma técnica poderosa, mas deve ser usada com cuidado para evitar loops infinitos.

**Exemplo de Função Recursiva para Calcular Fatorial:**

```cpp
long fatorialRecursivo(int numero) {
    if (numero <= 1) {
        return 1;
    } else {
        return numero * fatorialRecursivo(numero - 1);
    }
}

void setup() {
    Serial.begin(9600);
    int num = 5;
    long resultado = fatorialRecursivo(num);
    Serial.print("Fatorial de ");
    Serial.print(num);
    Serial.print(" é ");
    Serial.println(resultado);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `fatorialRecursivo` chama a si mesma até que a condição base seja atingida (`numero <= 1`).
- Calcula o fatorial de forma recursiva.

### 8.2 Funções Inline

Funções inline são sugestões ao compilador para inserir o corpo da função no ponto de chamada, reduzindo a sobrecarga de chamadas de função.

**Exemplo:**

```cpp
inline int quadrado(int x) {
    return x * x;
}

void setup() {
    Serial.begin(9600);
    int num = 4;
    int q = quadrado(num);
    Serial.print("Quadrado de ");
    Serial.print(num);
    Serial.print(" é ");
    Serial.println(q);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `quadrado` é definida como `inline`, sugerindo ao compilador para otimizar a chamada da função.

### 8.3 Sobrecarga de Funções

Sobrecarga permite definir múltiplas funções com o mesmo nome, mas com diferentes parâmetros.

**Exemplo:**

```cpp
int soma(int a, int b) {
    return a + b;
}

float soma(float a, float b) {
    return a + b;
}

void setup() {
    Serial.begin(9600);
    Serial.print("Soma de 5 e 3: ");
    Serial.println(soma(5, 3));
    Serial.print("Soma de 5.5 e 3.2: ");
    Serial.println(soma(5.5, 3.2));
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- Duas funções `soma` são definidas, uma para inteiros e outra para floats.
- O compilador decide qual função chamar com base nos argumentos fornecidos.


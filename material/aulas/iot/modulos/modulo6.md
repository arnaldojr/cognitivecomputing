# Módulo 6: Strings e Operações com Texto

Bem-vindo ao **Módulo 6** do curso **"Programação em Arduino: Conceitos Fundamentais sem Hardware"**. Neste módulo, você irá explorar o uso de strings e operações com texto na linguagem de programação Arduino (C/C++). Manipular strings é essencial para lidar com entradas e saídas de texto, especialmente ao interagir com o Monitor Serial.

---

## Objetivos do Módulo

- Compreender o conceito de strings em Arduino e como utilizá-las.
- Aprender a declarar, inicializar e manipular strings.
- Trabalhar com funções de manipulação de strings como `length()`, `concat()`, `substring()`, `indexOf()`, `replace()`, entre outras.
- Realizar operações de comparação e busca em strings.
- Implementar funções que utilizam strings como parâmetros e retornos.
- Entender o gerenciamento de memória ao trabalhar com strings.
- Resolver exercícios práticos para consolidar o conhecimento sobre strings e operações com texto.

---

## 1. Introdução às Strings

### 1.1 O que são Strings?

Em C/C++, uma **string** é uma sequência de caracteres terminada por um caractere nulo (`'\0'`). No Arduino, as strings podem ser manipuladas de duas formas principais:

- **Strings em C:** Usam arrays de caracteres (`char`).
- **Classe `String`:** Uma classe que encapsula strings e oferece métodos para manipulação mais fácil.

### 1.2 Diferenças entre Strings em C e a Classe `String`

- **Strings em C:**
  - Mais eficientes em termos de memória.
  - Menos seguros, pois requerem cuidado com o gerenciamento de memória.
  - Manipulação mais complexa.
  
- **Classe `String`:**
  - Mais fácil de usar com métodos integrados para manipulação.
  - Menos eficiente em termos de memória, podendo levar a fragmentação.
  - Conveniente para iniciantes.

---

## 2. Trabalhando com a Classe `String`

### 2.1 Declaração e Inicialização

**Declarando uma String:**

```cpp
String mensagem;
```

**Inicializando uma String:**

```cpp
String mensagem = "Olá, Arduino!";
```

### 2.2 Concatenando Strings

Você pode concatenar strings usando o operador `+` ou o método `concat()`.

**Usando o Operador `+`:**

```cpp
String saudacao = "Olá";
String nome = "Maria";
String mensagem = saudacao + ", " + nome + "!";
```

**Usando o Método `concat()`:**

```cpp
String mensagem = "Olá";
mensagem.concat(", Maria!");
```

### 2.3 Acessando Caracteres Individuais

Você pode acessar caracteres individuais de uma string usando a notação de colchetes `[]`.

```cpp
String palavra = "Arduino";
char primeiraLetra = palavra[0]; // 'A'
char ultimaLetra = palavra[6];    // 'o'
```

### 2.4 Métodos Comuns da Classe `String`

- **`length()`:** Retorna o tamanho da string.

```cpp
int tamanho = mensagem.length();
```

- **`substring()`:** Retorna uma substring de uma string.

```cpp
String sub = mensagem.substring(0, 4); // "Olá,"
```

- **`indexOf()`:** Retorna o índice da primeira ocorrência de um caractere ou substring.

```cpp
int pos = mensagem.indexOf("Maria"); // 5
```

- **`replace()`:** Substitui todas as ocorrências de uma substring por outra.

```cpp
mensagem.replace("Maria", "João"); // "Olá, João!"
```

- **`toLowerCase()` e `toUpperCase()`:** Convertem a string para minúsculas ou maiúsculas.

```cpp
mensagem.toLowerCase(); // "olá, joão!"
mensagem.toUpperCase(); // "OLÁ, JOÃO!"
```

---

## 3. Manipulação de Strings com Arrays de Caracteres

### 3.1 Declarando e Inicializando Arrays de Caracteres

```cpp
char mensagem[] = "Olá, Arduino!";
```

### 3.2 Funções de Manipulação de Strings em C

- **`strlen()`:** Retorna o comprimento da string.

```cpp
int tamanho = strlen(mensagem);
```

- **`strcpy()`:** Copia uma string para outra.

```cpp
char copia[20];
strcpy(copia, mensagem);
```

- **`strcat()`:** Concatena duas strings.

```cpp
char saudacao[20] = "Bem-vindo ";
strcat(saudacao, "ao Arduino!");
```

- **`strcmp()`:** Compara duas strings.

```cpp
if(strcmp(mensagem, copia) == 0) {
    // Strings são iguais
}
```

---

## 4. Entrada e Saída de Strings com o Monitor Serial

### 4.1 Enviando Strings para o Monitor Serial

```cpp
void setup() {
    Serial.begin(9600);
    String mensagem = "Olá, Mundo!";
    Serial.println(mensagem);
}

void loop() {
    // Não há código no loop
}
```

### 4.2 Recebendo Strings do Monitor Serial

```cpp
String entrada = "";

void setup() {
    Serial.begin(9600);
    Serial.println("Digite uma mensagem:");
}

void loop() {
    if(Serial.available() > 0) {
        entrada = Serial.readString();
        Serial.print("Você digitou: ");
        Serial.println(entrada);
        Serial.println("Digite outra mensagem:");
    }
}
```

**Explicação:**

- O programa solicita que o usuário digite uma mensagem.
- Usa `Serial.readString()` para ler a entrada do usuário.
- Imprime a mensagem recebida no Monitor Serial.

---

## 5. Funções com Strings

### 5.1 Passando Strings como Parâmetros

```cpp
void imprimirMensagem(String msg) {
    Serial.println(msg);
}

void setup() {
    Serial.begin(9600);
    imprimirMensagem("Bem-vindo ao Módulo 6!");
}

void loop() {
    // Não há código no loop
}
```

### 5.2 Funções que Retornam Strings

```cpp
String obterSaudacao() {
    return "Olá, estudante!";
}

void setup() {
    Serial.begin(9600);
    String saudacao = obterSaudacao();
    Serial.println(saudacao);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `obterSaudacao` retorna uma string.
- A string retornada é armazenada na variável `saudacao` e impressa no Monitor Serial.

---

## 6. Gerenciamento de Memória com Strings

### 6.1 Uso de Strings vs. Arrays de Caracteres

- **Strings da Classe `String`:**
  - Mais fáceis de usar.
  - Podem causar fragmentação de memória em sistemas com recursos limitados.
  
- **Arrays de Caracteres:**
  - Mais eficientes em termos de memória.
  - Requerem mais cuidado na manipulação.

### 6.2 Evitando Fragmentação de Memória

- **Evitar Muitas Operações de Concatenação:**
  - Operações frequentes de `concat` podem fragmentar a memória.
  
- **Usar Strings de Forma Constante:**
  - Declarar strings como constantes (`const char*`) sempre que possível.
  
```cpp
const char* mensagem = "Bem-vindo!";
```

- **Gerenciar o Tamanho dos Arrays:**
  - Certifique-se de que os arrays de caracteres sejam grandes o suficiente para armazenar as strings e o caractere nulo.

```cpp
char mensagem[20] = "Este é um exemplo seguro.";
```

---

## 7. Exemplos Práticos

### 7.1 Criando um Sistema de Mensagens

```cpp
String mensagens[] = {"Mensagem 1", "Mensagem 2", "Mensagem 3"};
int totalMensagens = 3;

void setup() {
    Serial.begin(9600);
    for(int i = 0; i < totalMensagens; i++) {
        Serial.println(mensagens[i]);
    }
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- Armazena múltiplas mensagens em um array de strings.
- Imprime cada mensagem no Monitor Serial usando um laço `for`.

### 7.2 Manipulando Nomes de Usuários

```cpp
String nome = "";
String saudacao = "";

void setup() {
    Serial.begin(9600);
    Serial.println("Digite seu nome:");
}

void loop() {
    if(Serial.available() > 0) {
        nome = Serial.readString();
        saudacao = "Olá, " + nome + "!";
        Serial.println(saudacao);
        Serial.println("Digite seu nome novamente ou reinicie o Arduino para sair.");
    }
}
```

**Explicação:**

- Recebe o nome do usuário via Monitor Serial.
- Concatena a saudação com o nome fornecido.
- Imprime a saudação personalizada.

### 7.3 Processando Dados de Sensor com Strings

```cpp
float temperatura = 23.5;
float umidade = 60.0;

void setup() {
    Serial.begin(9600);
    
    String dados = "Temperatura: " + String(temperatura) + "°C, Umidade: " + String(umidade) + "%";
    Serial.println(dados);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- Simula a leitura de dados de sensores.
- Concatena os valores em uma string formatada.
- Imprime os dados no Monitor Serial.

---

## 8. Exercícios Práticos

### Exercício 1: Conversor de Temperatura

- **Tarefa:** Crie um programa que recebe uma temperatura em Celsius do usuário e converte para Fahrenheit, exibindo o resultado no Monitor Serial.
  
- **Exemplo de Código:**

```cpp
float celsius = 0.0;
float fahrenheit = 0.0;

void setup() {
    Serial.begin(9600);
    Serial.println("Digite a temperatura em Celsius:");
}

void loop() {
    if(Serial.available() > 0) {
        celsius = Serial.parseFloat();
        fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
        Serial.print(celsius);
        Serial.print("°C é igual a ");
        Serial.print(fahrenheit);
        Serial.println("°F.");
        Serial.println("Digite outra temperatura ou reinicie o Arduino para sair.");
    }
}
```

### Exercício 2: Verificação de Palíndromo

- **Tarefa:** Desenvolva um programa que recebe uma palavra do usuário e verifica se é um palíndromo (mesmo de trás para frente).
  
- **Exemplo de Código:**

```cpp
String palavra = "";
bool ehPalindromo = true;

bool verificarPalindromo(String str) {
    int inicio = 0;
    int fim = str.length() - 1;
    
    while(inicio < fim) {
        if(tolower(str[inicio]) != tolower(str[fim])) {
            return false;
        }
        inicio++;
        fim--;
    }
    return true;
}

void setup() {
    Serial.begin(9600);
    Serial.println("Digite uma palavra para verificar se é um palíndromo:");
}

void loop() {
    if(Serial.available() > 0) {
        palavra = Serial.readString();
        ehPalindromo = verificarPalindromo(palavra);
        
        if(ehPalindromo) {
            Serial.print(palavra);
            Serial.println(" é um palíndromo.");
        } else {
            Serial.print(palavra);
            Serial.println(" não é um palíndromo.");
        }
        
        Serial.println("Digite outra palavra ou reinicie o Arduino para sair.");
    }
}
```

### Exercício 3: Contador de Vogais

- **Tarefa:** Escreva um programa que recebe uma frase do usuário e conta o número de vogais presentes nela.
  
- **Exemplo de Código:**

```cpp
String frase = "";
int contadorVogais = 0;

int contarVogais(String str) {
    int count = 0;
    for(int i = 0; i < str.length(); i++) {
        char c = tolower(str[i]);
        if(c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            count++;
        }
    }
    return count;
}

void setup() {
    Serial.begin(9600);
    Serial.println("Digite uma frase para contar as vogais:");
}

void loop() {
    if(Serial.available() > 0) {
        frase = Serial.readString();
        contadorVogais = contarVogais(frase);
        Serial.print("Número de vogais: ");
        Serial.println(contadorVogais);
        Serial.println("Digite outra frase ou reinicie o Arduino para sair.");
    }
}
```

---

## 9. Conceitos Importantes

### 9.1 Vetores vs. Arrays

Em C/C++, os termos "vetor" e "array" são frequentemente usados de forma intercambiável para se referirem a estruturas de dados que armazenam múltiplos elementos do mesmo tipo.

### 9.2 Operações com Strings

- **Concatenação:**
  - Combine duas ou mais strings em uma única string.
  
- **Comparação:**
  - Verifique se duas strings são iguais ou diferentes.
  
- **Busca:**
  - Encontre a posição de uma substring ou caractere dentro de uma string.
  
- **Substituição:**
  - Substitua partes de uma string por outras strings.

### 9.3 Gerenciamento de Memória com Strings

- **Uso de `const char*`:** Para strings que não serão modificadas, use ponteiros para constantes de caracteres.
  
```cpp
const char* saudacao = "Bem-vindo ao Arduino!";
```

- **Evitar Repetição de Operações de Concatenação:** Minimize o uso de operações que alteram a string constantemente para reduzir a fragmentação de memória.

```cpp
char mensagem[50];
strcpy(mensagem, "Este é um exemplo seguro.");
```

- **Gerenciar o Tamanho dos Arrays:** Certifique-se de que os arrays de caracteres são suficientemente grandes para armazenar as strings e o caractere nulo.

```cpp
char mensagem[50] = "Este é um exemplo seguro.";
```

### 9.4 Boas Práticas com Strings

- **Evitar Uso Excessivo da Classe `String`:** Em sistemas com memória limitada, prefira arrays de caracteres para evitar fragmentação.
  
- **Sempre Verificar o Tamanho dos Arrays:** Evite overflow garantindo que os arrays são grandes o suficiente para armazenar as strings e o caractere nulo.
  
```cpp
char mensagem[50];
strcpy(mensagem, "Este é um exemplo seguro.");
```

- **Usar Funções de Manipulação de Strings com Cuidado:** Certifique-se de que as funções utilizadas não ultrapassem os limites dos arrays.


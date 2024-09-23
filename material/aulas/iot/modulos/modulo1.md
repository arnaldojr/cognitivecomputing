# Módulo 1: Introdução ao Arduino IDE e Fundamentos de Programação

Bem-vindo ao **Módulo 1** do curso *"Programação em Arduino: Conceitos Fundamentais sem Hardware"*. Neste módulo, você será introduzido ao ambiente de desenvolvimento Arduino IDE e aos fundamentos da programação em C/C++ no contexto do Arduino. O foco será na compreensão da estrutura básica de um sketch (programa Arduino) e nos conceitos iniciais de variáveis e tipos de dados.

## Objetivos do Módulo

- **Instalar e configurar o Arduino IDE.**
- **Compreender a estrutura básica de um sketch Arduino.**
- **Familiarizar-se com as funções `setup()` e `loop()`.**
- **Escrever e executar o primeiro programa "Hello, World!" usando o Monitor Serial.**
- **Entender a declaração e inicialização de variáveis.**
- **Conhecer os tipos de dados primitivos em Arduino: `int`, `float`, `char`, `boolean`.**

## 1. Introdução ao Arduino IDE

### 1.1 O que é o Arduino IDE?

O **Arduino IDE** (*Integrated Development Environment*) é um ambiente de desenvolvimento integrado que permite escrever, compilar e enviar código para placas Arduino. Ele fornece uma interface simples e intuitiva para programar microcontroladores usando uma linguagem baseada em C/C++.

### 1.2 Instalação do Arduino IDE

**Passos para instalar o Arduino IDE:**

#### Download:

1. Acesse o site oficial: [https://www.arduino.cc/en/software](https://www.arduino.cc/en/software)
2. Escolha a versão compatível com o seu sistema operacional (Windows, macOS, Linux).

#### Instalação:

1. Execute o arquivo baixado e siga as instruções de instalação padrão.
2. Aceite os termos de licença e selecione os componentes que deseja instalar.

#### Primeira Execução:

1. Abra o Arduino IDE após a instalação para verificar se está funcionando corretamente.
   
**Nota:** Para este curso, não é necessário ter uma placa Arduino conectada ao computador, pois utilizaremos o Monitor Serial e simuladores quando necessário.

## 2. Estrutura Básica de um Sketch Arduino

Um **sketch** é o nome dado a um programa escrito para o Arduino. Todo sketch possui uma estrutura básica composta pelas funções `setup()` e `loop()`.

### 2.1 Função `setup()`

```cpp
void setup() {
  // Código a ser executado uma vez no início
}
```

**Propósito:** A função `setup()` é chamada uma vez quando o programa inicia. É usada para inicializar variáveis, configurar pinos e iniciar bibliotecas.

### 2.2 Função `loop()`

```cpp
void loop() {
  // Código a ser executado continuamente
}
```

**Propósito:** Após a execução da `setup()`, a função `loop()` é chamada repetidamente em um ciclo infinito. É onde o código principal do programa é executado, permitindo que ele responda a eventos e execute tarefas contínuas.

### 2.3 Exemplo de Estrutura Básica

```cpp
void setup() {
  // Inicializações
}

void loop() {
  // Código principal
}
```

## 3. Primeiro Programa: "Hello, World!" no Monitor Serial

Vamos escrever um programa simples que imprime "Hello, World!" no Monitor Serial do Arduino IDE.

### 3.1 O que é o Monitor Serial?

O **Monitor Serial** é uma ferramenta integrada no Arduino IDE que permite enviar e receber dados pela porta serial. Ele é útil para depuração e interação com o programa em execução.

### 3.2 Escrevendo o Programa

**Passo 1:** Abra o Arduino IDE e crie um novo sketch.

**Passo 2:** Digite o seguinte código:

```cpp
void setup() {
  Serial.begin(9600); // Inicia a comunicação serial a 9600 bps
}

void loop() {
  Serial.println("Hello, World!"); // Imprime "Hello, World!" no Monitor Serial
  delay(1000); // Aguarda 1 segundo
}
```

**Explicação do Código:**

- `Serial.begin(9600);` inicia a comunicação serial na taxa de 9600 bits por segundo (bps).
- `Serial.println("Hello, World!");` envia a string "Hello, World!" seguida de uma nova linha para o Monitor Serial.
- `delay(1000);` pausa a execução por 1000 milissegundos (1 segundo).

**Passo 3:** Compilar e Executar

- **Compilar:** Clique no botão de verificação (✔) para compilar o código e verificar se há erros.
- **Executar:** Como não estamos usando hardware físico, podemos simular a execução ou simplesmente entender que o código enviaria "Hello, World!" ao Monitor Serial a cada segundo.

**Passo 4:** Abrir o Monitor Serial

1. No Arduino IDE, clique em **Ferramentas > Monitor Serial** ou pressione `Ctrl + Shift + M`.
2. Configure a taxa de transmissão para **9600 baud** (deve corresponder ao valor definido em `Serial.begin()`).

**Resultado Esperado:**

```python
Hello, World!
Hello, World!
Hello, World!
...
```

A mensagem será repetida a cada segundo.

## 4. Variáveis e Tipos de Dados

Variáveis são espaços na memória do microcontrolador que armazenam valores que podem ser alterados durante a execução do programa. Em Arduino, as variáveis devem ser declaradas com um tipo de dado específico.

### 4.1 Declaração e Inicialização de Variáveis

**Declaração:** Informar ao compilador o nome e o tipo da variável.

```cpp
int numero; // Declara uma variável inteira chamada 'numero'
```

**Inicialização:** Atribuir um valor inicial à variável.

```cpp
numero = 10; // Atribui o valor 10 à variável 'numero'
```

**Declaração e Inicialização Simultânea:**

```cpp
int numero = 10; // Declara e inicializa 'numero' com 10
```

### 4.2 Tipos de Dados Primitivos

#### 4.2.1 `int` (Inteiro)

- **Descrição:** Armazena números inteiros, positivos ou negativos, sem decimais.
- **Tamanho:** Geralmente 16 bits no Arduino Uno (varia conforme a placa).
- **Intervalo:** De -32.768 a 32.767 (para 16 bits).
- **Exemplo:**

  ```cpp
  int idade = 25;
  ```

#### 4.2.2 `float` (Ponto Flutuante)

- **Descrição:** Armazena números com casas decimais.
- **Tamanho:** 32 bits.
- **Precisão:** Aproximadamente 6 a 7 dígitos significativos.
- **Exemplo:**

  ```cpp
  float temperatura = 36.5;
  ```

#### 4.2.3 `char` (Caractere)

- **Descrição:** Armazena um único caractere ou pequenos números inteiros.
- **Tamanho:** 8 bits.
- **Intervalo:** De -128 a 127.
- **Exemplo:**

  ```cpp
  char letra = 'A';
  ```

#### 4.2.4 `boolean` (Booleano)

- **Descrição:** Armazena valores lógicos `true` (verdadeiro) ou `false` (falso).
- **Tamanho:** 8 bits (apesar de usar apenas 1 bit).
- **Exemplo:**

  ```cpp
  boolean estado = true;
  ```

### 4.3 Exemplo Prático: Usando Variáveis

Vamos criar um programa que declara diferentes tipos de variáveis e as imprime no Monitor Serial.

**Código:**

```cpp
void setup() {
  Serial.begin(9600);

  int numero = 42;
  float pi = 3.1416;
  char caractere = 'C';
  boolean verdade = true;

  Serial.print("Número inteiro: ");
  Serial.println(numero);

  Serial.print("Número float: ");
  Serial.println(pi);

  Serial.print("Caractere: ");
  Serial.println(caractere);

  Serial.print("Valor booleano: ");
  Serial.println(verdade);
}

void loop() {
  // Não há código no loop
}
```

**Explicação do Código:**

- `Serial.print()` vs. `Serial.println()`:
  - `Serial.print()` envia o dado sem pular para a próxima linha.
  - `Serial.println()` envia o dado e adiciona uma nova linha.
- As variáveis são declaradas e inicializadas dentro da função `setup()`.

**Resultado Esperado no Monitor Serial:**

```yaml
Número inteiro: 42
Número float: 3.14
Caractere: C
Valor booleano: 1
```

**Observação:**

- O valor booleano `true` é impresso como `1`, e `false` seria `0`.
- O número `float` pode ser arredondado dependendo da configuração.

## 5. Exercícios Práticos

### Exercício 1: Modificar o "Hello, World!"

**Tarefa:** Altere o programa "Hello, World!" para que ele peça ao usuário um nome (via Monitor Serial) e então exiba "Hello, [Nome]!".

**Dicas:**

- Use `Serial.readString()` para ler a entrada do usuário.
- Lembre-se de configurar o Monitor Serial para enviar nova linha ou retorno de carro após a entrada.

**Código Exemplo:**

```cpp
String nome; // Declara uma variável do tipo String

void setup() {
  Serial.begin(9600);
  Serial.println("Digite seu nome:");

  // Aguarda até que haja dados disponíveis
  while (Serial.available() == 0) {
    // Aguarda o usuário digitar
  }

  nome = Serial.readString(); // Lê a string digitada
  Serial.print("Hello, ");
  Serial.print(nome);
}

void loop() {
  // Código vazio
}
```

### Exercício 2: Calculadora Simples

**Tarefa:** Escreva um programa que solicite dois números inteiros ao usuário e exiba a soma, subtração, multiplicação e divisão desses números.

**Dicas:**

- Use `Serial.parseInt()` para ler números inteiros do Monitor Serial.
- Cuidado com a divisão por zero.

## 6. Conceitos Importantes

### 6.1 Comentários no Código

**Comentários de Linha Única:** Usando `//`

```cpp
// Este é um comentário de linha única
```

**Comentários de Múltiplas Linhas:** Usando `/* */`

```cpp
/*
   Este é um comentário
   de múltiplas linhas
*/
```

**Importância:** Comentários ajudam a documentar o código, tornando-o mais legível e fácil de entender.

### 6.2 Boas Práticas

- **Nomes de Variáveis Descritivos:** Use nomes que indiquem o propósito da variável.

  ```cpp
  int contador; // Melhor que 'c' ou 'x'
  ```

- **Indentação e Formatação:** Organize o código com indentação consistente para melhorar a legibilidade.
- **Evitar Variáveis Globais Desnecessárias:** Declare variáveis dentro do menor escopo possível.



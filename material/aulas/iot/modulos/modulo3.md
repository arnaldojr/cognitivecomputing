
# Módulo 3: Estruturas de Controle de Fluxo

Bem-vindo ao **Módulo 3** do curso **"Programação em Arduino: Conceitos Fundamentais sem Hardware"**. Neste módulo, você irá explorar as estruturas de controle de fluxo na linguagem de programação Arduino (C/C++). Estas estruturas são essenciais para criar programas que possam tomar decisões e executar tarefas repetitivas de forma eficiente.

---

## Objetivos do Módulo

- Compreender as estruturas de controle de fluxo: condicionais (`if`, `else`, `switch-case`) e loops (`for`, `while`, `do-while`).
- Aplicar condicionais para tomar decisões baseadas em condições lógicas.
- Utilizar loops para executar tarefas repetitivas.
- Entender a diferença entre diferentes tipos de loops e quando utilizá-los.
- Resolver exercícios práticos para consolidar o conhecimento sobre estruturas de controle de fluxo.

---

## 1. Introdução às Estruturas de Controle de Fluxo

As estruturas de controle de fluxo permitem que o programa desvie seu caminho de execução com base em condições ou repita certas partes do código várias vezes. Elas são fundamentais para criar programas dinâmicos e eficientes.

### 1.1 Por que Usar Estruturas de Controle de Fluxo?

Sem estruturas de controle de fluxo, os programas seriam lineares e incapazes de responder a diferentes situações ou de realizar tarefas repetitivas de forma eficiente. Elas permitem:

- **Tomada de Decisão:** Executar diferentes blocos de código com base em condições.
- **Repetição:** Executar blocos de código múltiplas vezes sem duplicação.
- **Organização:** Melhorar a legibilidade e manutenção do código.

---

## 2. Condicionais: `if`, `else` e `switch-case`

### 2.1 Estrutura `if` e `else`

A estrutura `if` é usada para executar um bloco de código se uma condição específica for verdadeira. A estrutura `else` pode ser usada para executar um bloco de código alternativo se a condição for falsa.

#### Sintaxe do `if`:

```
if (condição) {
    // Código a ser executado se a condição for verdadeira
}
```

#### Sintaxe do `if-else`:

```
if (condição) {
    // Código a ser executado se a condição for verdadeira
} else {
    // Código a ser executado se a condição for falsa
}
```

#### Exemplo Prático:

```cpp
int idade = 20;

void setup() {
  Serial.begin(9600);

  if (idade >= 18) {
    Serial.println("Você é maior de idade.");
  } else {
    Serial.println("Você é menor de idade.");
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- Se a variável `idade` for maior ou igual a 18, o Monitor Serial exibirá "Você é maior de idade.".
- Caso contrário, exibirá "Você é menor de idade.".

### 2.2 Estrutura `switch-case`

A estrutura `switch-case` é uma forma mais organizada de lidar com múltiplas condições baseadas no valor de uma única variável.

#### Sintaxe do `switch-case`:

```
switch (expressão) {
    case valor1:
        // Código a ser executado se expressão == valor1
        break;
    case valor2:
        // Código a ser executado se expressão == valor2
        break;
    ...
    default:
        // Código a ser executado se expressão não corresponder a nenhum caso
}
```

#### Exemplo Prático:

```cpp
char opcao = 'B';

void setup() {
  Serial.begin(9600);

  switch (opcao) {
    case 'A':
      Serial.println("Opção A selecionada.");
      break;
    case 'B':
      Serial.println("Opção B selecionada.");
      break;
    case 'C':
      Serial.println("Opção C selecionada.");
      break;
    default:
      Serial.println("Opção inválida.");
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- O programa verifica o valor da variável `opcao`.
- Se `opcao` for 'A', 'B' ou 'C', imprime a mensagem correspondente.
- Se não corresponder a nenhum dos casos, executa o bloco `default`.

### 2.3 Exemplos de Uso

#### Exemplo 1: Verificar Nota

```cpp
int nota = 85;

void setup() {
  Serial.begin(9600);

  if (nota >= 90) {
    Serial.println("A");
  } else if (nota >= 80) {
    Serial.println("B");
  } else if (nota >= 70) {
    Serial.println("C");
  } else if (nota >= 60) {
    Serial.println("D");
  } else {
    Serial.println("F");
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- Dependendo do valor da variável `nota`, uma letra correspondente à faixa de nota é exibida.

#### Exemplo 2: Seleção de Dia da Semana

```cpp
int dia = 3;

void setup() {
  Serial.begin(9600);

  switch (dia) {
    case 1:
      Serial.println("Domingo");
      break;
    case 2:
      Serial.println("Segunda-feira");
      break;
    case 3:
      Serial.println("Terça-feira");
      break;
    case 4:
      Serial.println("Quarta-feira");
      break;
    case 5:
      Serial.println("Quinta-feira");
      break;
    case 6:
      Serial.println("Sexta-feira");
      break;
    case 7:
      Serial.println("Sábado");
      break;
    default:
      Serial.println("Dia inválido");
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- O programa imprime o nome do dia da semana com base no valor da variável `dia`.

---

## 3. Laços de Repetição: `for`, `while` e `do-while`

### 3.1 Estrutura `for`

O laço `for` é usado quando o número de iterações é conhecido previamente. Ele consiste em três partes: inicialização, condição e incremento/decremento.

#### Sintaxe do `for`:

```
for (inicialização; condição; incremento) {
    // Código a ser repetido
}
```

#### Exemplo Prático:

```cpp
void setup() {
  Serial.begin(9600);

  for (int i = 1; i <= 5; i++) {
    Serial.print("Contagem: ");
    Serial.println(i);
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- O laço inicia com `i = 1`.
- Enquanto `i <= 5`, executa o bloco de código.
- Após cada iteração, incrementa `i` em 1.

### 3.2 Estrutura `while`

O laço `while` é usado quando o número de iterações não é conhecido e depende de uma condição ser verdadeira.

#### Sintaxe do `while`:

```
while (condição) {
    // Código a ser repetido
}
```

#### Exemplo Prático:

```cpp
int contador = 1;

void setup() {
  Serial.begin(9600);

  while (contador <= 5) {
    Serial.print("Contagem: ");
    Serial.println(contador);
    contador++;
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- Enquanto `contador <= 5`, o bloco de código é executado.
- Incrementa `contador` em cada iteração para evitar um loop infinito.

### 3.3 Estrutura `do-while`

O laço `do-while` é similar ao `while`, mas garante que o bloco de código seja executado pelo menos uma vez antes de verificar a condição.

#### Sintaxe do `do-while`:

```
do {
    // Código a ser repetido
} while (condição);
```

#### Exemplo Prático:

```cpp
int contador = 1;

void setup() {
  Serial.begin(9600);

  do {
    Serial.print("Contagem: ");
    Serial.println(contador);
    contador++;
  } while (contador <= 5);
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- O bloco de código dentro do `do` é executado primeiro.
- Depois, a condição é verificada para determinar se o laço deve continuar.

### 3.4 Comparação entre `for`, `while` e `do-while`

- **`for`:** Ideal quando o número de iterações é conhecido.
- **`while`:** Útil quando o número de iterações depende de uma condição que pode mudar dinamicamente.
- **`do-while`:** Garante que o bloco de código seja executado pelo menos uma vez.

### 3.5 Exemplos de Uso

#### Exemplo 1: Sequência de Fibonacci com `for`

```cpp
int n = 10;

void setup() {
  Serial.begin(9600);

  int a = 0, b = 1, c;
  Serial.println("Sequência de Fibonacci:");

  for (int i = 0; i < n; i++) {
    Serial.println(a);
    c = a + b;
    a = b;
    b = c;
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- Imprime os primeiros `n` números da sequência de Fibonacci usando um laço `for`.

#### Exemplo 2: Verificar se um Número é Primo com `while`

```cpp
int numero = 29;
bool isPrimo = true;
int i = 2;

void setup() {
  Serial.begin(9600);

  if (numero <= 1) {
    isPrimo = false;
  }

  while (i <= numero / 2) {
    if (numero % i == 0) {
      isPrimo = false;
      break;
    }
    i++;
  }

  if (isPrimo) {
    Serial.println(numero);
    Serial.println(" é um número primo.");
  } else {
    Serial.println(numero);
    Serial.println(" não é um número primo.");
  }
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- Verifica se `numero` é primo utilizando um laço `while`.
- Se encontrar um divisor, define `isPrimo` como `false` e sai do laço.

#### Exemplo 3: Solicitar Entradas do Usuário com `do-while`

```cpp
int numero;

void setup() {
  Serial.begin(9600);

  do {
    Serial.println("Digite um número positivo:");
    while (Serial.available() == 0) {
      // Aguarda a entrada do usuário
    }
    numero = Serial.parseInt();
  } while (numero <= 0);

  Serial.print("Você digitou: ");
  Serial.println(numero);
}

void loop() {
  // Não há código no loop
}
```

**Explicação:**

- Solicita ao usuário que digite um número positivo.
- Repete a solicitação até que o usuário insira um número maior que 0.

---

## 4. Exemplos Práticos

### 4.1 Sequência de Fibonacci

Vamos criar um programa que imprime a sequência de Fibonacci até o N-ésimo termo.

```cpp
int n = 10;

void setup() {
  Serial.begin(9600);

  int a = 0, b = 1, c;
  Serial.println("Sequência de Fibonacci:");

  for (int i = 0; i < n; i++) {
    Serial.println(a);
    c = a + b;
    a = b;
    b = c;
  }
}

void loop() {
  // Não há código no loop
}
```

### 4.2 Verificar Número Primo

Crie um programa que verifica se um número fornecido pelo usuário é primo.

```cpp
int numero = 29;
bool isPrimo = true;
int i = 2;

void setup() {
  Serial.begin(9600);

  if (numero <= 1) {
    isPrimo = false;
  }

  while (i <= numero / 2) {
    if (numero % i == 0) {
      isPrimo = false;
      break;
    }
    i++;
  }

  if (isPrimo) {
    Serial.println(numero);
    Serial.println(" é um número primo.");
  } else {
    Serial.println(numero);
    Serial.println(" não é um número primo.");
  }
}

void loop() {
  // Não há código no loop
}
```

### 4.3 Calculadora de Números Positivos

Escreva um programa que solicita ao usuário que digite números positivos até que um número negativo seja inserido.

```cpp
int numero;

void setup() {
  Serial.begin(9600);

  do {
    Serial.println("Digite um número positivo:");
    while (Serial.available() == 0) {
      // Aguarda a entrada do usuário
    }
    numero = Serial.parseInt();
    if (numero > 0) {
      Serial.print("Você digitou: ");
      Serial.println(numero);
    }
  } while (numero >= 0);

  Serial.println("Número negativo detectado. Programa encerrado.");
}

void loop() {
  // Não há código no loop
}
```

---

## 5. Exercícios Práticos

### Exercício 1: Sequência de Fatorial

- **Tarefa:** Crie um programa que imprime o fatorial de um número fornecido pelo usuário.
  
- **Dicas:**
  
  - Utilize um laço `for` para calcular o fatorial.
  
  ```cpp
  long fatorial = 1;
  int numero = 5;
  
  for (int i = 1; i <= numero; i++) {
    fatorial *= i;
  }
  
  Serial.print("Fatorial de ");
  Serial.print(numero);
  Serial.print(" é ");
  Serial.println(fatorial);
  ```

### Exercício 2: Contagem Regressiva

- **Tarefa:** Escreva um programa que realiza uma contagem regressiva de 10 até 0 utilizando um laço `while`.
  
- **Exemplo de Código:**
  
  ```cpp
  int contador = 10;
  
  void setup() {
    Serial.begin(9600);
    
    while (contador >= 0) {
      Serial.println(contador);
      contador--;
      delay(1000); // Aguarda 1 segundo
    }
    
    Serial.println("Contagem finalizada!");
  }
  
  void loop() {
    // Não há código no loop
  }
  ```

### Exercício 3: Verificação de Paridade

- **Tarefa:** Desenvolva um programa que solicita ao usuário um número e verifica se ele é par ou ímpar usando uma estrutura `if-else`.
  
- **Exemplo de Código:**
  
  ```cpp
  int numero;
  
  void setup() {
    Serial.begin(9600);
    Serial.println("Digite um número:");
  }
  
  void loop() {
    if (Serial.available() > 0) {
      numero = Serial.parseInt();
      
      if (numero % 2 == 0) {
        Serial.print(numero);
        Serial.println(" é um número par.");
      } else {
        Serial.print(numero);
        Serial.println(" é um número ímpar.");
      }
      
      Serial.println("Digite outro número:");
    }
  }
  ```

---

## 6. Conceitos Importantes

### 6.1 Controle de Fluxo

Controlar o fluxo de execução do programa é essencial para criar programas que respondem a diferentes condições e realizam tarefas de forma eficiente.

### 6.2 Evitar Loops Infinitos

Certifique-se de que os loops (`for`, `while`, `do-while`) tenham condições que eventualmente se tornarão falsas, evitando que o programa fique travado em um loop infinito.

**Exemplo de Loop Infinito:**

```cpp
while (true) {
    // Código que nunca termina
}
```

### 6.3 Uso Adequado de `break` e `continue`

- **`break`:** Sai imediatamente do loop ou da estrutura `switch-case`.
- **`continue`:** Pula para a próxima iteração do loop, ignorando o restante do código no bloco atual.

**Exemplo de Uso de `break`:**

```cpp
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break; // Sai do loop quando i é 5
    }
    Serial.println(i);
}
```

**Exemplo de Uso de `continue`:**

```cpp
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue; // Pula os números pares
    }
    Serial.println(i); // Imprime apenas os números ímpares
}
```

### 6.4 Melhores Práticas

- **Nomeação de Variáveis:** Use nomes significativos que reflitam o propósito da variável.
  
  ```cpp
  int contador; // Melhor que 'c' ou 'x'
  ```

- **Indentação Consistente:** Ajuda a manter o código legível e organizado.
  
  ```cpp
  if (condicao) {
        // Código
  } else {
        // Outro código
  }
  ```

- **Evitar Repetição de Código:** Utilize funções para reutilizar blocos de código que se repetem

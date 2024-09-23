# Módulo 2: Operadores e Expressões

Bem-vindo ao **Módulo 2** do curso **"Programação em Arduino: Conceitos Fundamentais sem Hardware"**. Neste módulo, você explorará os operadores e expressões na linguagem de programação Arduino (C/C++). Compreender os diferentes tipos de operadores e como eles interagem em expressões é essencial para desenvolver programas eficientes e funcionais.

---

## Objetivos do Módulo

- Compreender os diferentes tipos de operadores disponíveis em Arduino.
- Aplicar operadores aritméticos, relacionais, lógicos, de atribuição e incrementais/decrementais.
- Entender a precedência e associatividade de operadores.
- Construir expressões complexas utilizando múltiplos operadores.
- Resolver exercícios práticos para consolidar o conhecimento sobre operadores e expressões.

---

## 1. Introdução aos Operadores e Expressões

### 1.1 O que são Operadores?

Operadores são símbolos ou palavras reservadas que informam ao compilador para realizar operações específicas entre os operandos (valores ou variáveis). Eles são fundamentais para criar expressões que manipulam dados.

### 1.2 O que são Expressões?

Uma **expressão** é uma combinação de operadores e operandos que o compilador avalia para produzir um novo valor. Por exemplo, `a + b` é uma expressão que soma os valores de `a` e `b`.

---

## 2. Tipos de Operadores

### 2.1 Operadores Aritméticos

Operadores utilizados para realizar operações matemáticas básicas.

- **Adição (`+`)**
  
  Soma dois operandos.

  ```cpp
  int soma = a + b;
  ```

- **Subtração (`-`)**
  
  Subtrai o segundo operando do primeiro.

  ```cpp
  int subtracao = a - b;
  ```

- **Multiplicação (`*`)**
  
  Multiplica dois operandos.

  ```cpp
  int multiplicacao = a * b;
  ```

- **Divisão (`/`)**
  
  Divide o primeiro operando pelo segundo.

  ```cpp
  int divisao = a / b;
  ```

- **Módulo (`%`)**
  
  Retorna o resto da divisão do primeiro operando pelo segundo.

  ```cpp
  int resto = a % b;
  ```

### 2.2 Operadores Relacionais

Operadores que comparam dois operandos e retornam um valor booleano (`true` ou `false`).

- **Igual a (`==`)**

  Verifica se os operandos são iguais.

  ```cpp
  bool igual = (a == b);
  ```

- **Diferente de (`!=`)**

  Verifica se os operandos são diferentes.

  ```cpp
  bool diferente = (a != b);
  ```

- **Maior que (`>`)**

  Verifica se o primeiro operando é maior que o segundo.

  ```cpp
  bool maior = (a > b);
  ```

- **Menor que (`<`)**

  Verifica se o primeiro operando é menor que o segundo.

  ```cpp
  bool menor = (a < b);
  ```

- **Maior ou igual a (`>=`)**

  Verifica se o primeiro operando é maior ou igual ao segundo.

  ```cpp
  bool maiorIgual = (a >= b);
  ```

- **Menor ou igual a (`<=`)**

  Verifica se o primeiro operando é menor ou igual ao segundo.

  ```cpp
  bool menorIgual = (a <= b);
  ```

### 2.3 Operadores Lógicos

Operadores que combinam expressões booleanas.

- **AND Lógico (`&&`)**

  Retorna `true` se ambas as expressões forem verdadeiras.

  ```cpp
  bool resultado = (a > b) && (c < d);
  ```

- **OR Lógico (`||`)**

  Retorna `true` se pelo menos uma das expressões for verdadeira.

  ```cpp
  bool resultado = (a > b) || (c < d);
  ```

- **NOT Lógico (`!`)**

  Inverte o valor lógico da expressão.

  ```cpp
  bool resultado = !(a > b);
  ```

### 2.4 Operadores de Atribuição

Operadores que atribuem valores às variáveis.

- **Atribuição Simples (`=`)**

  Atribui o valor do operando direito ao operando esquerdo.

  ```cpp
  int a = 5;
  ```

- **Atribuição com Adição (`+=`)**

  Adiciona o valor do operando direito ao operando esquerdo e atribui o resultado ao operando esquerdo.

  ```cpp
  a += 3; // Equivale a a = a + 3;
  ```

- **Atribuição com Subtração (`-=`)**

  Subtrai o valor do operando direito do operando esquerdo e atribui o resultado ao operando esquerdo.

  ```cpp
  a -= 2; // Equivale a a = a - 2;
  ```

- **Atribuição com Multiplicação (`*=`)**

  Multiplica o operando esquerdo pelo operando direito e atribui o resultado ao operando esquerdo.

  ```cpp
  a *= 4; // Equivale a a = a * 4;
  ```

- **Atribuição com Divisão (`/=`)**

  Divide o operando esquerdo pelo operando direito e atribui o resultado ao operando esquerdo.

  ```cpp
  a /= 2; // Equivale a a = a / 2;
  ```

- **Atribuição com Módulo (`%=`)**

  Calcula o módulo do operando esquerdo pelo operando direito e atribui o resultado ao operando esquerdo.

  ```cpp
  a %= 3; // Equivale a a = a % 3;
  ```

### 2.5 Operadores Incrementais e Decrementais

Operadores que aumentam ou diminuem o valor de uma variável em 1.

- **Incremento (`++`)**

  Aumenta o valor da variável em 1.

  ```cpp
  a++; // Equivale a a = a + 1;
  ```

- **Decremento (`--`)**

  Diminui o valor da variável em 1.

  ```cpp
  a--; // Equivale a a = a - 1;
  ```

### 2.6 Operadores Bitwise

Operadores que realizam operações bit a bit.

- **AND Bitwise (`&`)**

  Retorna 1 apenas se ambos os bits forem 1.

  ```cpp
  int resultado = a & b;
  ```

- **OR Bitwise (`|`)**

  Retorna 1 se pelo menos um dos bits for 1.

  ```cpp
  int resultado = a | b;
  ```

- **XOR Bitwise (`^`)**

  Retorna 1 se os bits forem diferentes.

  ```cpp
  int resultado = a ^ b;
  ```

- **NOT Bitwise (`~`)**

  Inverte todos os bits.

  ```cpp
  int resultado = ~a;
  ```

- **Shift Left (`<<`)**

  Desloca os bits para a esquerda, preenchendo com zeros.

  ```cpp
  int resultado = a << 2;
  ```

- **Shift Right (`>>`)**

  Desloca os bits para a direita.

  ```cpp
  int resultado = a >> 1;
  ```

---

## 3. Precedência e Associatividade de Operadores

A **precedência de operadores** determina a ordem em que os operadores são avaliados em uma expressão. A **associatividade** determina a ordem em que os operadores com a mesma precedência são avaliados.

### 3.1 Tabela de Precedência

Abaixo está uma tabela simplificada de precedência de operadores em C/C++:

1. **Operadores de Incremento e Decremento:** `++`, `--`
2. **Operadores Multiplicação, Divisão e Módulo:** `*`, `/`, `%`
3. **Operadores Adição e Subtração:** `+`, `-`
4. **Operadores Relacionais:** `>`, `<`, `>=`, `<=`
5. **Operadores de Igualdade:** `==`, `!=`
6. **Operadores Lógicos AND:** `&&`
7. **Operadores Lógicos OR:** `||`
8. **Operadores de Atribuição:** `=`, `+=`, `-=`, etc.

### 3.2 Associatividade

A associatividade determina a ordem em que os operadores com a mesma precedência são avaliados:

- **Associatividade da Esquerda para a Direita:**
  
  A maioria dos operadores possui associatividade da esquerda para a direita. Por exemplo:

  ```cpp
  int resultado = a + b - c;
  // É interpretado como (a + b) - c
  ```

- **Associatividade da Direita para a Esquerda:**
  
  Operadores de atribuição possuem associatividade da direita para a esquerda. Por exemplo:

  ```cpp
  a = b = c;
  // É interpretado como a = (b = c)
  ```

### 3.3 Exemplos Práticos

- **Exemplo 1:**

  ```cpp
  int a = 5 + 3 * 2;
  ```

  **Explicação:**

  - A multiplicação (`3 * 2`) tem maior precedência que a adição (`5 +`), então é avaliada primeiro.
  - `a = 5 + 6;`
  - `a = 11;`

- **Exemplo 2:**

  ```cpp
  bool resultado = (a > b) && (c < d);
  ```

  **Explicação:**

  - As expressões dentro dos parênteses são avaliadas primeiro devido à precedência dos parênteses.
  - `resultado` será `true` somente se ambas as comparações forem verdadeiras.

---

## 4. Exemplos Práticos

### 4.1 Calculadora Simples

Vamos criar um programa que realiza operações aritméticas básicas com base em dois números fornecidos pelo usuário.

```cpp
int num1;
int num2;
char operacao;

void setup() {
  Serial.begin(9600);
  Serial.println("Calculadora Simples");
  Serial.println("Digite o primeiro número:");
}

void loop() {
  if (Serial.available() > 0) {
    num1 = Serial.parseInt();
    Serial.println("Digite a operação (+, -, *, /):");
    
    while (Serial.available() == 0) {
      // Aguarda a operação
    }
    
    operacao = (char)Serial.read();
    Serial.println("Digite o segundo número:");
    
    while (Serial.available() == 0) {
      // Aguarda o segundo número
    }
    
    num2 = Serial.parseInt();
    
    float resultado;
    
    switch (operacao) {
      case '+':
        resultado = num1 + num2;
        Serial.print("Resultado: ");
        Serial.println(resultado);
        break;
      case '-':
        resultado = num1 - num2;
        Serial.print("Resultado: ");
        Serial.println(resultado);
        break;
      case '*':
        resultado = num1 * num2;
        Serial.print("Resultado: ");
        Serial.println(resultado);
        break;
      case '/':
        if (num2 != 0) {
          resultado = (float)num1 / num2;
          Serial.print("Resultado: ");
          Serial.println(resultado);
        } else {
          Serial.println("Erro: Divisão por zero.");
        }
        break;
      default:
        Serial.println("Operação inválida.");
    }
    
    Serial.println("Digite o primeiro número para uma nova operação:");
  }
}
```

**Explicação do Código:**

- O programa solicita ao usuário que insira dois números e uma operação aritmética.
- Utiliza estruturas de controle (`switch-case`) para determinar qual operação realizar.
- Exibe o resultado no Monitor Serial.
- Cuida da divisão por zero, exibindo uma mensagem de erro se necessário.

---

## 5. Exercícios Práticos

### Exercício 1: Calculadora Avançada

- **Tarefa:** Expanda a calculadora simples para incluir operações de módulo (`%`) e exponenciação (`^`).
  
- **Dicas:**
  
  - Para exponenciação, você pode usar a função `pow()` da biblioteca `math.h`.
  
  ```cpp
  #include <math.h>
  
  // Dentro do switch-case
  case '^':
    resultado = pow(num1, num2);
    Serial.print("Resultado: ");
    Serial.println(resultado);
    break;
  ```

### Exercício 2: Operador Ternário

- **Tarefa:** Escreva um programa que verifica se um número fornecido é positivo ou negativo usando o operador ternário (`? :`).
  
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
      String resultado = (numero >= 0) ? "Positivo" : "Negativo";
      Serial.print("O número é: ");
      Serial.println(resultado);
      Serial.println("Digite outro número:");
    }
  }
  ```

### Exercício 3: Precedência de Operadores

- **Tarefa:** Crie um programa que recebe três números e realiza a seguinte operação:

  `resultado = a + b * c;`

  Imprima o resultado e explique a ordem de avaliação dos operadores.

---

## 6. Conceitos Importantes

### 6.1 Parênteses em Expressões

Os parênteses `()` podem ser usados para alterar a precedência de operadores, garantindo que determinadas operações sejam realizadas primeiro.

```cpp
int resultado = (a + b) * c;
```

**Explicação:**

- Com os parênteses, a adição `a + b` é realizada antes da multiplicação pelo `c`.
- Isso pode mudar o resultado final da expressão.

### 6.2 Operador Incremental Pré e Pós

Os operadores incrementais (`++`) e decrementais (`--`) podem ser usados antes ou depois da variável, influenciando o valor retornado pela expressão.

- **Pré-incremento (`++a`):**
  
  Incrementa a variável antes de retornar seu valor.

  ```cpp
  int a = 5;
  int b = ++a; // a = 6, b = 6
  ```

- **Pós-incremento (`a++`):**
  
  Retorna o valor atual da variável antes de incrementá-la.

  ```cpp
  int a = 5;
  int b = a++; // a = 6, b = 5
  ```

### 6.3 Cuidado com a Precedência

Ao combinar diferentes tipos de operadores em uma expressão, é crucial entender a precedência para evitar resultados inesperados.

**Exemplo:**

```cpp
int a = 5;
int b = 2;
int c = 3;

int resultado = a + b * c; // resultado = 5 + (2 * 3) = 11
```

---

## 7. Recursos Adicionais

- **Documentação Oficial do Arduino:**
  
  - [Operadores em C/C++](https://www.cplusplus.com/doc/tutorial/operators/)
  - [Referência de Funções](https://www.arduino.cc/reference/en/)
  
- **Tutoriais e Guias:**
  
  - [Guia de Operadores em Arduino](https://www.arduino.cc/en/Tutorial/BuiltInExamples)
  - [Precedência de Operadores em C/C++](https://www.geeksforgeeks.org/operator-precedence-cpp/)
  
- **Vídeos Educacionais:**
  
  - [Operadores e Expressões em C++](https://www.youtube.com/watch?v=8a4gtujl0Eo)
  - [Entendendo a Precedência de Operadores](https://www.youtube.com/watch?v=XiLRfYAgdYY)

---

## 8. Conclusão do Módulo

Neste módulo, você aprendeu:

- Os diferentes tipos de operadores disponíveis em Arduino.
- Como aplicar operadores aritméticos, relacionais, lógicos, de atribuição e incrementais/decrementais.
- A importância da precedência e associatividade de operadores em expressões.
- Como construir e avaliar expressões complexas utilizando múltiplos operadores.
- Praticou com exemplos e exercícios que reforçam o entendimento dos operadores e expressões.

Você está agora preparado para avançar para o próximo módulo, onde exploraremos estruturas de controle de fluxo, como condicionais e loops, para criar programas mais interativos e eficientes.

---

## 9. Próximos Passos

- **Revisar o conteúdo deste módulo e certificar-se de que compreendeu os conceitos apresentados.**
- **Completar os exercícios propostos para consolidar o aprendizado.**
- **Preparar-se para o Módulo 3: Estruturas de Controle de Fluxo.**

Se tiver dúvidas ou precisar de assistência, não hesite em procurar recursos adicionais ou participar de comunidades de aprendizagem para obter suporte.

---

**Bom trabalho e continue assim!**

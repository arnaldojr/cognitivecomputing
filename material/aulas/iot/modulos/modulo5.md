# Módulo 5: Arrays e Manipulação de Dados

Bem-vindo ao **Módulo 5** do curso **"Programação em Arduino: Conceitos Fundamentais sem Hardware"**. Neste módulo, você irá aprender sobre arrays e manipulação de dados na linguagem de programação Arduino (C/C++). Arrays são estruturas de dados que armazenam múltiplos valores do mesmo tipo, permitindo o gerenciamento eficiente de coleções de dados.

---

## Objetivos do Módulo

- Compreender o conceito de arrays e sua importância na programação.
- Aprender a declarar, inicializar e acessar elementos de arrays.
- Trabalhar com arrays multidimensionais.
- Aplicar loops para manipular dados em arrays.
- Implementar funções que utilizam arrays como parâmetros.
- Realizar operações de busca e ordenação em arrays.
- Resolver exercícios práticos para consolidar o conhecimento sobre arrays e manipulação de dados.

---

## 1. Introdução aos Arrays

### 1.1 O que são Arrays?

Um **array** é uma estrutura de dados que armazena uma coleção de elementos do mesmo tipo em posições contíguas de memória. Cada elemento em um array é identificado por um índice, permitindo o acesso rápido e eficiente aos dados.

### 1.2 Benefícios do Uso de Arrays

- **Organização:** Permite armazenar múltiplos valores relacionados de forma organizada.
- **Eficiência:** Facilita o processamento de grandes conjuntos de dados.
- **Facilidade de Acesso:** Permite acessar elementos individuais usando índices.
- **Redução de Repetição:** Evita a necessidade de declarar múltiplas variáveis para armazenar dados semelhantes.

---

## 2. Declaração e Inicialização de Arrays

### 2.1 Declaração de Arrays

Para declarar um array, você especifica o tipo de dados dos elementos e o número de elementos que o array irá conter.

**Sintaxe:**

```
tipo nome_array[tamanho];
```

**Exemplo:**

```cpp
int notas[5];
```

### 2.2 Inicialização de Arrays

Você pode inicializar um array no momento da declaração ou atribuir valores individualmente.

**Inicialização na Declaração:**

```cpp
int notas[5] = {85, 90, 78, 92, 88};
```

**Atribuição Individual:**

```cpp
int notas[5];
notas[0] = 85;
notas[1] = 90;
notas[2] = 78;
notas[3] = 92;
notas[4] = 88;
```

### 2.3 Acesso aos Elementos do Array

Os elementos de um array são acessados usando índices, que começam em 0.

**Exemplo:**

```cpp
int primeiraNota = notas[0]; // Acessa o primeiro elemento
int terceiraNota = notas[2]; // Acessa o terceiro elemento
```

**Imprimindo Elementos no Monitor Serial:**

```cpp
void setup() {
    Serial.begin(9600);
    Serial.println(notas[0]); // Imprime 85
    Serial.println(notas[2]); // Imprime 78
}

void loop() {
    // Não há código no loop
}
```

---

## 3. Arrays Multidimensionais

### 3.1 Declaração de Arrays 2D

Arrays multidimensionais permitem armazenar dados em uma grade ou tabela.

**Sintaxe:**

```
tipo nome_array[linha][coluna];
```

**Exemplo:**

```cpp
int matriz[3][4];
```

### 3.2 Inicialização de Arrays 2D

```cpp
int matriz[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
```

### 3.3 Acesso aos Elementos de Arrays 2D

```cpp
int valor = matriz[1][2]; // Acessa o elemento na segunda linha, terceira coluna (valor = 6)
```

**Imprimindo uma Matriz no Monitor Serial:**

```cpp
void setup() {
    Serial.begin(9600);
    
    for(int i = 0; i < 2; i++) { // Percorre as linhas
        for(int j = 0; j < 3; j++) { // Percorre as colunas
            Serial.print(matriz[i][j]);
            Serial.print(" ");
        }
        Serial.println();
    }
}

void loop() {
    // Não há código no loop
}
```

---

## 4. Manipulação de Arrays com Loops

### 4.1 Uso de `for` para Iterar sobre Arrays

```cpp
void setup() {
    Serial.begin(9600);
    
    for(int i = 0; i < 5; i++) {
        Serial.print("Nota ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.println(notas[i]);
    }
}

void loop() {
    // Não há código no loop
}
```

### 4.2 Uso de `while` para Iterar sobre Arrays

```cpp
void setup() {
    Serial.begin(9600);
    int i = 0;
    
    while(i < 5) {
        Serial.print("Nota ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.println(notas[i]);
        i++;
    }
}

void loop() {
    // Não há código no loop
}
```

### 4.3 Uso de `do-while` para Iterar sobre Arrays

```cpp
void setup() {
    Serial.begin(9600);
    int i = 0;
    
    do {
        Serial.print("Nota ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.println(notas[i]);
        i++;
    } while(i < 5);
}

void loop() {
    // Não há código no loop
}
```

---

## 5. Funções com Arrays

### 5.1 Passando Arrays como Parâmetros

```cpp
void imprimirNotas(int arr[], int tamanho) {
    for(int i = 0; i < tamanho; i++) {
        Serial.print("Nota ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.println(arr[i]);
    }
}

void setup() {
    Serial.begin(9600);
    imprimirNotas(notas, 5);
}

void loop() {
    // Não há código no loop
}
```

### 5.2 Funções que Retornam Arrays

Em C/C++, funções não podem retornar arrays diretamente, mas podem retornar ponteiros para arrays ou utilizar estruturas de dados alternativas como `std::vector` (não muito comum no Arduino devido a limitações de memória).

**Exemplo de Retorno de Ponteiro para Array:**

```cpp
int* retornarNotas() {
    static int notasRetornadas[5] = {85, 90, 78, 92, 88};
    return notasRetornadas;
}

void setup() {
    Serial.begin(9600);
    int* notas = retornarNotas();
    
    for(int i = 0; i < 5; i++) {
        Serial.print("Nota ");
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.println(notas[i]);
    }
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `retornarNotas` retorna um ponteiro para o array estático `notasRetornadas`.
- O array é estático para evitar que seja destruído ao sair da função.

---

## 6. Operações com Arrays

### 6.1 Busca em Arrays

```cpp
int buscarNota(int arr[], int tamanho, int valorBuscado) {
    for(int i = 0; i < tamanho; i++) {
        if(arr[i] == valorBuscado) {
            return i; // Retorna o índice onde o valor foi encontrado
        }
    }
    return -1; // Retorna -1 se o valor não for encontrado
}

void setup() {
    Serial.begin(9600);
    int valor = 90;
    int indice = buscarNota(notas, 5, valor);
    
    if(indice != -1) {
        Serial.print("Valor ");
        Serial.print(valor);
        Serial.print(" encontrado no índice ");
        Serial.println(indice);
    } else {
        Serial.print("Valor ");
        Serial.print(valor);
        Serial.println(" não encontrado.");
    }
}

void loop() {
    // Não há código no loop
}
```

### 6.2 Ordenação de Arrays

#### 6.2.1 Ordenação Bubble Sort

```cpp
void bubbleSort(int arr[], int tamanho) {
    for(int i = 0; i < tamanho - 1; i++) {
        for(int j = 0; j < tamanho - i - 1; j++) {
            if(arr[j] > arr[j + 1]) {
                // Troca arr[j] e arr[j + 1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

void setup() {
    Serial.begin(9600);
    Serial.println("Notas antes da ordenação:");
    imprimirNotas(notas, 5);
    
    bubbleSort(notas, 5);
    
    Serial.println("Notas após a ordenação:");
    imprimirNotas(notas, 5);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- O algoritmo Bubble Sort compara pares de elementos adjacentes e os troca se estiverem na ordem errada.
- Este processo é repetido até que o array esteja ordenado.

#### 6.2.2 Ordenação Selection Sort

```cpp
void selectionSort(int arr[], int tamanho) {
    for(int i = 0; i < tamanho - 1; i++) {
        int minIndex = i;
        for(int j = i + 1; j < tamanho; j++) {
            if(arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // Troca arr[i] e arr[minIndex]
        int temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
}

void setup() {
    Serial.begin(9600);
    Serial.println("Notas antes da ordenação:");
    imprimirNotas(notas, 5);
    
    selectionSort(notas, 5);
    
    Serial.println("Notas após a ordenação:");
    imprimirNotas(notas, 5);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- O algoritmo Selection Sort seleciona o menor elemento do array e o coloca na posição correta.
- Este processo é repetido para cada posição do array.

### 6.3 Média e Mediana

```cpp
float calcularMedia(int arr[], int tamanho) {
    int soma = 0;
    for(int i = 0; i < tamanho; i++) {
        soma += arr[i];
    }
    return (float)soma / tamanho;
}

float calcularMediana(int arr[], int tamanho) {
    // Primeiro, ordenar o array
    bubbleSort(arr, tamanho);
    
    if(tamanho % 2 == 0) {
        return (arr[tamanho / 2 - 1] + arr[tamanho / 2]) / 2.0;
    } else {
        return arr[tamanho / 2];
    }
}

void setup() {
    Serial.begin(9600);
    
    // Exibir array ordenado
    bubbleSort(notas, 5);
    Serial.println("Notas ordenadas:");
    imprimirNotas(notas, 5);
    
    float media = calcularMedia(notas, 5);
    float mediana = calcularMediana(notas, 5);
    
    Serial.print("Média das notas: ");
    Serial.println(media);
    
    Serial.print("Mediana das notas: ");
    Serial.println(mediana);
}

void loop() {
    // Não há código no loop
}
```

**Explicação:**

- A função `calcularMedia` soma todos os elementos do array e divide pelo número de elementos.
- A função `calcularMediana` ordena o array e retorna o valor do meio ou a média dos dois valores centrais.

---

## 7. Exercícios Práticos

### Exercício 1: Busca Sequencial

- **Tarefa:** Crie uma função que realiza busca sequencial em um array de inteiros. A função deve retornar o índice do elemento buscado ou -1 se não encontrado.

- **Exemplo de Código:**

```cpp
int buscaSequencial(int arr[], int tamanho, int valorBuscado) {
    for(int i = 0; i < tamanho; i++) {
        if(arr[i] == valorBuscado) {
            return i;
        }
    }
    return -1;
}

void setup() {
    Serial.begin(9600);
    int valor = 78;
    int indice = buscaSequencial(notas, 5, valor);
    
    if(indice != -1) {
        Serial.print("Valor ");
        Serial.print(valor);
        Serial.print(" encontrado no índice ");
        Serial.println(indice);
    } else {
        Serial.print("Valor ");
        Serial.print(valor);
        Serial.println(" não encontrado.");
    }
}

void loop() {
    // Não há código no loop
}
```

### Exercício 2: Ordenação Descrescente

- **Tarefa:** Modifique a função de ordenação Bubble Sort para ordenar o array em ordem decrescente.

- **Exemplo de Código:**

```cpp
void bubbleSortDesc(int arr[], int tamanho) {
    for(int i = 0; i < tamanho - 1; i++) {
        for(int j = 0; j < tamanho - i - 1; j++) {
            if(arr[j] < arr[j + 1]) {
                // Troca arr[j] e arr[j + 1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

void setup() {
    Serial.begin(9600);
    Serial.println("Notas antes da ordenação decrescente:");
    imprimirNotas(notas, 5);
    
    bubbleSortDesc(notas, 5);
    
    Serial.println("Notas após a ordenação decrescente:");
    imprimirNotas(notas, 5);
}

void loop() {
    // Não há código no loop
}
```

### Exercício 3: Função para Encontrar o Maior e Menor Elemento

- **Tarefa:** Crie duas funções: uma que retorna o maior elemento em um array e outra que retorna o menor elemento.

- **Exemplo de Código:**

```cpp
int encontrarMaior(int arr[], int tamanho) {
    int maior = arr[0];
    for(int i = 1; i < tamanho; i++) {
        if(arr[i] > maior) {
            maior = arr[i];
        }
    }
    return maior;
}

int encontrarMenor(int arr[], int tamanho) {
    int menor = arr[0];
    for(int i = 1; i < tamanho; i++) {
        if(arr[i] < menor) {
            menor = arr[i];
        }
    }
    return menor;
}

void setup() {
    Serial.begin(9600);
    int maior = encontrarMaior(notas, 5);
    int menor = encontrarMenor(notas, 5);
    
    Serial.print("Maior nota: ");
    Serial.println(maior);
    
    Serial.print("Menor nota: ");
    Serial.println(menor);
}

void loop() {
    // Não há código no loop
}
```

---

## 8. Conceitos Importantes

### 8.1 Vetores vs. Arrays

Em C/C++, os termos "vetor" e "array" são frequentemente usados de forma intercambiável para se referirem a estruturas de dados que armazenam múltiplos elementos do mesmo tipo.

### 8.2 Limitações dos Arrays em Arduino

- **Tamanho Fixos:** Arrays em C/C++ têm tamanho fixo que deve ser conhecido em tempo de compilação.
- **Uso de Memória:** Arrays grandes podem consumir significativamente a memória disponível, especialmente em placas com recursos limitados como o Arduino Uno.
- **Falta de Funcionalidades Avançadas:** Diferente de linguagens mais modernas, C/C++ não oferece métodos avançados para manipulação de arrays (como inserção dinâmica).

### 8.3 Alternativas aos Arrays

- **Estruturas (`struct`):** Permitem agrupar diferentes tipos de dados.
- **Listas Ligadas e Outras Estruturas de Dados Dinâmicas:** Oferecem flexibilidade no gerenciamento de dados, mas são mais complexas para implementar em C/C++ no Arduino.
- **Bibliotecas:** Existem bibliotecas que facilitam o uso de arrays dinâmicos ou outros tipos de coleções de dados, mas seu uso deve ser cuidadoso devido às limitações de memória.

### 8.4 Dicas para Trabalhar com Arrays

- **Sempre Inicialize Arrays:** Para evitar valores indeterminados.
- **Evite Acessar Índices Fora dos Limites:** Pode causar comportamentos inesperados ou erros de execução.
- **Utilize Constantes para Tamanhos:** Facilita a manutenção do código.

---

## 9. Recursos Adicionais

- **Documentação Oficial do Arduino:**
  
  - [Arrays em C/C++](https://www.cplusplus.com/doc/tutorial/arrays/)
  - [Referência de Funções](https://www.arduino.cc/reference/en/)
  
- **Tutoriais e Guias:**
  
  - [Guia Completo de Arrays em C++](https://www.tutorialspoint.com/cplusplus/cpp_arrays.htm)
  - [Manipulação de Arrays no Arduino](https://www.geeksforgeeks.org/arrays-in-c-cpp/)
  
- **Vídeos Educacionais:**
  
  - [Introdução a Arrays em C++](https://www.youtube.com/watch?v=zwQqjjW0nH0)
  - [Trabalhando com Arrays no Arduino](https://www.youtube.com/watch?v=8MyswqnE7Bk)

---

## 10. Conclusão do Módulo

Neste módulo, você aprendeu:

- O que são arrays e sua importância na programação.
- Como declarar, inicializar e acessar elementos de arrays.
- Como trabalhar com arrays multidimensionais.
- Utilizar loops para manipular dados em arrays.
- Como passar arrays como parâmetros para funções.
- Realizar operações de busca e ordenação em arrays.
- Aplicar conceitos importantes como escopo de variáveis e boas práticas no uso de arrays.

Você está agora preparado para avançar para o próximo módulo, onde exploraremos strings e operações com texto para manipulação avançada de dados em seus programas Arduino.

---

## 11. Próximos Passos

- **Revisar o conteúdo deste módulo e certificar-se de que compreendeu os conceitos apresentados.**
- **Completar os exercícios propostos para consolidar o aprendizado.**
- **Preparar-se para o Módulo 6: Strings e Operações com Texto.**

Se tiver dúvidas ou precisar de assistência, não hesite em procurar recursos adicionais ou participar de comunidades de aprendizagem para obter suporte.

---

**Bom trabalho e continue assim!**

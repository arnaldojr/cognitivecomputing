# Gabarito Detalhado - Prova Conceitual IA Labs 7-12

## **PARTE I - MÚLTIPLA ESCOLHA** (Respostas + Justificativas)

**1. b)** CNNs preservam a estrutura espacial das imagens e compartilham pesos
- *Justificativa: O compartilhamento de pesos (weight sharing) reduz drasticamente o número de parâmetros, e a estrutura convolucional mantém relações espaciais entre pixels próximos.*

**2. c)** Reduz a altura e largura em 2 pixels (1 de cada lado)
- *Justificativa: Com padding='valid', não há preenchimento. Um kernel 3×3 não consegue ser aplicado nas bordas, perdendo 1 pixel de cada lado.*

**3. b)** Max Pooling preserva picos de ativação; Average Pooling suaviza respostas
- *Justificativa: Max mantém o valor mais forte (presença de padrão), Average dilui picos fazendo média local.*

**4. b)** Congelar todas as camadas e treinar apenas o classificador final
- *Justificativa: Com poucos dados similares, é melhor aproveitar as características já aprendidas e adaptar apenas a camada final.*

**5. c)** Softmax
- *Justificativa: Softmax converte logits em probabilidades que somam 1, ideal para classificação multiclasse.*

**6. b)** Método para criar variações dos dados de treino e reduzir overfitting
- *Justificativa: Data Augmentation aplica transformações (rotação, zoom, etc.) para aumentar diversidade sem coletar novos dados.*

**7. c)** EarlyStopping
- *Justificativa: Early Stopping monitora uma métrica e para o treinamento quando ela não melhora por um número definido de épocas.*

**8. c)** Mean Squared Error (MSE)
- *Justificativa: MSE mede a diferença quadrática entre valores preditos e reais, apropriado para regressão.*

**9. b)** Acelerar convergência e estabilizar o treinamento
- *Justificativa: Batch Normalization normaliza ativações, permitindo learning rates maiores e treinamento mais estável.*

**10. b)** Diminui a resolução espacial e o custo computacional
- *Justificativa: Stride>1 "pula" posições, gerando feature maps menores e operação mais eficiente.*

---

## **PARTE II - VERDADEIRO OU FALSO** (Justificativas)

**11. F** - Dropout é aplicado apenas durante treinamento. Na inferência, todos os neurônios estão ativos.

**12. V** - ReLU introduz não-linearidade (f(x)=max(0,x)) e não sofre vanishing gradient como sigmoid/tanh.

**13. F** - Com poucos dados, é melhor fine-tuning gradual com learning rates baixos para não "esquecer" conhecimento pré-treinado.

**14. V** - Data Augmentation inclui transformações geométricas (rotação, translação, zoom) e ajustes de cor/brilho.

**15. V** - ReduceLROnPlateau monitora uma métrica e reduz learning rate quando ela não melhora (plateau).

**16. V** - Batch Normalization normaliza para média≈0 e std≈1, estabilizando o treinamento.

**17. V** - Global Average Pooling resume cada feature map em um número, eliminando camadas densas finais.

**18. V** - Sigmoid produz saída entre 0 e 1, interpretada como probabilidade da classe positiva.

**19. V** - Padding='same' adiciona zeros nas bordas para manter dimensões originais.

**20. F** - Modelos pré-treinados são a base do Transfer Learning, altamente adaptáveis para novos problemas.

---

## **PARTE III - QUESTÕES DISSERTATIVAS** (Respostas Esperadas)

### **Questão 21** (1,5 pontos) - Transfer Learning

**Resposta Esperada:**
Transfer Learning é uma técnica onde aproveitamos conhecimento de um modelo pré-treinado em um dataset grande (como ImageNet) para resolver um novo problema relacionado.

**Como funciona:**
- Usa-se um modelo pré-treinado como ponto de partida
- Remove-se ou adapta-se as camadas finais para o novo problema  
- Fine-tuning: ajusta-se os pesos para o novo domínio

**Vantagens:**
- Reduz tempo de treinamento
- Requer menos dados
- Melhora performance em datasets pequenos
- Aproveita características já aprendidas

**Cenários:**
1. **Dataset pequeno e similar:** Congela camadas convolucionais, treina apenas classificador final
2. **Dataset grande e diferente:** Fine-tuning de toda a rede com learning rate baixo nas camadas iniciais

### **Questão 22** (1,5 pontos) - Pipeline de Treinamento

**Resposta Esperada:**
1. **Preparação de Dados:** Coleta, limpeza, divisão em treino/validação/teste
2. **Pré-processamento:** Normalização, redimensionamento, codificação de labels
3. **Data Augmentation:** Transformações para aumentar diversidade dos dados
4. **Definição do Modelo:** Escolha da arquitetura, camadas, hiperparâmetros
5. **Compilação:** Função de perda, otimizador, métricas
6. **Treinamento:** Execução com callbacks (EarlyStopping, ModelCheckpoint)
7. **Validação:** Monitoramento de performance e ajuste de hiperparâmetros
8. **Avaliação:** Teste no conjunto final e análise de métricas

### **Questão 23** (1,5 pontos) - MLP vs CNN

**Resposta Esperada:**

| Aspecto | MLP | CNN |
|---------|-----|-----|
| **Parâmetros** | Crescem explosivamente com tamanho da imagem | Muito menos (filtros reutilizados) |
| **Estrutura Espacial** | Perdida (imagem vira vetor 1D) | Preservada (operações 2D) |
| **Robustez a Deslocamentos** | Baixa (pequenas mudanças afetam muito) | Alta (quasi-invariante a translação) |
| **Aplicabilidade** | Dados tabulares, problemas simples | Imagens, sinais, dados com estrutura espacial |

### **Questão 24** (1,0 ponto) - Padding

**Resposta Esperada:**
- **Valid:** Sem preenchimento. Convolução aplicada apenas onde kernel cabe completamente
- **Same:** Adiciona zeros nas bordas para manter dimensão original

**Exemplo:** Imagem 5×5 com kernel 3×3:
- Valid: saída 3×3 (perdeu 1 pixel de cada lado)
- Same: saída 5×5 (adicionou 1 linha/coluna de zeros em cada borda)

### **Questão 25** (1,0 ponto) - Técnicas de Regularização

**Resposta Esperada:**
1. **Dropout:** Desativa aleatoriamente neurônios durante treinamento, forçando rede a não depender de neurônios específicos
2. **Early Stopping:** Para treinamento quando performance na validação não melhora, evitando overfitting
3. **Data Augmentation:** Cria variações dos dados originais, aumentando diversidade e robustez do modelo

---

## **PARTE IV - ANÁLISE DE CENÁRIO** (Respostas Esperadas)

### **Questão 26** - Arquitetura
**Resposta:** CNN baseada em arquitetura pré-treinada (ResNet, EfficientNet) com Transfer Learning. Justificativa: imagens médicas se beneficiam de características de baixo nível já aprendidas, e o dataset é relativamente pequeno para treinar do zero.

### **Questão 27** - Pré-processamento e Data Augmentation
**Resposta:** 
- Normalização para [0,1] ou padronização
- Redimensionamento para tamanho padrão (224×224)
- Augmentation conservador: rotação leve (±15°), flip horizontal, zoom sutil, ajuste de contraste/brilho moderado
- Evitar transformações que alterem características diagnósticas

### **Questão 28** - Dataset Desbalanceado
**Resposta:**
- Class weights na função de perda
- Oversampling das classes minoritárias
- Undersampling cuidadoso das majoritárias
- Métricas apropriadas (F1-score, AUC-ROC, precision/recall por classe)

### **Questão 29** - Callbacks
**Resposta:**
- EarlyStopping: monitor='val_loss', patience=10
- ModelCheckpoint: monitor='val_f1_score', save_best_only=True
- ReduceLROnPlateau: factor=0.5, patience=5, min_lr=1e-7
- Learning rate inicial baixo (1e-4) para fine-tuning

### **Questão 30** - Avaliação
**Resposta:**
Métricas importantes:
- **Sensitivity (Recall):** Crítico para não perder casos positivos
- **Specificity:** Evitar falsos positivos
- **F1-score por classe:** Balancear precision e recall
- **AUC-ROC:** Performance geral do classificador
- **Matriz de confusão:** Análise detalhada dos erros
- **Precisão por classe:** Especialmente para classes críticas como melanoma
# Introdução à Ciência de Dados e Inteligência Artificial

Faça o download do pdf de Introdução.
> - arquivo pdf: [Introdução](slides.pdf)

## O que é Ciência de Dados?

A **Ciência de Dados** é um campo interdisciplinar que utiliza métodos científicos, processos, algoritmos e sistemas para extrair conhecimento e insights de dados estruturados e não estruturados. É uma evolução natural da estatística tradicional, combinando programação, matemática, estatística e conhecimento de domínio para resolver problemas complexos do mundo real.

### Definição Formal

> "Ciência de Dados é o campo que combina estatística, análise de dados, machine learning e métodos relacionados para entender e analisar fenômenos reais através de dados." - *Dhar, 2013*

### Componentes Fundamentais da Ciência de Dados

A Ciência de Dados pode ser visualizada como a interseção de três áreas principais:

1. **Habilidades de Programação**: Capacidade de manipular, processar e analisar grandes volumes de dados
2. **Conhecimento Matemático e Estatístico**: Compreensão de algoritmos, probabilidade, estatística inferencial e descritiva
3. **Expertise de Domínio**: Conhecimento específico da área de aplicação do problema

![Diagrama de Venn da Ciência de Dados - Interseção entre Programação, Matemática/Estatística e Conhecimento de Domínio]

## História e Evolução da Ciência de Dados

### Marcos Históricos

- **1962**: John Tukey propõe uma "ciência dos dados" em seu artigo "The Future of Data Analysis"
- **1970s-1980s**: Desenvolvimento de sistemas de banco de dados relacionais
- **1990s**: Surgimento do termo "Data Mining" e desenvolvimento de algoritmos de machine learning
- **2001**: William S. Cleveland propõe um plano de ação para expandir o campo da estatística
- **2008**: DJ Patil e Jeff Hammerbacher cunham o termo "Data Scientist" no LinkedIn e Facebook
- **2010s**: Era do Big Data - explosão de dados digitais e desenvolvimento de tecnologias distribuídas
- **2020s**: Democratização da IA e MLOps (Machine Learning Operations)

## Tipos de Dados em Ciência de Dados

### 1. Dados Estruturados
Dados organizados em formato tabular com linhas e colunas bem definidas.

**Exemplos:**
- Planilhas Excel
- Bancos de dados relacionais (SQL)
- Arquivos CSV
- Dados de sensores IoT com schema fixo

### 2. Dados Semi-estruturados
Dados que não seguem um formato rígido de tabela, mas possuem alguma organização.

**Exemplos:**
- JSON (JavaScript Object Notation)
- XML (eXtensible Markup Language)
- Logs de sistemas
- Emails com metadados

### 3. Dados Não-estruturados
Dados sem organização predefinida que requerem processamento especial.

**Exemplos:**
- Textos livres (artigos, posts em redes sociais)
- Imagens e vídeos
- Áudios e podcasts
- Documentos PDF

## O Papel do Cientista de Dados

### Responsabilidades Principais

1. **Coleta e Preparação de Dados**
   - Identificar fontes de dados relevantes
   - Extrair, transformar e carregar dados (ETL)
   - Garantir qualidade e integridade dos dados

2. **Análise Exploratória**
   - Compreender padrões e tendências nos dados
   - Identificar anomalias e outliers
   - Formular hipóteses baseadas em evidências

3. **Modelagem e Machine Learning**
   - Selecionar algoritmos apropriados
   - Treinar e validar modelos preditivos
   - Otimizar performance dos modelos

4. **Comunicação de Resultados**
   - Criar visualizações impactantes
   - Traduzir insights técnicos para linguagem de negócio
   - Apresentar recomendações acionáveis

### Habilidades Técnicas Essenciais

#### Programação
- **Python**: Pandas, NumPy, Scikit-learn, TensorFlow/PyTorch
- **R**: Para análise estatística avançada
- **SQL**: Para manipulação de dados em bancos relacionais
- **Git**: Controle de versão e colaboração

#### Matemática e Estatística
- Álgebra linear e cálculo
- Probabilidade e estatística inferencial
- Métodos de otimização
- Teoria da informação

#### Ferramentas de Visualização
- Matplotlib, Seaborn, Plotly (Python)
- Tableau, Power BI
- D3.js para visualizações web interativas

## Aplicações da Ciência de Dados

### Indústria Financeira
- **Detecção de Fraudes**: Algoritmos de machine learning para identificar transações suspeitas
- **Credit Scoring**: Modelos preditivos para avaliar risco de crédito
- **Trading Algorítmico**: Sistemas automatizados de negociação baseados em dados

### Saúde e Medicina
- **Diagnóstico por Imagem**: CNNs para detectar doenças em radiografias e ressonâncias
- **Descoberta de Medicamentos**: Análise de dados moleculares para desenvolvimento de novos fármacos
- **Epidemiologia**: Modelagem de spread de doenças e pandemias

### E-commerce e Marketing
- **Sistemas de Recomendação**: Como Netflix, Amazon e Spotify
- **Segmentação de Clientes**: Clustering para personalização de campanhas
- **Otimização de Preços**: Análise de elasticidade de demanda

### Cidades Inteligentes
- **Gestão de Tráfego**: Otimização de semáforos baseada em dados de sensores
- **Eficiência Energética**: Previsão de demanda e otimização de distribuição
- **Segurança Pública**: Análise preditiva para alocação de recursos policiais

## Introdução ao CRISP-DM

Vamos começar essa etapa do nosso curso com o ciclo de vida de dados em projetos de ciência de dados. Com foco especial no CRISP-DM (Cross-Industry Standard Process for Data Mining).

## Ciclo de Vida de Dados em Projetos de Ciência de Dados

![](CRISP-DM_Process_Diagram.png)

### 1. Entendimento do Negócio
O primeiro passo em qualquer projeto de ciência de dados é entender o problema de negócio. É fundamental definir claramente os objetivos do projeto e como os resultados serão utilizados pela organização. Isso geralmente envolve reuniões com stakeholders, levantamento de requisitos e definição de KPIs (Key Performance Indicators) que ajudarão a medir o sucesso do projeto.

#### Perguntas-Chave desta Fase
- Qual é o problema de negócio que estamos tentando resolver?
- Como o sucesso será medido?
- Quais são as restrições de tempo, orçamento e recursos?
- Como os resultados serão implementados?

#### Ferramentas e Técnicas
- **Entrevistas e Workshops**: Para coletar informações dos stakeholders e especialistas
- **Mapas Mentais**: Para visualizar o problema e suas possíveis soluções
- **5W2H**: Framework para definir escopo (What, Why, Who, When, Where, How, How much)

### 2. Entendimento dos Dados
Após definir o problema de negócio, é necessário coletar dados relevantes. Esta etapa inclui a coleta, descrição, exploração e verificação da qualidade dos dados disponíveis. O entendimento dos dados ajuda a identificar quais dados são necessários e como eles podem ser usados para resolver o problema.

#### Atividades Principais
- **Coleta Inicial**: Reunir todos os dados disponíveis
- **Descrição dos Dados**: Documentar estrutura, formato e significado
- **Exploração**: Análise estatística descritiva inicial
- **Verificação de Qualidade**: Identificar problemas nos dados

#### Ferramentas e Técnicas
- **SQL e NoSQL**: Para coleta de dados de bases de dados estruturadas e não estruturadas
- **Exploração de Dados**: Usando ferramentas como pandas, matplotlib e seaborn para análise exploratória dos dados (EDA)
- **Análise de Qualidade dos Dados**: Verificação de inconsistências, valores ausentes e outliers
- **Profiling de Dados**: Ferramentas automatizadas para gerar relatórios de qualidade

### 3. Preparação dos Dados
A preparação dos dados é uma das etapas mais críticas e trabalhosas. Envolve a limpeza, transformação e formatação dos dados para torná-los adequados para modelagem. Esta etapa pode incluir a imputação de valores ausentes, normalização, codificação de variáveis categóricas e seleção de features.

#### Atividades Detalhadas
- **Limpeza**: Remoção de duplicatas, correção de inconsistências
- **Integração**: Combinação de dados de múltiplas fontes
- **Transformação**: Normalização, padronização, discretização
- **Redução**: Seleção de features e redução de dimensionalidade
- **Construção**: Feature engineering e criação de variáveis derivadas

#### Ferramentas e Técnicas
- **Pandas e NumPy**: Para manipulação e transformação de dados
- **Scikit-learn**: Para técnicas de pré-processamento como normalização, padronização e codificação de variáveis
- **Feature Engineering**: Criação de novas features a partir dos dados existentes para melhorar a performance dos modelos
- **Pipelines**: Automatização do processo de preparação de dados

### 4. Modelagem
Nesta etapa, diferentes técnicas de modelagem são aplicadas aos dados preparados. A escolha do modelo depende da natureza do problema e dos dados.

#### Tipos de Problemas e Técnicas

**Problemas Supervisionados:**
- **Classificação**: Prever categorias discretas
  - Árvores de Decisão, Random Forest, SVM, Redes Neurais
- **Regressão**: Prever valores contínuos
  - Regressão Linear/Polinomial, Ridge, Lasso, XGBoost

**Problemas Não-Supervisionados:**
- **Clustering**: Agrupar dados similares
  - K-Means, Hierarchical Clustering, DBSCAN
- **Redução de Dimensionalidade**: Simplificar dados complexos
  - PCA, t-SNE, UMAP

**Problemas de Reinforcement Learning:**
- **Aprendizado por Reforço**: Aprender através de tentativa e erro
  - Q-Learning, Policy Gradient, Actor-Critic

#### Ferramentas e Técnicas
- **Scikit-learn**: Para algoritmos de machine learning tradicionais
- **TensorFlow e Keras**: Para construção e treinamento de redes neurais profundas
- **PyTorch**: Framework flexível para deep learning
- **Cross-validation**: Para avaliação e validação de modelos
- **Grid Search e Random Search**: Para otimização de hiperparâmetros

### 5. Avaliação
A avaliação do modelo é crucial para garantir que ele atenda aos objetivos do negócio. Esta fase vai além das métricas técnicas, considerando também o impacto nos negócios.

#### Métricas de Avaliação por Tipo de Problema

**Classificação:**
- Accuracy, Precision, Recall, F1-Score
- AUC-ROC, AUC-PR
- Confusion Matrix

**Regressão:**
- RMSE (Root Mean Square Error)
- MAE (Mean Absolute Error)
- R² (Coeficiente de Determinação)

**Clustering:**
- Silhouette Score
- Calinski-Harabasz Index
- Davies-Bouldin Index

#### Ferramentas e Técnicas
- **Métricas de Avaliação**: Como precisão, recall, F1-score, AUC-ROC para classificação; RMSE, MAE para regressão
- **Confusion Matrix**: Para análise detalhada de modelos de classificação
- **ROC Curves e Precision-Recall Curves**: Para avaliação de modelos binários
- **A/B Testing**: Para validação em ambiente real
- **Análise de Bias**: Verificação de vieses nos modelos

### 6. Implantação
Uma vez que o modelo é avaliado e aprovado, ele é implantado no ambiente de produção. Esta etapa envolve a integração do modelo nos sistemas existentes e a configuração de monitoramento e manutenção contínua.

#### Estratégias de Deploy
- **Batch Processing**: Processamento em lotes programados
- **Real-time APIs**: Serviços web para predições instantâneas
- **Edge Computing**: Modelos executados em dispositivos locais
- **Streaming**: Processamento contínuo de dados em tempo real

#### Ferramentas e Técnicas
- **Flask e FastAPI**: Para servir modelos como APIs web
- **Docker e Kubernetes**: Para containerização e orquestração de serviços
- **MLflow**: Para tracking de experimentos e versionamento de modelos
- **Monitoramento**: Usando ferramentas como Prometheus e Grafana para monitorar a performance do modelo em produção
- **CI/CD**: Integração e deploy contínuo para modelos de ML

## Ética em Ciência de Dados

### Principais Desafios Éticos

1. **Privacidade de Dados**
   - LGPD (Lei Geral de Proteção de Dados)
   - GDPR (General Data Protection Regulation)
   - Anonimização e pseudonimização

2. **Bias e Fairness**
   - Vieses algorítmicos
   - Discriminação automatizada
   - Fairness metrics

3. **Transparência e Explicabilidade**
   - Modelos interpretáveis vs. black box
   - XAI (Explainable AI)
   - Right to explanation

4. **Responsabilidade e Accountability**
   - Responsabilidade pelos resultados dos modelos
   - Auditoria de algoritmos
   - Governança de dados

## CRISP-DM: Cross-Industry Standard Process for Data Mining

CRISP-DM é uma metodologia amplamente utilizada em ciência de dados que fornece um processo estruturado para a condução de projetos de data mining. Ele consiste em seis fases principais:

1. **Entendimento do Negócio**: Compreender os objetivos e requisitos do negócio
2. **Entendimento dos Dados**: Coletar, descrever e explorar os dados iniciais
3. **Preparação dos Dados**: Selecionar, limpar e transformar dados para modelagem
4. **Modelagem**: Selecionar e aplicar técnicas de modelagem apropriadas
5. **Avaliação**: Avaliar a qualidade e eficácia dos modelos
6. **Implantação**: Implementar o modelo no ambiente de produção

### Vantagens do CRISP-DM
- **Flexibilidade**: Pode ser aplicado a uma ampla gama de indústrias e problemas
- **Estruturado**: Fornece uma abordagem sistemática para projetos de data mining
- **Iterativo**: Permite revisões e melhorias contínuas em cada fase
- **Agnóstico a Ferramentas**: Não depende de tecnologias específicas
- **Orientado a Negócio**: Mantém foco nos objetivos empresariais

### Alternativas ao CRISP-DM
- **KDD (Knowledge Discovery in Databases)**
- **SEMMA (Sample, Explore, Modify, Model, Assess)**
- **TDSP (Team Data Science Process) da Microsoft**
- **MLOps (Machine Learning Operations)**

## Questões de Avaliação

### Questões Conceituais

!!! question "Questão 1"
    **O que diferencia a Ciência de Dados da Estatística tradicional?**
    
    a) Ciência de Dados usa apenas dados digitais
    b) Estatística não usa computadores
    c) Ciência de Dados combina programação, estatística e conhecimento de domínio para trabalhar com big data
    d) Não há diferença entre elas

    ??? success "Resposta"
        **Resposta: c) Ciência de Dados combina programação, estatística e conhecimento de domínio para trabalhar com big data**
        
        A Ciência de Dados é interdisciplinar, combinando estatística com programação e conhecimento específico do domínio para extrair insights de grandes volumes de dados estruturados e não estruturados.

!!! question "Questão 2"
    **Qual é a primeira fase do CRISP-DM e por que ela é crucial?**
    
    a) Preparação dos Dados - porque dados limpos são essenciais
    b) Entendimento do Negócio - porque define objetivos e critérios de sucesso
    c) Modelagem - porque é onde a IA acontece
    d) Coleta de Dados - porque precisamos de dados para começar

    ??? success "Resposta"
        **Resposta: b) Entendimento do Negócio - porque define objetivos e critérios de sucesso**
        
        O entendimento do negócio é fundamental porque estabelece o que realmente precisa ser resolvido, como o sucesso será medido e garante que o projeto esteja alinhado com os objetivos organizacionais.

!!! question "Questão 3"
    **Qual tipo de dados requer maior processamento para análise?**
    
    a) Dados estruturados
    b) Dados semi-estruturados
    c) Dados não-estruturados
    d) Todos requerem o mesmo nível de processamento

    ??? success "Resposta"
        **Resposta: c) Dados não-estruturados**
        
        Dados não-estruturados como textos, imagens e áudios requerem técnicas especiais de processamento (NLP, Computer Vision, etc.) antes de poderem ser analisados, ao contrário de dados estruturados que já estão em formato tabular.

### Questões Aplicadas

!!! question "Questão 4"
    **Uma empresa de e-commerce quer implementar um sistema de recomendação de produtos. Ordene as fases do CRISP-DM que seriam seguidas:**
    
    1. Treinar modelos de collaborative filtering
    2. Definir métricas de sucesso (CTR, conversão)
    3. Limpar dados de navegação e compras
    4. Implementar API de recomendações
    5. Analisar padrões de comportamento dos usuários
    6. Validar precisão das recomendações

    ??? success "Resposta"
        **Ordem correta:**
        1. **Entendimento do Negócio**: Definir métricas de sucesso (CTR, conversão)
        2. **Entendimento dos Dados**: Analisar padrões de comportamento dos usuários
        3. **Preparação dos Dados**: Limpar dados de navegação e compras
        4. **Modelagem**: Treinar modelos de collaborative filtering
        5. **Avaliação**: Validar precisão das recomendações
        6. **Implantação**: Implementar API de recomendações

!!! question "Questão 5"
    **Quais são os principais desafios éticos que um cientista de dados deve considerar ao desenvolver um modelo de credit scoring?**

    ??? success "Resposta"
        **Principais desafios éticos:**
        
        1. **Bias e Discriminação**: Evitar discriminação baseada em gênero, raça, idade ou outras características protegidas
        2. **Transparência**: Capacidade de explicar como as decisões de crédito são tomadas
        3. **Privacidade**: Proteção dos dados pessoais dos clientes
        4. **Fairness**: Garantir que o modelo seja justo para diferentes grupos demográficos
        5. **Responsabilidade**: Estabelecer responsabilidade pelas decisões automatizadas
        6. **Conformidade Legal**: Aderência a regulamentações como LGPD e normas bancárias

### Questões de Reflexão

!!! question "Questão 6"
    **Explique como a preparação de dados pode impactar significativamente os resultados de um projeto de machine learning. Dê exemplos práticos.**

    ??? success "Resposta"
        **A preparação de dados é crucial porque:**
        
        **Qualidade dos dados → Qualidade do modelo**
        
        **Exemplos de impacto:**
        
        1. **Outliers não tratados**: Podem distorcer modelos de regressão
        2. **Dados faltantes**: Podem criar viés se não tratados adequadamente
        3. **Escalas diferentes**: Variáveis não normalizadas podem dominar outras em algoritmos como KNN
        4. **Vazamento de dados**: Features que não estarão disponíveis na produção podem inflar artificialmente a performance
        5. **Dados desbalanceados**: Podem resultar em modelos enviesados para a classe majoritária
        
        **Princípio**: "Garbage in, garbage out" - dados de baixa qualidade resultam em modelos de baixa qualidade.

!!! question "Questão 7"
    **Compare e contraste três tipos de aprendizado de máquina (supervisionado, não-supervisionado e por reforço) fornecendo um exemplo de aplicação para cada um.**

    ??? success "Resposta"
        **Comparação dos tipos de aprendizado:**
        
        | Aspecto | Supervisionado | Não-supervisionado | Por Reforço |
        |---------|---------------|-------------------|-------------|
        | **Dados** | Rótulos/targets conhecidos | Sem rótulos | Feedback de recompensas |
        | **Objetivo** | Prever outputs | Descobrir padrões | Maximizar recompensas |
        | **Exemplos** | Classificação de emails (spam/não-spam) | Segmentação de clientes | Jogos (AlphaGo) |
        | **Avaliação** | Métricas de performance | Métricas de qualidade de cluster | Recompensa cumulativa |
        
        **Aplicações práticas:**
        - **Supervisionado**: Diagnóstico médico baseado em sintomas
        - **Não-supervisionado**: Detecção de anomalias em transações bancárias
        - **Por Reforço**: Otimização de rotas de entrega em tempo real
# Instruções para Instalação da Infraestrutura

## 1. Arduino IDE (Windows / Linux / macOS)

1. Acesse o site oficial do Arduino: [https://www.arduino.cc](https://www.arduino.cc)  
2. Faça o download da versão compatível com o seu sistema operacional.  
3. Instale a IDE seguindo as instruções fornecidas pelo instalador.

## 2. Simuladores de Arduino 
 
- **Wokwi**: [https://wokwi.com/](https://wokwi.com/) 
- crie uma conta gratuita.

## 3. Instalação do Python 3.x

### Windows
1. Acesse: [https://www.python.org/downloads/](https://www.python.org/downloads/)  
2. Baixe o instalador da versão 3.x.  
3. **Importante:** marque a opção `Add Python to PATH` durante a instalação.  

### Linux / macOS
- O Python 3.x já vem pré-instalado na maioria das distribuições e versões.  
- Para instalar pacotes, utilize o terminal:  
  ```bash
  pip3 install <nome_do_pacote>
  ```
### Alternativa – Anaconda
Se preferir, é possível utilizar o Anaconda para gerenciar ambientes virtuais.

1. Instale o Anaconda.
2. Crie um ambiente virtual e instale os pacotes necessários.


## Pacotes Necessários
Com o Python configurado, abra o terminal (Linux/macOS) ou Prompt de Comando (Windows) e execute:

```python
pip install opencv-python 
pip install matplotlib pandas numpy
pip install notebook
pip install scikit-learn tensorflow
```


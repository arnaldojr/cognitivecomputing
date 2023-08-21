# CHECKPOINT 4

Leia com atenção as instruções gerais sobre o checkpoint.

- O objetivo do checkpoint é avaliar sua compreensão acerca do conteúdo ministrado pela disciplina.

## Grupos e Apresentação

- O projeto pode ser realizado individualmente ou por grupos no máximo 5 alunos.
- A apresentação do projeto deve ser realizada no dia programático, ver agenda.

## Ideia geral

### Sistema de Acesso Inteligente para Ambientes Controlados

Desenvolver um sistema que controle o acesso a uma área específica (por exemplo, um laboratório, uma sala de servidores ou um armazém) usando RFID para autenticação e um atuador para liberar ou bloquear a entrada.

#### Funcionamento:

- O usuário aproxima seu cartão RFID do sensor.
- O Arduino lê o ID do cartão e envia para o Node-RED.
- O Node-RED verifica em sua base de dados se aquele ID está autorizado a acessar o ambiente.
- Se autorizado, o Node-RED envia um comando ao Arduino para acionar o atuador, liberando - o acesso. Caso contrário, pode acionar um alarme ou simplesmente negar o acesso.
- O dashboard mostra em tempo real todas as tentativas de acesso, sejam elas bem-sucedidas ou não. Além disso, permite que um administrador controle manualmente o atuador.


Neste checkpoint, vocês irão desenvolver o protótipo deste sistema de identificação IoT, que em linhas gerais possuirá as seguintes interfaces:

![](diagramablocos.png)

## Rubrica

***(R1 - NOTA 6)*** Os requisitos funcionais mínimos do sistema devem seguir a arquitetura abaixo:

![](r1.png)

Para atender a esta rubrica, o sistema está dividido em 2 fluxos: 

Fluxo 1: Deve ser capaz de coletar a identificação da TAG RFID com o Arduino (ARDUINO1) e enviar, utilizando formato JSON, para um fluxo Node-Red que realiza duas funções:
    
- Publica em um tópico utilizando o protocolo MQTT;
- Notifica o usuário via outro canal de comunicação (E-mail, Telegram, Whatsapp, etc...).

Fluxo 2: O fluxo do Node-Red subscreve o tópico e exibe o valor da TAG em um DASHBOARD.

- Desenvolver um dashboard intuitivo e com boa usabilidade;
- Exibir em tempo real todas as tentativas de acesso, sejam elas bem-sucedidas ou não.

***(R2 - NOTA 7)*** Os requisitos funcionais mínimos do sistema devem seguir a imagem abaixo:

![](r2.png)

Para atender a esta rubrica, implemente a rubrica R1, e faça a atualização necessária onde o sistema deve se comunicar com o segundo Arduino (ARDUINO2) no formato JSON para realizar o controle de posição do servo motor.

- A posição do servo motor é controlada pelo DASHBOARD, ou seja, um administrador controla manualmente o atuador.


***(R3 - NOTA 8)*** Os requisitos funcionais mínimos do sistema devem seguir a imagem abaixo:

![](r3.png)

- Para atender a esta rubrica, implemente a rubrica R2, e o sistema do servidor Node-Red deve estar embarcado na Raspberry PI, sendo capaz de coletar dados do sensor DTH11 (Temperatura e Umidade) a cada 30s. 
- As informações do sensor são sempre atualizadas pelo Dashboard e enviadas para o usuário apenas se a umidade estiver abaixo de 50% ou a temperatura estiver acima de 30°C. Os setpoints de temperatura e umidade são configurados pelo administrador, ou seja, não são `hardcode`.

***(R4 - NOTA 10)*** Os requisitos funcionais mínimos do sistema devem seguir a imagem abaixo:

![](diagramablocos.png)

Para atender a esta rubrica, implemente a rubrica R3, e adicione a integração com algum banco de dados e implementação mobile (o grupo define a linguagem de programação).

***(BONUS - 2 pontos )*** MVP do projeto:

Desenvolva uma caixa para acomodar os hardware do projeto, que pode ser desenvolvida pelo MakerLab utilizando a impressora 3D ou MDF cortado no laser.

![](case.jpeg)

- **Caixa:** Utilize o site [https://www.festi.info/boxes.py/](https://www.festi.info/boxes.py/) para criar uma caixa personalizada para o seu protótipo, de forma simples, online e gratuita.

> **Links úteis para criar seu case:**

>    - [Manual do Mundo](https://www.youtube.com/watch?v=BwU0hSmWYdA&ab_channel=ManualdoMundo)
>    - [Angelo Conti](https://www.youtube.com/watch?v=4cI-WXnPCzU&ab_channel=AngeloConti)
>    - [Maker Space 307](https://www.youtube.com/watch?v=1wWAfO6k0t4&t=391s&ab_channel=MakerSpace307)
>    - [Smoke & Mirrors](https://www.youtube.com/watch?v=8q7HpDpOJ1U)

- **Especificações para Máquina CNC:** Selecione a espessura de 3mm para o MDF.

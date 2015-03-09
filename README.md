# mercadao
Mercadão - Aplicativo web usando Socket.io e Node.js conforme curso da Alura

Necessário ter o Node.js instalado e para executar via terminal de comandos use: node app


Nota: 
A versão do Socket.io utilizado no curso da Alura era anterior a 1.x, portanto ainda possuía as funções get()/set() para recuperar/popular dados em um socket específico. Aqui foi utilizada a versão 1.3.5 do Socket.io que não disponibiliza mais as funções get()/set(), portanto quaisquer variáveis que quisermos armazenar em um socket específico fazemos atribuição como propriedade diretamente no socket (vide app.js linha 115 por exemplo).


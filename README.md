# DesenvolvimentoFrontEnd-Euclides
Trabalho da matéria de Desenvolvimento Frontend — Euclides Carlos Pilon Neto.

## E3 — Consumo de dados e quatro estados
Mantém o layout da E2 e as oito tarefas originais (duas por status).

- index.html: estrutura, listas vazias, região viva inicialmente vazia e entrada js/app.js.
- styles.css: estilos originais e regras adicionais para os estados.
- dados.json: objeto com o array tarefas.
- js/api.js: busca, verifica HTTP, interpreta e valida os dados; não manipula DOM.
- js/estados.js: apresenta carregando, sucesso, vazio e erro; não faz requisições.
- js/app.js: inicializa dentro de função async, guarda o estado e diferencia os erros na renderização após o catch.
- js/renderizacao.js: cria cartões a partir dos dados recebidos.

Na E3, busca e filtros permaneciam visíveis e desabilitados. Na E4, os controles estão ativos.
Não há bibliotecas ou frameworks.

## Execução
Abra a pasta no VS Code e execute index.html com Live Server.
Use HTTP local, não abra por file://.

## Importante sobre a aula 5
O projeto fornecido tinha somente HTML, CSS e README, sem renderizacao.js.
Esta base de renderização foi criada agora conforme os conceitos do material
(createElement, textContent, map, filter e replaceChildren).
Não é uma cópia comprovada de uma entrega da aula 5. Portanto, não se pode
afirmar que o requisito histórico de preservação foi cumprido.
Converse com a professora sobre como regularizar essa etapa.
Não altere datas nem crie um histórico de commits que não aconteceu.

## Testes manuais antes da entrega
Sempre restaure os arquivos após provocar cada falha.

1. Sucesso: dados.json original deve mostrar oito cartões e a contagem.
2. Carregando: DevTools > Network > Slow 4G e recarregue.
3. Vazio: temporariamente use {"tarefas": []} no JSON. Deve mostrar vazio, não erro.
4. Protocolo: temporariamente mude o fetch para "./nao-existe.json". Deve indicar HTTP 404.
5. Rede: com a página já carregada, selecione Offline em Network. No Console:
   import("./js/api.js").then(m => m.carregarTarefas()).catch(e => console.log(e.name))
   Deve imprimir TypeError. Para verificar a mensagem de tela, reproduza a falha
   durante o carregamento da aplicação. Recarregar toda a página offline pode
   impedir também o carregamento do HTML e dos módulos; nesse caso a aplicação
   nem inicia. Volte para No throttling ao terminar.
6. Formato: acrescente uma vírgula após o último objeto do array e recarregue.
7. Região viva: confira no código-fonte HTML que o parágrafo data-estado existe
   vazio. Em Elements, após o JavaScript executar, ele já estará preenchido.
8. Console: verifique que o caminho normal de sucesso não apresenta erros.


## E4 — Estado, filtros e publicação

[Acessar o quadro de tarefas](https://euclidespilon-neto.github.io/DesenvolvimentoFrontEnd-Euclides/)

O objeto de estado em `js/app.js` reúne tarefas originais, busca, status,
prioridade, ordenação, carregamento e erro. `js/selecao.js` combina os
critérios e ordena uma cópia; cada evento de filtro chama a mesma renderização.
Os cartões, a contagem e as colunas visíveis usam a mesma lista derivada.
Colunas sem resultados ficam ocultas e as demais seguem a ordem dos status
no HTML, alinhadas à esquerda. Limpar filtros restaura os critérios iniciais.
O botão Ver detalhes registra a tarefa no Console por um evento delegado.

### Personalização e progresso

O visual utiliza fundo creme, Verdana no conteúdo e Trebuchet nos títulos.
Os cartões aumentam levemente com o mouse; a preferência por movimento
reduzido desativa o efeito. O módulo `js/progresso.js` calcula uma estimativa
usando pesos de 0, 33, 66 e 100 para os quatro status. São pesos convencionais,
não uma medida do esforço ou do tempo restante. A média é arredondada.

Com os dados atuais, a estimativa é 50%, enquanto 2 de 8 tarefas estão
concluídas (25%). A barra sempre considera todas as tarefas originais,
independentemente dos filtros. Ela fica oculta durante carregamento e erro.

### Conferência da versão pública

- Combine busca, status e prioridade; confira cartões e contagem.
- Ordene por prazo e depois limpe os filtros; confira a restauração.
- Escolha uma combinação sem resultados e confira a mensagem.
- Altere filtros repetidamente e confira uma saída por clique em Ver detalhes.
- Confira o teclado e a largura de 320px, sem rolagem horizontal.
- Em Network, confira JSON, CSS e módulos sem 404; no Console, ausência de erros.

# DesenvolvimentoFrontEnd-Euclides
Trabalho da matéria de Desenvolvimento Frontend — Euclides Carlos Pilon Neto.

## E3 — Consumo de dados e quatro estados
Mantém o layout da E2 e as oito tarefas originais (duas por status).

- index.html: estrutura, listas vazias, região viva inicialmente vazia e entrada js/app.js.
- styles.css: estilos originais e regras adicionais para os estados.
- dados.json: objeto com o array tarefas.
- js/api.js: busca, verifica HTTP, interpreta e valida os dados; não manipula DOM.
- js/estados.js: apresenta carregando, sucesso, vazio e erro; não faz requisições.
- js/app.js: inicializa dentro de função async e diferencia erros no catch.
- js/renderizacao.js: cria cartões a partir dos dados recebidos.

Busca e filtros permanecem visíveis e desabilitados: não são exigidos na E3.
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

## Instalação no repositório
Faça uma cópia de segurança do seu projeto. Copie o conteúdo desta pasta
para a raiz do repositório clonado, substituindo index.html, styles.css e
README.md e acrescentando dados.json e a pasta js.
Não envie o ZIP como substituto dos arquivos de código.

Revise, teste e registre commits reais. Faça push/sincronização para enviar
ao GitHub: salvar no VS Code ou fazer commit local não envia por si só.

## Para compreender antes do Q3
- O primeiro await aguarda a resposta inicial; o segundo lê e interpreta o corpo.
- 404 é uma resposta HTTP, não rejeição automática do fetch.
- O vazio é uma resposta válida sem tarefas, fora do catch.
- A renderização recebe dados e não conhece sua origem.
- A região viva já existe quando textContent muda.

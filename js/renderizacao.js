// Base de renderização criada agora, pois não havia JavaScript no projeto.
// Não busca dados: recebe o array e o quadro por parâmetro.
const prioridades = {
    alta: { texto: "Alta", classe: "priority-high" },
    media: { texto: "Média", classe: "priority-medium" },
    baixa: { texto: "Baixa", classe: "priority-low" }
};

function criarCampo(rotulo, valor) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = rotulo + ": ";
    p.append(strong, document.createTextNode(valor));
    return p;
}

export function criarCartao(tarefa) {
    const item = document.createElement("li");
    const cartao = document.createElement("article");
    cartao.className = "task-card";
    cartao.dataset.id = tarefa.id;

    const cabecalho = document.createElement("header");
    cabecalho.className = "task-card-header";
    const titulo = document.createElement("h4");
    titulo.textContent = tarefa.titulo;
    titulo.title = tarefa.titulo;

    const prioridade = document.createElement("span");
    prioridade.className = "priority " + prioridades[tarefa.prioridade].classe;
    prioridade.textContent = prioridades[tarefa.prioridade].texto;
    cabecalho.append(titulo, prioridade);

    const prazo = document.createElement("p");
    prazo.className = "deadline";
    const rotulo = document.createElement("strong");
    rotulo.textContent = "Prazo: ";
    const time = document.createElement("time");
    time.dateTime = tarefa.prazo;
    time.textContent = tarefa.prazo.split("-").reverse().join("/");
    prazo.append(rotulo, time);

    cartao.append(cabecalho);
    if (tarefa.projeto) cartao.append(criarCampo("Projeto", tarefa.projeto));
    if (tarefa.responsavel) cartao.append(criarCampo("Responsável", tarefa.responsavel));
    cartao.append(prazo);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.acao = "ver-detalhes";

    const textoBotao = document.createElement("span");
    textoBotao.textContent = "Ver detalhes";

    botao.append(textoBotao);
    cartao.append(botao);

    item.append(cartao);
        return item;
    
}

export function renderizarTarefas(tarefas, quadro) {
    quadro.querySelectorAll("[data-lista-status]").forEach((lista) => {
        const cartoes = tarefas
            .filter((tarefa) => tarefa.status === lista.dataset.listaStatus)
            .map(criarCartao);
        lista.replaceChildren(...cartoes);
    });
}

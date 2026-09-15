import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { selecionarTarefas } from "./selecao.js";

const estado = {
    tarefas: [],
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "prazo-asc",
    carregamento: "carregando",
    erro: null
};

const formulario = document.querySelector("#form-filtros");
const camposFiltros = formulario.querySelector("fieldset");
const campoBusca = document.querySelector("#busca-titulo");
const filtroStatus = document.querySelector("#filtro-status");
const filtroPrioridade = document.querySelector("#filtro-prioridade");
const campoOrdenacao = document.querySelector("#ordenacao");

function renderizarAplicacao() {
    camposFiltros.disabled = estado.carregamento !== "sucesso";
    campoBusca.value = estado.busca;
    filtroStatus.value = estado.status;
    filtroPrioridade.value = estado.prioridade;
    campoOrdenacao.value = estado.ordenacao;
    if (estado.carregamento === "carregando") {
        renderizarEstado("carregando");
        return;
    }

    if (estado.carregamento === "erro") {
        const erro = estado.erro;
        let mensagem;

        if (erro.name === "TypeError") {
            mensagem = "Falha de rede. Verifique a conexão e o servidor local.";
        } else if (erro.name === "SyntaxError") {
            mensagem = "Falha de formato. Confira o arquivo dados.json.";
        } else if (erro.name === "ErroProtocolo") {
            mensagem = "Falha de protocolo: HTTP " + erro.status + ".";
        } else {
            mensagem = "Não foi possível carregar as tarefas.";
        }

        renderizarEstado("erro", mensagem);
        return;
    }

    const visiveis = selecionarTarefas(estado);

    if (estado.tarefas.length === 0) {
        renderizarEstado("vazio");
        return;
    }

    if (visiveis.length === 0) {
        renderizarEstado("sem-resultados");
        return;
    }

    renderizarEstado("sucesso", visiveis);

    const mensagem = document.querySelector("[data-estado]");
    mensagem.textContent =
        visiveis.length + " de " + estado.tarefas.length + " tarefas";
}

async function iniciarAplicacao() {
    estado.carregamento = "carregando";
    estado.erro = null;
    renderizarAplicacao();

    try {
        estado.tarefas = await carregarTarefas();
        estado.carregamento = "sucesso";
    } catch (erro) {
        estado.carregamento = "erro";
        estado.erro = erro;
    }

    renderizarAplicacao();
}

campoBusca.addEventListener("input", (evento) => {
    estado.busca = evento.currentTarget.value;
    renderizarAplicacao();
});

filtroStatus.addEventListener("change", (evento) => {
    estado.status = evento.currentTarget.value;
    renderizarAplicacao();
});

filtroPrioridade.addEventListener("change", (evento) => {
    estado.prioridade = evento.currentTarget.value;
    renderizarAplicacao();
});

campoOrdenacao.addEventListener("change", (evento) => {
    estado.ordenacao = evento.currentTarget.value;
    renderizarAplicacao();
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    renderizarAplicacao();
});

formulario.addEventListener("reset", (evento) => {
    evento.preventDefault();

    estado.busca = "";
    estado.status = "todos";
    estado.prioridade = "todas";
    estado.ordenacao = "prazo-asc";

    renderizarAplicacao();
});

const quadro = document.querySelector("[data-quadro]");

quadro.addEventListener("click", (evento) => {
    const botao = evento.target.closest(
        'button[data-acao="ver-detalhes"]'
    );

    if (!botao || !quadro.contains(botao)) return;

    const cartao = botao.closest("[data-id]");
    if (!cartao) return;

    const tarefa = estado.tarefas.find(
        (tarefa) => String(tarefa.id) === cartao.dataset.id
    );

    if (!tarefa) return;

    console.log("Detalhes da tarefa:", tarefa);
});

iniciarAplicacao();

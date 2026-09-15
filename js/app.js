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

function renderizarAplicacao() {
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

iniciarAplicacao();

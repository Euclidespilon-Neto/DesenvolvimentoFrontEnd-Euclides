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

async function iniciarAplicacao() {
    estado.carregamento = "carregando";
    estado.erro = null;
    renderizarEstado("carregando");
    try {
        estado.tarefas = await carregarTarefas();
        estado.carregamento = "sucesso";
        estado.erro = null;
        if (estado.tarefas.length === 0) {
            renderizarEstado("vazio");
            return;
        }
        const tarefasVisiveis = selecionarTarefas(estado);
        renderizarEstado("sucesso", tarefasVisiveis);
    } catch (erro) {
        estado.carregamento = "erro";
        estado.erro = erro;
        let mensagem;
        if (erro.name === "TypeError") {
            mensagem = "Falha de rede. Verifique a conexão e se o servidor local está ativo; depois recarregue a página.";
        } else if (erro.name === "SyntaxError") {
            mensagem = "Falha de formato. Confira a sintaxe e os campos do arquivo dados.json; depois recarregue a página.";
        } else if (erro.name === "ErroProtocolo") {
            mensagem = "Falha de protocolo: HTTP " + erro.status + ". Confira o caminho do arquivo dados.json e recarregue a página.";
        } else {
            mensagem = "Não foi possível carregar as tarefas. Confira o Console para identificar o problema.";
            console.error(erro);
        }
        renderizarEstado("erro", mensagem);
    }
}

iniciarAplicacao();

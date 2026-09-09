import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";

async function iniciarAplicacao() {
    renderizarEstado("carregando");
    try {
        const tarefas = await carregarTarefas();
        if (tarefas.length === 0) {
            renderizarEstado("vazio");
            return;
        }
        renderizarEstado("sucesso", tarefas);
    } catch (erro) {
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

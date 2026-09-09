import { renderizarTarefas } from "./renderizacao.js";

// Desenhar a tela, sem requisições.
export function renderizarEstado(estado, dados) {
    const mensagem = document.querySelector("[data-estado]");
    const quadro = document.querySelector("[data-quadro]");
    quadro.hidden = estado !== "sucesso";
    quadro.setAttribute("aria-busy", String(estado === "carregando"));
    mensagem.dataset.situacao = estado;

    switch (estado) {
        case "carregando":
            mensagem.textContent = "Carregando tarefas...";
            break;
        case "sucesso":
            renderizarTarefas(dados, quadro);
            mensagem.textContent = dados.length + " tarefas carregadas.";
            break;
        case "vazio":
            mensagem.textContent = "Nenhuma tarefa cadastrada. Adicione tarefas ao arquivo dados.json e recarregue a página.";
            break;
        case "erro":
            mensagem.textContent = dados;
            break;
        default:
            throw new Error("Estado desconhecido: " + estado);
    }
}

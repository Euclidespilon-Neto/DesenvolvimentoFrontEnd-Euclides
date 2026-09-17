import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { selecionarTarefas } from "./selecao.js";
import { calcularProgresso } from "./progresso.js";
import { renderizarRadar, contarAtrasadas } from "./radar.js";

const estado = {
    tarefas: [],
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "prazo-asc",
    carregamento: "carregando",
    erro: null,
    tema: "escuro",
    filtrosAbertos: false,
    radarAberto: true
};

const botaoTema = document.querySelector("#alternar-tema");

const formulario = document.querySelector("#form-filtros");
const camposFiltros = formulario.querySelector("fieldset");
const campoBusca = document.querySelector("#busca-titulo");
const filtroStatus = document.querySelector("#filtro-status");
const filtroPrioridade = document.querySelector("#filtro-prioridade");
const campoOrdenacao = document.querySelector("#ordenacao");

const painelProgresso = document.querySelector(".progress-section");
const barraProgresso = document.querySelector("#progresso-geral");
const textoProgresso = document.querySelector("#progresso-percentual");
const resumoProgresso = document.querySelector("#progresso-resumo");

function renderizarProgressoGeral() {
    painelProgresso.hidden = estado.carregamento !== "sucesso";
    if (painelProgresso.hidden) return;

    const progresso = calcularProgresso(estado.tarefas);
    barraProgresso.value = progresso.percentual;
    barraProgresso.textContent = progresso.percentual + "%";
    textoProgresso.textContent = progresso.percentual + "%";
    resumoProgresso.textContent = progresso.total === 0
        ? "Nenhuma tarefa cadastrada."
        : progresso.concluidas + " de " + progresso.total + " tarefas concluídas.";
}

function atualizarColunas(visiveis) {
    // A visibilidade deriva dos dados, nunca da quantidade de cartões no DOM.
    const statusVisiveis = new Set(visiveis.map((tarefa) => tarefa.status));
    document.querySelectorAll("[data-contagem]").forEach(item => {
        item.textContent = visiveis.filter(t => t.status === item.dataset.contagem).length;
    });
    quadro.querySelectorAll("[data-lista-status]").forEach((lista) => {
        lista.closest(".status-column").hidden = !statusVisiveis.has(lista.dataset.listaStatus);
    });
}

function renderizarTema() {
    document.documentElement.dataset.tema = estado.tema;
    botaoTema.hidden = false;
    document.querySelector("#texto-tema").textContent = estado.tema === "escuro"
        ? "Modo claro"
        : "Modo escuro";
}

function renderizarPainel() {
    formulario.hidden = !estado.filtrosAbertos;
    const toggle = document.querySelector("#abrir-filtros");
    toggle.setAttribute("aria-expanded", String(estado.filtrosAbertos));
    toggle.textContent = estado.filtrosAbertos ? "Recolher filtros" : "Mostrar filtros";
    const ativos = Number(Boolean(estado.busca.trim())) + Number(estado.status !== "todos") + Number(estado.prioridade !== "todas");
    document.querySelector("#filtros-ativos").textContent = ativos ? ativos + (ativos === 1 ? " filtro ativo" : " filtros ativos") : "";
    document.querySelector("#limpar-rapido").hidden = !ativos && estado.ordenacao === "prazo-asc";
    document.querySelector(".overview").hidden = estado.carregamento !== "sucesso";
    document.querySelectorAll("[data-resumo]").forEach((item) => {
        item.textContent = item.dataset.resumo === "total" ? estado.tarefas.length : estado.tarefas.filter(t => t.status === item.dataset.resumo).length;
    });
}

function renderizarAplicacao() {
    const radar = document.querySelector("#painel-radar");
    radar.hidden = estado.carregamento !== "sucesso";
    document.querySelector("#radar-conteudo").hidden = !estado.radarAberto;
    const toggleRadar = document.querySelector("#alternar-radar");
    toggleRadar.setAttribute("aria-expanded", String(estado.radarAberto));
    toggleRadar.textContent = estado.radarAberto ? "Recolher radar" : "Mostrar radar";
    renderizarPainel();
    renderizarTema();
    renderizarProgressoGeral();
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
    document.querySelector("#total-atrasadas").textContent = contarAtrasadas(estado.tarefas);
    renderizarRadar(visiveis, estado.tarefas.length);
    atualizarColunas(visiveis);

    if (estado.tarefas.length === 0) {
        renderizarEstado("vazio");
        return;
    }

    if (visiveis.length === 0) {
        renderizarEstado("sem-resultados");
        document.querySelector("[data-estado]").textContent =
            "0 de " + estado.tarefas.length + " tarefas. Altere a busca ou limpe os filtros.";
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

// O tema permanece no estado; não há persistência em localStorage.
botaoTema.addEventListener("click", () => {
    estado.tema = estado.tema === "claro" ? "escuro" : "claro";
    renderizarAplicacao();
});

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

    abrirDetalhes(tarefa, botao);
});

const dialogo = document.querySelector("#detalhes");
let origemDetalhes = null;
let resumoParaCopiar = "";
let versaoDetalhes = 0;
const nomesStatus = {"a-fazer": "A fazer", "em-andamento": "Em andamento", "em-revisao": "Em revisão", "concluida": "Concluída"};
function abrirDetalhes(tarefa, origem) {
    versaoDetalhes++;
    document.querySelector("#copiar-resumo").disabled = false;
    document.querySelector("#copia-status").textContent = "";
    document.querySelector("#copia-manual").hidden = true;
    origemDetalhes = origem;
    dialogo.dataset.status = tarefa.status;
    document.querySelector("#detalhes-titulo").textContent = tarefa.titulo;
    document.querySelector("#detalhes-status").textContent = nomesStatus[tarefa.status] || tarefa.status;
    const lista = document.querySelector("#detalhes-campos");
    lista.replaceChildren();
    const prioridade = {alta: "Alta", media: "Média", baixa: "Baixa"}[tarefa.prioridade] || tarefa.prioridade;
    const prioridadeVisual = document.querySelector("#detalhes-prioridade");
    prioridadeVisual.textContent = "Prioridade " + prioridade;
    prioridadeVisual.className = "priority " + ({alta: "priority-high", media: "priority-medium", baixa: "priority-low"}[tarefa.prioridade] || "");
    const prazo = document.querySelector("#detalhes-prazo");
    prazo.dateTime = tarefa.prazo || "";
    prazo.textContent = tarefa.prazo?.split("-").reverse().join("/") || "Não informado";
    resumoParaCopiar = [tarefa.titulo, "Status: " + (nomesStatus[tarefa.status] || tarefa.status), tarefa.projeto && "Projeto: " + tarefa.projeto, tarefa.responsavel && "Responsável: " + tarefa.responsavel, "Prioridade: " + prioridade, "Prazo: " + prazo.textContent].filter(Boolean).join("\n");
    document.querySelector("#resumo-copiavel").value = resumoParaCopiar;
    for (const [nome, valor] of [["Projeto", tarefa.projeto], ["Responsável", tarefa.responsavel]]) {
        if (!valor) continue;
        const termo = document.createElement("dt"); termo.textContent = nome;
        const descricao = document.createElement("dd"); descricao.textContent = valor;
        lista.append(termo, descricao);
    }
    dialogo.showModal();
    document.body.classList.add("details-open");
}
document.querySelector("#fechar-detalhes").addEventListener("click", () => dialogo.close());
dialogo.addEventListener("close", () => {
    versaoDetalhes++;
    document.body.classList.remove("details-open");
    if (origemDetalhes?.isConnected) origemDetalhes.focus();
});
document.querySelector("#copiar-resumo").addEventListener("click", async (evento) => {
    const botao = evento.currentTarget;
    const versao = versaoDetalhes;
    botao.disabled = true;
    try {
        if (!navigator.clipboard?.writeText) throw new Error("Cópia indisponível");
        await navigator.clipboard.writeText(resumoParaCopiar);
        if (versao === versaoDetalhes) document.querySelector("#copia-status").textContent = "Copiado!";
    } catch {
        if (versao === versaoDetalhes) {
            document.querySelector("#copia-status").textContent = "Não foi possível copiar automaticamente. Use o texto abaixo.";
            document.querySelector("#copia-manual").hidden = false;
        }
    } finally {
        if (versao === versaoDetalhes) botao.disabled = false;
    }
});
document.querySelector("#abrir-filtros").addEventListener("click", () => {
    estado.filtrosAbertos = !estado.filtrosAbertos;
    renderizarAplicacao();
});
document.querySelector("#limpar-rapido").addEventListener("click", () => {
    formulario.reset();
    document.querySelector("#abrir-filtros").focus();
});
// Foto fixa opcional: coloque foto-perfil.jpg na pasta assets.
const foto = document.querySelector("#foto-perfil");
foto.addEventListener("load", () => { foto.hidden = false; });
foto.addEventListener("error", () => { foto.hidden = true; });
// Para usar sua foto, descomente a linha abaixo após copiar o arquivo.
foto.src = "./assets/foto-perfil.jpg";

document.querySelector("#alternar-radar").addEventListener("click", () => {
    estado.radarAberto = !estado.radarAberto;
    renderizarAplicacao();
});
document.querySelector("#radar-linha").addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-radar-id]");
    if (!botao) return;
    const tarefa = estado.tarefas.find(t => String(t.id) === botao.dataset.radarId);
    if (tarefa) abrirDetalhes(tarefa, botao);
});
// Atualiza a referência de hoje ao voltar à aba, sem retirar o foco.
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !dialogo.open) renderizarAplicacao();
});
iniciarAplicacao();

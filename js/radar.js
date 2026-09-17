const nomes = {
    "a-fazer": "A fazer", "em-andamento": "Em andamento",
    "em-revisao": "Em revisão", concluida: "Concluída"
};

// Usa o calendário local: evita deslocar o prazo por causa do fuso UTC.
export function dataLocal(data = new Date()) {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

export function prazoValido(prazo) {
    if (typeof prazo !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(prazo)) return false;
    const [ano, mes, dia] = prazo.split("-").map(Number);
    const data = new Date(0);
    data.setFullYear(ano, mes - 1, dia);
    return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

export function contarAtrasadas(tarefas, hoje = dataLocal()) {
    return tarefas.filter(t => prazoValido(t.prazo) && t.prazo < hoje && t.status !== "concluida").length;
}

export function agruparPrazos(tarefas, hoje = dataLocal()) {
    const grupos = new Map([[hoje, []]]);
    for (const tarefa of tarefas) {
        if (!prazoValido(tarefa.prazo)) continue;
        if (!grupos.has(tarefa.prazo)) grupos.set(tarefa.prazo, []);
        grupos.get(tarefa.prazo).push(tarefa);
    }
    return [...grupos].sort(([a], [b]) => a.localeCompare(b));
}

function elemento(tag, classe, texto) {
    const item = document.createElement(tag);
    item.className = classe;
    if (texto !== undefined) item.textContent = texto;
    return item;
}

export function renderizarRadar(tarefas, total) {
    const hoje = dataLocal();
    const linha = document.querySelector("#radar-linha");
    const mensagem = document.querySelector("#radar-mensagem");
    const foco = linha.contains(document.activeElement) ? document.activeElement.dataset.radarId : null;
    const validas = tarefas.filter(t => prazoValido(t.prazo));
    const semPrazo = tarefas.length - validas.length;
    mensagem.textContent = total === 0 ? "Nenhuma tarefa cadastrada."
        : tarefas.length === 0 ? "Nenhuma tarefa corresponde aos filtros. Altere ou limpe os critérios."
        : `${validas.length} de ${total} tarefas no radar. Datas em ordem cronológica; intervalos compactados.`
            + (semPrazo ? ` ${semPrazo} tarefa(s) sem prazo válido.` : "");
    const fragmento = document.createDocumentFragment();
    for (const [prazo, grupo] of agruparPrazos(tarefas, hoje)) {
        const dia = elemento("li", "radar-day" + (prazo === hoje ? " radar-today" : ""));
        const data = elemento("time", "radar-date", prazo.split("-").reverse().join("/"));
        data.dateTime = prazo;
        dia.append(data);
        if (prazo === hoje) dia.append(elemento("span", "radar-now", "HOJE"));
        const lista = elemento("ul", "radar-tasks");
        for (const tarefa of grupo) {
            const item = elemento("li", "radar-task");
            const botao = elemento("button", "radar-marker");
            botao.type = "button";
            botao.dataset.radarId = String(tarefa.id);
            botao.dataset.status = tarefa.status;
            const atrasada = prazo < hoje && tarefa.status !== "concluida";
            botao.setAttribute("aria-label", `${tarefa.titulo}. ${nomes[tarefa.status] || tarefa.status}. Prazo ${data.textContent}.${atrasada ? " Atrasada." : ""} Abrir detalhes.`);
            botao.append(elemento("span", "radar-task-title", tarefa.titulo));
            botao.append(elemento("small", "radar-task-status", `${nomes[tarefa.status] || tarefa.status}${atrasada ? " · Atrasada" : ""}`));
            item.append(botao);
            lista.append(item);
        }
        dia.append(lista);
        if (grupo.length === 0) dia.append(elemento("small", "radar-no-deadline", "Sem entrega neste dia"));
        fragmento.append(dia);
    }
    linha.replaceChildren(fragmento);
    if (foco !== null) {
        const alvo = [...linha.querySelectorAll("[data-radar-id]")].find(b => b.dataset.radarId === foco);
        alvo?.focus({preventScroll: true});
    }
}

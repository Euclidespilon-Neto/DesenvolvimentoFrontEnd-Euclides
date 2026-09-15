export function selecionarTarefas(estado) {
    const termo = estado.busca.trim().toLowerCase();

    const visiveis = estado.tarefas.filter((tarefa) => {
        const correspondeBusca = tarefa.titulo
            .toLowerCase()
            .includes(termo);

        const correspondeStatus =
            estado.status === "todos" ||
            tarefa.status === estado.status;

        const correspondePrioridade =
            estado.prioridade === "todas" ||
            tarefa.prioridade === estado.prioridade;

        return correspondeBusca &&
            correspondeStatus &&
            correspondePrioridade;
    });

    return [...visiveis].sort((a, b) => {
        if (estado.ordenacao === "prazo-desc") {
            return b.prazo.localeCompare(a.prazo);
        }

        return a.prazo.localeCompare(b.prazo);
    });
}
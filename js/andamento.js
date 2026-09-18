export const statusPermitidos = ["a-fazer", "em-andamento", "em-revisao", "concluida"];

export function alterarStatus(tarefas, id, status) {
    if (!statusPermitidos.includes(status)) throw new Error("Status inválido.");
    return tarefas.map(tarefa => String(tarefa.id) === String(id)
        ? { ...tarefa, status } : tarefa);
}

export function todasConcluidas(tarefas) {
    return tarefas.length > 0 && tarefas.every(tarefa => tarefa.status === "concluida");
}

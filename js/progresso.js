// Derivação pura: não consulta o DOM nem modifica as tarefas recebidas.
const pesoPorStatus = {
    "a-fazer": 0,
    "em-andamento": 33,
    "em-revisao": 66,
    "concluida": 100
};

export function calcularProgresso(tarefas) {
    if (tarefas.length === 0) {
        return { percentual: 0, concluidas: 0, total: 0 };
    }

    const soma = tarefas.reduce((total, tarefa) => total + pesoPorStatus[tarefa.status], 0);
    const concluidas = tarefas.filter((tarefa) => tarefa.status === "concluida").length;
    return {
        percentual: Math.round(soma / tarefas.length),
        concluidas,
        total: tarefas.length
    };
}

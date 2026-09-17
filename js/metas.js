// Conquistas derivadas das tarefas originais. Não altera dados nem consulta o DOM.
export function calcularMetas(tarefas) {
    const total = tarefas.length;
    const concluidas = tarefas.filter(tarefa => tarefa.status === "concluida").length;
    const metade = Math.ceil(total / 2);
    const conquistas = { primeira: concluidas > 0, metade: total > 0 && concluidas >= metade, todas: total > 0 && concluidas === total };
    let mensagem;
    if (!total) mensagem = "As metas aparecem quando houver tarefas no quadro.";
    else if (conquistas.todas) mensagem = "Quadro concluído! Todas as entregas desta lista estão finalizadas. Reconheça o que você realizou.";
    else {
        const alvo = concluidas === 0 ? 1 : concluidas < metade ? metade : total;
        const faltam = alvo - concluidas;
        const objetivo = concluidas === 0 ? "sua primeira entrega" : concluidas < metade ? "metade do quadro" : "o quadro completo";
        mensagem = `Próxima conquista: ${objetivo}. ${faltam === 1 ? "Falta 1 tarefa" : `Faltam ${faltam} tarefas`}. Uma etapa de cada vez.`;
    }
    return { total, concluidas, percentual: total ? Math.floor(concluidas / total * 100) : 0, conquistas, mensagem };
}

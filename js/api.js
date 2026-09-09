// Obter e validar dados, sem selecionar ou modificar elementos HTML.
export async function carregarTarefas() {
    const resposta = await fetch("./dados.json");

    if (!resposta.ok) {
        const erro = new Error("Resposta HTTP " + resposta.status);
        erro.name = "ErroProtocolo";
        erro.status = resposta.status;
        throw erro;
    }

    const documento = await resposta.json();
    if (!documento || typeof documento !== "object" ||
        Array.isArray(documento) || !Array.isArray(documento.tarefas)) {
        throw new SyntaxError('O JSON deve conter um objeto com o array "tarefas".');
    }

    const statusValidos = ["a-fazer", "em-andamento", "em-revisao", "concluida"];
    const prioridadesValidas = ["alta", "media", "baixa"];
    const ids = new Set();
    for (const tarefa of documento.tarefas) {
        if (!tarefa || typeof tarefa !== "object" ||
            !(typeof tarefa.id === "string" || typeof tarefa.id === "number") ||
            String(tarefa.id).trim() === "" || ids.has(String(tarefa.id)) ||
            typeof tarefa.titulo !== "string" || tarefa.titulo.trim() === "" ||
            !statusValidos.includes(tarefa.status) ||
            !prioridadesValidas.includes(tarefa.prioridade) ||
            typeof tarefa.prazo !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(tarefa.prazo)) {
            throw new SyntaxError("Uma tarefa contém campos inválidos ou ID repetido.");
        }
        ids.add(String(tarefa.id));
    }
    return documento.tarefas;
}

import { useState, useEffect } from "react";
import groups from "../data/groups";
import { taskService } from "../services/taskService"; // <-- IMPORTADO AQUI

export default function useKanban(id) {
    const grupo = groups.find((g) => g.id === Number(id));
    const [listaTarefas, setListaTarefas] = useState([]);
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
    const [carregando, setCarregando] = useState(true); // <-- Estado para o loading

    // Carrega as tarefas vindas do serviço assíncrono
    useEffect(() => {
        async function carregarDados() {
            if (grupo) {
                setCarregando(true);
                try {
                    const tarefasDoGrupo = await taskService.buscarPorGrupo(grupo.id);
                    setListaTarefas(tarefasDoGrupo);
                } catch (error) {
                    console.error("Erro ao carregar tarefas:", error);
                } finally {
                    setCarregando(false);
                }
            }
        }
        carregarDados();
    }, [id, grupo]);

    // Função de Adicionar conectada ao serviço
    async function adicionarTarefa(dadosNovaTarefa) {
        const novaTarefaCompleta = {
            id: Date.now(),
            grupo: grupo.id,
            status: "todo",
            aprovado: false,
            comentarioProfessor: "",
            aprovadoPor: "",
            dataAprovacao: null,
            prioridade: dadosNovaTarefa.prioridade || "Média",
            dataEntrega: dadosNovaTarefa.dataEntrega || new Date().toISOString().split('T')[0],
            descricao: dadosNovaTarefa.descricao || "",
            ...dadosNovaTarefa,
            historico: [
                {
                    data: new Date().toLocaleDateString("pt-BR"),
                    evento: "Tarefa criada no sistema."
                }
            ]
        };

        try {
            // Salva no "banco" e atualiza o estado visual
            const tarefaSalva = await taskService.salvar(novaTarefaCompleta);
            setListaTarefas((anteriores) => [...anteriores, tarefaSalva]);
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
        }
    }

    // Função de Atualizar conectada ao serviço
    async function atualizarTarefa(tarefaId, dadosAtualizados) {
        try {
            // Busca a tarefa original para manter o histórico antigo intacto
            const tarefaOriginal = listaTarefas.find(t => t.id === tarefaId);
            if (!tarefaOriginal) return;

            const novoHistorico = [...tarefaOriginal.historico];
            if (dadosAtualizados.status && dadosAtualizados.status !== tarefaOriginal.status) {
                novoHistorico.push({
                    data: new Date().toLocaleDateString("pt-BR"),
                    evento: `Status alterado para: ${dadosAtualizados.status}`
                });
            }
            if (dadosAtualizados.comentarioProfessor && dadosAtualizados.comentarioProfessor !== tarefaOriginal.comentarioProfessor) {
                novoHistorico.push({
                    data: new Date().toLocaleDateString("pt-BR"),
                    evento: "Professor adicionou uma orientação pedagógica."
                });
            }

            const dadosComHistorico = { ...dadosAtualizados, historico: novoHistorico };

            // Envia para o serviço
            await taskService.atualizar(tarefaId, dadosComHistorico);
            
            // Atualiza o estado na tela
            setListaTarefas((anteriores) =>
                anteriores.map((t) => t.id === tarefaId ? { ...t, ...dadosComHistorico } : t)
            );
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    }

    return {
        grupo,
        listaTarefas,
        tarefaSelecionada,
        setTarefaSelecionada,
        adicionarTarefa,
        atualizarTarefa,
        carregando // <-- Exportado para a página usar se quiser
    };
}
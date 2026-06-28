import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import KanbanColumn from "../components/kanban/KanbanColumn";
import TaskCard from "../components/kanban/TaskCard";
import NewTask from "../components/kanban/NewTask";
import TaskModal from "../components/kanban/TaskModal";
import columns from "../data/columns";
import useKanban from "../hooks/useKanban";
import "../styles/kanban.css";

function Kanban() {
    const { id } = useParams();
    
    // Puxando as funções e estados limpos do hook customizado
    const {
        grupo,
        listaTarefas,
        tarefaSelecionada,
        setTarefaSelecionada,
        adicionarTarefa,
        //moverTarefa, Pronto para futuras implementações de movimentação
        atualizarTarefa,
        carregando
    } = useKanban(id);

    if (!grupo) {
        return (
            <>
                <Header />
                <h1 style={{ padding: "40px" }}>Grupo não encontrado.</h1>
            </>
        );
    }

    // Se estiver buscando os dados do serviço, exibe uma mensagem limpa
    if (carregando) {
        return (
            <>
                <Header />
                <div style={{ padding: "40px", textAlign: "center" }}>
                    <h2>Carregando tarefas do projeto...</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="kanban-page">
                <div className="kanban-info">
                    <div>
                        <h1>{grupo.nome}</h1>
                        <span>Plataforma SpreadsProject • KanbanMulti</span>
                    </div>
                    {/* O NewTask agora recebe apenas a ação limpa. Ele não sabe como o objeto completo é gerado */}
                    <NewTask adicionarTarefa={adicionarTarefa} />
                </div>

                <div className="kanban-board">
                    {columns.map((coluna) => (
                        <KanbanColumn
                            key={coluna.id}
                            titulo={coluna.titulo}
                        >
                            {listaTarefas
                                .filter((tarefa) => tarefa.status === coluna.status)
                                .map((tarefa) => (
                                    <TaskCard
                                        key={tarefa.id}
                                        tarefa={tarefa}
                                        selecionar={setTarefaSelecionada}
                                    />
                                ))}
                        </KanbanColumn>
                    ))}
                </div>
            </div>

            {/* O Modal precisa de uma forma de atualizar o estado se o professor interagir */}
            <TaskModal
                tarefa={tarefaSelecionada}
                fechar={() => setTarefaSelecionada(null)}
                onSalvar={atualizarTarefa}
            />
        </>
    );
}

export default Kanban;
import { useState, useEffect } from "react";
import "../../styles/taskModal.css";

function TaskModal({ tarefa, fechar, onSalvar }) {
    // Estados locais para controlar os inputs do professor
    const [comentario, setComentario] = useState("");
    const [status, setStatus] = useState("");
    const [aprovado, setAprovado] = useState(false);

    // Sempre que a tarefa selecionada mudar, atualiza os campos do modal
    useEffect(() => {
        if (tarefa) {
            setComentario(tarefa.comentarioProfessor || "");
            setStatus(tarefa.status || "todo");
            setAprovado(tarefa.aprovado || false);
        }
    }, [tarefa]);

    if (!tarefa) return null;

    function lidarComSalvar() {
        // Injeta os dados de aprovação caso o status mude para "done"
        const dadosAtualizados = {
            status,
            comentarioProfessor: comentario,
            aprovado: status === "done" ? aprovado : false,
            aprovadoPor: status === "done" && aprovado ? "Professor" : "",
            dataAprovacao: status === "done" && aprovado ? new Date().toLocaleDateString("pt-BR") : null
        };

        onSalvar(tarefa.id, dadosAtualizados);
        fechar(); // Fecha o modal após salvar
    }

    return (
        <div className="modal-overlay">
            <div className="task-modal">
                <button className="btn-fechar" onClick={fechar}>✖</button>
                
                <h2>{tarefa.titulo}</h2>
                <span className="task-id">ID da Tarefa: #{tarefa.id}</span>
                <hr />

                <div className="modal-grid">
                    {/* Coluna da Esquerda: Detalhes do Aluno */}
                    <div className="modal-main">
                        <section className="modal-section">
                            <h3>Descrição do Aluno</h3>
                            <p className="descricao-box">{tarefa.descricao || "Nenhuma descrição fornecida."}</p>
                        </section>

                        <section className="modal-section">
                            <h3>Histórico de Evolução</h3>
                            <div className="historico-lista">
                                {tarefa.historico.map((evento, index) => (
                                    <div key={index} className="historico-item">
                                        <small>{evento.data}</small>
                                        <p>{evento.evento}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Coluna da Direita: Painel de Avaliação do Professor */}
                    <div className="modal-sidebar">
                        <section className="modal-section avaliacao-box">
                            <h3>Avaliação Técnica</h3>
                            
                            <label>Alterar Status:</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="todo">A Fazer</option>
                                <option value="doing">Em Andamento</option>
                                <option value="return">Retorno (Correção)</option>
                                <option value="done">Concluído</option>
                            </select>

                            {status === "done" && (
                                <div className="aprovacao-checkbox">
                                    <input 
                                        type="checkbox" 
                                        id="aprovar" 
                                        checked={aprovado} 
                                        onChange={(e) => setAprovado(e.target.checked)} 
                                    />
                                    <label htmlFor="aprovar">Dar o visto final (Aprovado)?</label>
                                </div>
                            )}

                            <label>Feedback / Orientação Pedagógica:</label>
                            <textarea
                                placeholder="Digite aqui os pontos a corrigir ou feedbacks positivos..."
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                rows={4}
                            />

                            <button className="btn-salvar" onClick={lidarComSalvar}>
                                Salvar Alterações
                            </button>
                        </section>

                        <section className="modal-info-dados">
                            <p><strong>Responsável:</strong> {tarefa.responsavel}</p>
                            <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
                            <p><strong>Prazo:</strong> {tarefa.dataEntrega}</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskModal;
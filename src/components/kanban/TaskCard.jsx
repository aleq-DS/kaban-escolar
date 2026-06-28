import "../../styles/taskCard.css";

function TaskCard({ tarefa, selecionar }) {

    return (

        <div

            className="task-card"

            onClick={() => selecionar(tarefa)}

        >

            <h4>{tarefa.titulo}</h4>

            <p>

                👤 {tarefa.responsavel}

            </p>

            <p>

                📅 {tarefa.dataEntrega}

            </p>

            <p>

                🚩 {tarefa.prioridade}

            </p>

            {

                tarefa.status === "done" && (

                    tarefa.aprovado ?

                        <span className="badge aprovado">

                            ✔ Aprovado

                        </span>

                        :

                        <span className="badge aguardando">

                            ⏳ Aguardando aprovação

                        </span>

                )

            }

            {

                tarefa.status === "return" && (

                    <span className="badge retorno">

                        🔄 Em retorno

                    </span>

                )

            }

        </div>

    );

}

export default TaskCard;
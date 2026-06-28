import "../../styles/kanbanColumn.css";

function KanbanColumn({ titulo, children }){

    return(

        <div className="kanban-column">

            <h2>{titulo}</h2>

            {children}

        </div>

    )

}

export default KanbanColumn;
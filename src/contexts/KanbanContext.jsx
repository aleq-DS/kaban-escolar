import { createContext, useContext } from "react";
import useKanbanInternal from "../hooks/useKanban";

const KanbanContext = createContext();

export function KanbanProvider({ children, grupoId }) {
    // Inicializa o hook de controle dentro do contexto
    const kanban = useKanbanInternal(grupoId);

    return (
        <KanbanContext.Provider value={kanban}>
            {children}
        </KanbanContext.Provider>
    );
}

// Hook customizado para os componentes filhos consumirem os dados sem prop drilling
export function useKanbanContext() {
    const context = useContext(KanbanContext);
    if (!context) {
        throw new Error("useKanbanContext deve ser usado dentro de um KanbanProvider");
    }
    return context;
}
import "../../styles/groupCard.css";
import { useNavigate } from "react-router-dom";

// Mantemos o id apenas se precisar exibir visualmente (ex: "Grupo 1")
function GroupCard({ id, docId, nome, integrantes, progresso }) {
    const navigate = useNavigate();

    return (
        <div className="group-card">
            <h2>{nome}</h2>
            <p><strong>Integrantes:</strong> {integrantes}</p>
            <p><strong>Progresso:</strong> {progresso}%</p>
            <div className="progress">
                <div
                    className="progress-bar"
                    style={{ width: `${progresso}%` }}
                ></div>
            </div>
            
            {/* CORRIGIDO: Força o uso do docId composto da rota */}
            <button onClick={() => navigate(`/kanban/${docId}`)}>
                Abrir
            </button>
        </div>
    );
}

export default GroupCard;
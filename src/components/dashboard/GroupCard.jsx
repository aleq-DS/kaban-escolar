import "../../styles/groupCard.css";
import { useNavigate } from "react-router-dom";

function GroupCard({ id, nome, integrantes, progresso }) {

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

            <button
                onClick={() => navigate(`/kanban/${id}`)}
            >
                Abrir
            </button>

        </div>

    );

}

export default GroupCard;
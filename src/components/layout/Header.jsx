import "../../styles/header.css";
import logo from "../../assets/logo/logo.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const lidarComBotaoAcesso = () => {
        if (usuario) {
            logout();
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    return (
        <header className="header">
            <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <img
                    src={logo}
                    alt="SpreadsProject"
                    className="logo-image"
                />
                <div>
                    <h1>SpreadsProject</h1>
                    <span>KanbanMulti</span>
                </div>
            </div>

            <nav style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Informações de Perfil do Usuário Logado */}
                {usuario && (
                    <div className="user-profile" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="user-name" style={{ fontWeight: "500", color: "#f9fafc", fontSize: "0.85rem" }}>
                            Olá, {(usuario.nome || usuario.displayName || "Usuário").split(" ")[0]} {/* Exibe apenas o primeiro nome */}
                        </span>

                        {/* ÍCONE CONDICIONAL BASEADO NO PERFIL */}
                        <span 
                            title={usuario.perfil === "professor" ? "Professor" : usuario.perfil === "lider" ? "Líder de Grupo" : "Estudante"} 
                            style={{ fontSize: "0.95rem", cursor: "help", display: "flex", alignItems: "center" }}
                        >
                            {usuario.perfil === "professor" || usuario.perfil === "lider" ? "👑" : "🎓"}
                        </span>
                        
                        {/* Renderização da Foto Real ou Inicial Alternativa */}
                        {usuario.photoURL ? (
                            <img 
                                src={usuario.photoURL} 
                                alt="Perfil" 
                                referrerpolicy="no-referrer" /* Evita bloqueio de imagem do ecossistema Google */
                                style={{ 
                                    width: "30px", 
                                    height: "30px", 
                                    borderRadius: "50%", 
                                    objectFit: "cover",
                                    border: "1.5px solid rgba(255,255,255,0.6)",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
                                }}
                            />
                        ) : (
                            <div style={{ 
                                width: "30px", 
                                height: "30px", 
                                borderRadius: "50%", 
                                backgroundColor: "#0052cc", 
                                color: "#fff", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
                            }}>
                                {(usuario.nome || usuario.email || "U").charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )}

                {/* Botão Sair - Agora mais compacto */}
                <button 
                    className="login-button" 
                    onClick={lidarComBotaoAcesso}
                    style={{
                        padding: "6px 14px", /* Reduzido o padding para ficar menor */
                        fontSize: "0.85rem",  /* Fonte ligeiramente menor */
                        borderRadius: "4px"
                    }}
                >
                    {usuario ? "Sair" : "Entrar"}
                </button>
            </nav>
        </header>
    );
}

export default Header;
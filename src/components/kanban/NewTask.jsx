import { useState } from "react";

function NewTask({ adicionarTarefa }) {
    const [titulo, setTitulo] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [focoTitulo, setFocoTitulo] = useState(false);
    const [focoResponsavel, setFocoResponsavel] = useState(false);

    function salvar() {
        if (titulo.trim() === "") return;

        adicionarTarefa({
            id: Date.now(),
            titulo,
            responsavel,
            status: "todo"
        });

        setTitulo("");
        setResponsavel("");
    }

    return (
        <div
            style={{
                display: "flex",
                gap: "12px",
                marginBottom: "25px",
                padding: "16px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(23, 43, 77, 0.08)",
                border: "1px solid #e1e4e8",
                alignItems: "center"
            }}
        >
            <input
                placeholder="Título da nova tarefa..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                onFocus={() => setFocoTitulo(true)}
                onBlur={() => setFocoTitulo(false)}
                style={{
                    flex: 2, // Dá mais espaço para o título
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: focoTitulo ? "2px solid #0052cc" : "2px solid #dfe1e6",
                    outline: "none",
                    fontSize: "0.95rem",
                    color: "#172b4d",
                    backgroundColor: focoTitulo ? "#fff" : "#f4f5f7",
                    transition: "all 0.2s ease-in-out"
                }}
            />

            <input
                placeholder="Responsável"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                onFocus={() => setFocoResponsavel(true)}
                onBlur={() => setFocoResponsavel(false)}
                style={{
                    flex: 1, // Espaço menor para o nome do responsável
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: focoResponsavel ? "2px solid #0052cc" : "2px solid #dfe1e6",
                    outline: "none",
                    fontSize: "0.95rem",
                    color: "#172b4d",
                    backgroundColor: focoResponsavel ? "#fff" : "#f4f5f7",
                    transition: "all 0.2s ease-in-out"
                }}
            />

            <button 
                onClick={salvar}
                style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#0052cc",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 82, 204, 0.2)",
                    transition: "background-color 0.2s",
                    whiteSpace: "nowrap"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#0065ff"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#0052cc"}
            >
                ➕ Criar Tarefa
            </button>
        </div>
    );
}

export default NewTask;
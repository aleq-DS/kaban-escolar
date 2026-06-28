import { useState } from "react";

function NewTask({ adicionarTarefa }) {

    const [titulo, setTitulo] = useState("");
    const [responsavel, setResponsavel] = useState("");

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
                gap: "10px",
                marginBottom: "30px"
            }}
        >

            <input
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
            />

            <input
                placeholder="Responsável"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
            />

            <button onClick={salvar}>

                Nova Tarefa

            </button>

        </div>

    );

}

export default NewTask;
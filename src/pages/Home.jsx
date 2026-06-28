import Header from "../components/layout/Header";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();

    return(

        <>

            <Header/>

            <div className="home">

                <h1>Kanban Escolar</h1>

                <p>

                    Plataforma para gerenciamento dos Projetos
                    Multidisciplinares.

                </p>

                <button onClick={() => navigate("/dashboard")}>

                    Começar

                </button>

            </div>

        </>

    )

}

export default Home;
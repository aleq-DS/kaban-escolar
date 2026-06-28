import Header from "../components/layout/Header";
import GroupCard from "../components/dashboard/GroupCard";

import groups from "../data/groups";

function Dashboard() {

    return (

        <>

            <Header />

            <div
                style={{
                    padding: "40px"
                }}
            >

                <h1>Projetos Multidisciplinares</h1>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        marginTop: "30px",
                        flexWrap: "wrap"
                    }}
                >

                    {
                        groups.map((grupo) => (

                            <GroupCard

                                key={grupo.id}

                                id={grupo.id}

                                nome={grupo.nome}

                                integrantes={grupo.integrantes}

                                progresso={grupo.progresso}

                            />

                        ))
                    }

                </div>

            </div>

        </>

    );

}

export default Dashboard;
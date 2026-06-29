import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, setDoc } from "firebase/firestore";
import Header from "../components/layout/Header";
import GroupCard from "../components/dashboard/GroupCard";

function Dashboard() {
    const { usuario } = useAuth();
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [listaGrupos, setListaGrupos] = useState([]); 
    const [listaEscolas, setListaEscolas] = useState([]); // Nova lista dinâmica de escolas
    const [carregando, setCarregando] = useState(true);

    // Controle da Escola Ativa no Panel (Começa vazia e assume a primeira disponível)
    const [escolaAtiva, setEscolaAtiva] = useState("");

    const ehProfessor = usuario?.perfil === "professor";
    const temGrupo = usuario?.grupoId !== null && usuario?.grupoId !== undefined;

    // 1. Escuta todas as ESCOLAS do Firestore em tempo real
    useEffect(() => {
        const unsubscribeEscolas = onSnapshot(collection(db, "escolas"), (snapshot) => {
            const escolasData = [];
            snapshot.forEach((doc) => {
                escolasData.push({ id: doc.id, ...doc.data() });
            });

            // Se não houver nenhuma escola cadastrada no banco ainda, cria a padrão para não quebrar
            if (escolasData.length === 0 && ehProfessor) {
                const inicializarEscolaPadrao = async () => {
                    await setDoc(doc(db, "escolas", "escola-padrao"), { nome: "Escola Padrão" });
                };
                inicializarEscolaPadrao();
                return;
            }

            setListaEscolas(escolasData);
            
            // Define a primeira escola como ativa se nenhuma estiver selecionada
            if (escolasData.length > 0 && !escolaAtiva) {
                setEscolaAtiva(escolasData[0].id);
            }
        }, (error) => {
            console.error("Erro ao buscar escolas:", error);
        });

        return () => unsubscribeEscolas();
    }, [ehProfessor, escolaAtiva]); // Corrigido a dependência se necessário ou mantido escolaAtiva

    // 2. Escuta todos os Grupos do Firestore em tempo real
    useEffect(() => {
        const unsubscribeGrupos = onSnapshot(collection(db, "grupos"), (snapshot) => {
            const groupsData = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                groupsData.push({ 
                    docId: doc.id, 
                    id: data.id || doc.id, 
                    ...data 
                });
            });
            
            groupsData.sort((a, b) => {
                const numA = Number(a.id);
                const numB = Number(b.id);
                if (numA !== numB) return numA - numB;
                return String(a.docId).localeCompare(String(b.docId));
            });

            setListaGrupos(groupsData);
        }, (error) => {
            console.error("Erro ao buscar grupos do Firestore:", error);
        });

        return () => unsubscribeGrupos();
    }, []);

    // 3. Escuta os Usuários em tempo real
    useEffect(() => {
        const unsubscribeUsuarios = onSnapshot(collection(db, "usuarios"), (snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.perfil !== "professor") {
                    users.push({ uid: doc.id, ...data });
                }
            });
            setListaUsuarios(users);
            setCarregando(false);
        }, (error) => {
            console.error("Erro ao buscar usuários:", error);
            setCarregando(false);
        });

        return () => unsubscribeUsuarios();
    }, []);

    // Função para o Professor editar o nome da escola selecionada atualmente
    const editarNomeEscola = async () => {
        if (!escolaAtiva) return;

        // Encontra o nome atual correspondente ao ID ativo
        const escolaAtual = listaEscolas.find(e => e.id === escolaAtiva);
        const nomeAtual = escolaAtual ? escolaAtual.nome : "Escola Padrão";

        const novoNome = prompt("Digite o novo nome para esta Unidade Escolar:", nomeAtual);
        if (!novoNome || !novoNome.trim()) return;

        try {
            const escolaRef = doc(db, "escolas", escolaAtiva);
            await updateDoc(escolaRef, {
                nome: novoNome.trim()
            });
            alert("Nome da unidade escolar atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar o nome da escola:", error);
            alert("Erro ao salvar as alterações no banco.");
        }
    };

    // Função para o Professor adicionar uma nova unidade escolar no Firestore
    const adicionarNovaEscola = async () => {
        const nomeEscola = prompt("Digite o nome da nova Unidade Escolar:");
        if (!nomeEscola || !nomeEscola.trim()) return;

        const escolaId = nomeEscola
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/[^a-z0-9 ]/g, "")      // Remove caracteres especiais (corrigido range de 0-9)
            .trim()
            .replace(/\s+/g, "-");           // Substitui espaços por hífen

        try {
            await setDoc(doc(db, "escolas", escolaId), {
                nome: nomeEscola.trim()
            });
            setEscolaAtiva(escolaId); // Muda a aba ativa para a recém-criada
            alert("Nova unidade escolar adicionada com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar escola:", error);
            alert("Erro ao salvar nova escola no banco.");
        }
    };

    // O Professor cria o grupo atrelando-o à escola selecionada
    const criarNovoGrupo = async () => {
        if (!escolaAtiva) return;
        const gruposDaEscolaAtual = listaGrupos.filter(g => g.escolaId === escolaAtiva);

        const proximoId = gruposDaEscolaAtual.length > 0 
            ? Number(gruposDaEscolaAtual[gruposDaEscolaAtual.length - 1].id) + 1 
            : 1;

        const nomePadrao = `Grupo ${proximoId} - Novo Projeto`;

        try {
            const documentoId = `${escolaAtiva}_${proximoId}`;

            await setDoc(doc(db, "grupos", documentoId), {
                id: String(proximoId), 
                nome: nomePadrao,
                integrantes: "A definir",
                progresso: 0,
                escolaId: escolaAtiva 
            });
        } catch (error) {
            console.error("Erro ao instanciar novo grupo:", error);
            alert("Erro ao criar grupo no Firestore.");
        }
    };

    // Altera o grupo e cargo do aluno no banco
    const atualizarAcessoAluno = async (uid, subId, tornarLider) => {
        try {
            const userRef = doc(db, "usuarios", uid);
            const grupoDocId = subId === "" ? null : subId;

            await updateDoc(userRef, {
                grupoId: grupoDocId, 
                escolaId: subId === "" ? null : escolaAtiva, 
                perfil: tornarLider ? "lider" : "aluno"
            });
            alert("Permissões do estudante updated com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            alert("Erro ao salvar alterações.");
        }
    };

    if (carregando) {
        return (
            <>
                <Header />
                <div style={{ padding: "40px", textAlign: "center" }}>
                    <h2>Carregando informações do painel...</h2>
                </div>
            </>
        );
    }

    // CASO 1: SALA DE ESPERA (Se for aluno novo sem grupo)
    if (!ehProfessor && !temGrupo) {
        return (
            <>
                <Header />
                <div style={{ padding: "60px 40px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
                    <div style={{ backgroundColor: "#fffae6", border: "1px solid #ffe380", padding: "30px", borderRadius: "8px" }}>
                        <h2 style={{ color: "#ff8b00", marginBottom: "15px" }}>Acesso em Análise ⏳</h2>
                        <p style={{ fontSize: "1.1rem", color: "#172b4d", lineHeight: "1.6" }}>
                            Olá, <strong>{usuario?.nome}</strong>! Seu cadastro foi realizado com sucesso.
                        </p>
                        <p style={{ fontSize: "1rem", color: "#5e6c84", marginTop: "10px" }}>
                            Por favor, aguarde o liberação do seu acesso para vinculação à sua respectiva Escola e Grupo.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // --- REGRAS DE FILTRAGEM DINÂMICA ---
    const gruposVisiveis = ehProfessor 
        ? listaGrupos.filter((g) => g.escolaId === escolaAtiva) 
        : listaGrupos.filter((g) => String(g.docId) === String(usuario.grupoId));

    const usuariosFiltradosPorEscola = listaUsuarios.filter(aluno => {
        return !aluno.escolaId || aluno.escolaId === escolaAtiva;
    });

    // Encontra o nome textual da escola ativa para exibir no título
    const nomeDaEscolaAtual = listaEscolas.find(e => e.id === escolaAtiva)?.nome || "Unidade Escolar";

    return (
        <>
            <Header />
            <div style={{ padding: "40px" }}>
                
                {ehProfessor && (
                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid #dfe1e6", paddingBottom: "10px", flexWrap: "wrap", alignItems: "center" }}>
                        {/* MAP DAS ABAS DINÂMICAS VINDA DO BANCO */}
                        {listaEscolas.map((escola) => (
                            <button 
                                key={escola.id}
                                onClick={() => setEscolaAtiva(escola.id)}
                                style={{ 
                                    padding: "10px 20px", 
                                    border: "none", 
                                    borderRadius: "4px", 
                                    cursor: "pointer", 
                                    fontWeight: "bold", 
                                    fontSize: "0.95rem", 
                                    backgroundColor: escolaAtiva === escola.id ? "#0052cc" : "#f4f5f7", 
                                    color: escolaAtiva === escola.id ? "#fff" : "#172b4d", 
                                    transition: "all 0.2s" 
                                }}
                            >
                                🏫 {escola.nome}
                            </button>
                        ))}
                        
                        {/* BOTÃO PARA ADICIONAR NOVA UNIDADE */}
                        <button 
                            onClick={adicionarNovaEscola}
                            style={{ padding: "10px 15px", border: "1px dashed #0052cc", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem", backgroundColor: "#fff", color: "#0052cc", transition: "all 0.2s" }}
                        >
                            ➕ Add Nova Unidade Escolar
                        </button>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h1 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {ehProfessor 
                            ? `Painel Docente — ${nomeDaEscolaAtual}` 
                            : "Seu Projeto Multidisciplinar"
                        }
                        
                        {/* Botão de edição rápida de nome para a aba ativa */}
                        {ehProfessor && (
                            <button
                                onClick={editarNomeEscola}
                                title="Editar nome desta escola"
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "1.2rem",
                                    padding: "4px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    opacity: 0.6,
                                    transition: "opacity 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
                            >
                                ✏️
                            </button>
                        )}
                    </h1>
                    {ehProfessor && (
                        <button 
                            onClick={criarNovoGrupo}
                            style={{ padding: "10px 20px", backgroundColor: "#00875a", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
                        >
                            ➕ Criar Novo Grupo nesta Escola
                        </button>
                    )}
                </div>

                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {gruposVisiveis.length === 0 ? (
                        <p style={{ color: "#5e6c84", fontStyle: "italic" }}>Nenhum grupo ou projeto instanciado para esta unidade escolar.</p>
                    ) : (
                        gruposVisiveis.map((grupo) => {
                            const totalIntegrantes = listaUsuarios.filter(
                                (aluno) => String(aluno.grupoId) === String(grupo.docId)
                            ).length;

                            return (
                                <GroupCard
                                    key={grupo.docId}
                                    docId={grupo.docId} 
                                    id={grupo.id} 
                                    nome={grupo.nome}
                                    integrantes={totalIntegrantes > 0 ? `${totalIntegrantes} estudante(s)` : "A definir"}
                                    progresso={grupo.progresso}
                                />
                            );
                        })
                    )}
                </div>

                {ehProfessor && (
                    <div style={{ marginTop: "60px", backgroundColor: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ marginBottom: "20px", color: "#172b4d" }}>⚙️ Alunos Vinculados ou Aguardando Liberação</h2>
                        
                        {usuariosFiltradosPorEscola.length === 0 ? (
                            <p style={{ color: "#777" }}>Nenhum estudante pendente ou cadastrado nesta escola.</p>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                                <thead>
                                    <tr style={{ textAlign: "left", borderBottom: "2px solid #eaeaea", color: "#5e6c84" }}>
                                        <th style={{ padding: "10px" }}>Nome</th>
                                        <th style={{ padding: "10px" }}>E-mail</th>
                                        <th style={{ padding: "10px" }}>Cargo Atual</th>
                                        <th style={{ padding: "10px" }}>Atribuir Grupo</th>
                                        <th style={{ padding: "10px" }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosFiltradosPorEscola.map((aluno) => {
                                        return (
                                            <tr key={aluno.uid} style={{ borderBottom: "1px solid #f4f5f7" }}>
                                                <td style={{ padding: "12px 10px", fontWeight: "500" }}>{aluno.nome}</td>
                                                <td style={{ padding: "12px 10px", color: "#5e6c84" }}>{aluno.email}</td>
                                                <td style={{ padding: "12px 10px" }}>
                                                    <span style={{ 
                                                        backgroundColor: aluno.perfil === "lider" ? "#e6fcff" : aluno.grupoId ? "#eae6ff" : "#ffebe6",
                                                        color: aluno.perfil === "lider" ? "#008da6" : aluno.grupoId ? "#403294" : "#bf2600",
                                                        padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold"
                                                    }}>
                                                        {aluno.perfil === "lider" ? "Líder Admin" : aluno.grupoId ? "Aluno" : "Aguardando Grupo"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px 10px" }}>
                                                    <select 
                                                        defaultValue={aluno.grupoId || ""}
                                                        id={`select-grupo-${aluno.uid}`}
                                                        style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                                                    >
                                                        <option value="">-- Sem Grupo / Bloqueado --</option>
                                                        {gruposVisiveis.map(g => (
                                                            <option key={g.docId} value={g.docId}>Grupo {g.id} - {g.nome}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ padding: "12px 10px", display: "flex", gap: "10px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                        <input 
                                                            type="checkbox" 
                                                            id={`check-lider-${aluno.uid}`} 
                                                            defaultChecked={aluno.perfil === "lider"}
                                                        />
                                                        <label htmlFor={`check-lider-${aluno.uid}`} style={{ fontSize: "0.9rem" }}>Líder</label>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            const gId = document.getElementById(`select-grupo-${aluno.uid}`).value;
                                                            const isLider = document.getElementById(`check-lider-${aluno.uid}`).checked;
                                                            atualizarAcessoAluno(aluno.uid, gId, isLider);
                                                        }}
                                                        style={{ padding: "6px 12px", backgroundColor: "#0052cc", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
                                                    >
                                                        Salvar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

            </div>
        </>
    );
}

export default Dashboard;
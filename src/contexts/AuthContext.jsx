import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { authService } from "../services/authService"; // <-- 1. Importamos o serviço de autenticação

// 1. Criamos o Contexto
const AuthContext = createContext({});

// 2. Criamos o Provedor (Provider) que vai envolver nosso App
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    // Função de logout que encapsula o serviço do Firebase
    const logout = async () => {
        try {
            await authService.deslogar(); // Dispara o signOut do Firebase
            // Nota: o setUsuario(null) vai acontecer de forma automática ali no listener onAuthStateChanged
        } catch (error) {
            console.error("Erro ao deslogar pelo contexto:", error);
        }
    };

    useEffect(() => {
        // Monitora o estado da autenticação do Firebase
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Se o usuário existe no Auth, buscamos o perfil dele (role) no Firestore
                    const userRef = doc(db, "usuarios", firebaseUser.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        // Combinamos os dados de autenticação com o perfil do banco
                        setUsuario({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                            ...docSnap.data() // traz 'perfil' (professor/aluno/lider) e 'grupoId'
                        });
                    } else {
                        // Caso o documento no Firestore ainda não tenha sido criado por algum motivo
                        setUsuario({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                            perfil: "aluno",
                            grupoId: null
                        });
                    }
                } catch (error) {
                    console.error("Erro ao buscar perfil do usuário:", error);
                    setUsuario(null);
                }
            } else {
                // Usuário deslogado
                setUsuario(null);
            }
            setCarregando(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        // <-- 2. Adicionamos a função 'logout' aqui no value para o Header e outras telas usarem
        <AuthContext.Provider value={{ usuario, logado: !!usuario, carregando, logout }}>
            {!carregando && children}
        </AuthContext.Provider>
    );
}

// 3. Hook personalizado para facilitar o uso nas telas
export function useAuth() {
    return useContext(AuthContext);
}
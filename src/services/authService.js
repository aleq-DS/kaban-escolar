import { auth, db } from "../firebase/firebaseConfig"; // Certifique-se de que o caminho do seu arquivo firebase.js está correto
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

// Busca o e-mail do professor definido no seu arquivo .env
// 1. Pega a string do .env, converte para minúsculas, separa por vírgula e remove espaços extras
const EMAILS_PROFESSORES = (import.meta.env.VITE_PROFESSOR_EMAIL || "")
    .toLowerCase()
    .split(",")
    .map(email => email.trim());

/**
 * Função auxiliar para criar/atualizar o perfil do usuário no Firestore
 * Garante a regra: se o e-mail for igual ao do .env, vira 'professor', senão vira 'aluno'
 */
const salvarPerfilNoFirestore = async (user, nomeCustomizado = null) => {
    const userRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(userRef);

    // Se o usuário já existe no banco, não sobrescrevemos (para não perder o cargo de líder, por exemplo)
    if (docSnap.exists()) {
        return docSnap.data();
    }

    const emailUser = user.email.toLowerCase();
    // Regra de segurança baseada no seu .env
    // 2. Agora checa se o e-mail do usuário está DENTRO da lista de professores
    const ehProfessor = EMAILS_PROFESSORES.includes(emailUser);

    const dadosPerfil = {
        uid: user.uid,
        nome: nomeCustomizado || user.displayName || "Estudante",
        email: user.email,
        perfil: ehProfessor ? "professor" : "aluno", // 'professor', 'aluno' ou 'lider'
        grupoId: null // O professor atribuirá isso depois para os alunos
    };

    await setDoc(userRef, dadosPerfil);
    return dadosPerfil;
};

export const authService = {
    // 1. Cadastro com E-mail e Senha
    cadastrarComEmail: async (nome, email, senha) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const perfil = await salvarPerfilNoFirestore(userCredential.user, nome);
            return { user: userCredential.user, perfil };
        } catch (error) {
            console.error("Erro no cadastro:", error);
            throw error;
        }
    },

    // 2. Login com E-mail e Senha
    loginComEmail: async (email, senha) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            // Busca o perfil do Firestore para sabermos a permissão dele
            const userRef = doc(db, "usuarios", userCredential.user.uid);
            const docSnap = await getDoc(userRef);
            return { user: userCredential.user, perfil: docSnap.data() };
        } catch (error) {
            console.error("Erro no login por e-mail:", error);
            throw error;
        }
    },

    // 3. Login / Cadastro rápido com o Google
    loginComGoogle: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const perfil = await salvarPerfilNoFirestore(result.user);
            return { user: result.user, perfil };
        } catch (error) {
            console.error("Erro no login com Google:", error);
            throw error;
        }
    },

    // 4. Logout
    deslogar: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erro ao deslogar:", error);
            throw error;
        }
    }
};
import { db } from "../firebase/firebaseConfig";
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    doc, 
    updateDoc 
} from "firebase/firestore";

// Nome da coleção no Firestore
const COLECAO_TAREFAS = "tarefas";

export const taskService = {
    // 1. Buscar todas as tarefas de um grupo específico no Firestore
    buscarPorGrupo: async (grupoId) => {
        try {
            const tarefasRef = collection(db, COLECAO_TAREFAS);
            
            // Criamos uma query para filtrar as tarefas onde o campo 'grupo' seja igual ao ID do grupo
            const q = query(tarefasRef, where("grupo", "==", Number(grupoId)));
            const querySnapshot = await getDocs(q);
            
            const tarefas = [];
            querySnapshot.forEach((doc) => {
                // Mapeamos os dados do documento e injetamos o ID gerado pelo Firebase nele
                tarefas.push({
                    id: doc.id, 
                    ...doc.data()
                });
            });
            
            return tarefas;
        } catch (error) {
            console.error("Erro ao buscar tarefas no Firestore:", error);
            throw error;
        }
    },

    // 2. Salvar uma nova tarefa na nuvem
    salvar: async (novaTarefa) => {
        try {
            const tarefasRef = collection(db, COLECAO_TAREFAS);
            
            // Removemos o 'id' temporário do objeto, pois o Firebase gerará o ID do documento
            const { id, ...dadosParaSalvar } = novaTarefa;
            
            // Adiciona o documento na coleção 'tarefas'
            const docRef = await addDoc(tarefasRef, dadosParaSalvar);
            
            // Retorna o objeto completo com o ID real gerado pela nuvem
            return {
                id: docRef.id,
                ...dadosParaSalvar
            };
        } catch (error) {
            console.error("Erro ao salvar tarefa no Firestore:", error);
            throw error;
        }
    },

    // 3. Atualizar uma tarefa existente (Status, Comentários do Professor, etc.)
    atualizar: async (tarefaId, dadosAtualizados) => {
        try {
            // Criamos a referência direta para o documento específico usando o ID dele
            const tarefaDocRef = doc(db, COLECAO_TAREFAS, tarefaId);
            
            // Atualiza apenas os campos que foram modificados (incluindo o histórico atualizado)
            await updateDoc(tarefaDocRef, dadosAtualizados);
            
            return {
                id: tarefaId,
                ...dadosAtualizados
            };
        } catch (error) {
            console.error("Erro ao atualizar tarefa no Firestore:", error);
            throw error;
        }
    }
};
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

const COLECAO_TAREFAS = "tarefas";

export const taskService = {
    // 1. Buscar tarefas aceitando tanto ID numérico quanto ID texto (String) das novas escolas
    buscarPorGrupo: async (grupoId) => {
        try {
            const tarefasRef = collection(db, COLECAO_TAREFAS);
            
            // Tentamos buscar como número E como string para não quebrar nenhum grupo legada
            const qString = query(tarefasRef, where("grupo", "==", String(grupoId)));
            const snapshotString = await getDocs(qString);
            
            const tarefas = [];
            snapshotString.forEach((doc) => {
                tarefas.push({ id: doc.id, ...doc.data() });
            });

            if (tarefas.length === 0 && !isNaN(grupoId)) {
                const qNum = query(tarefasRef, where("grupo", "==", Number(grupoId)));
                const snapshotNum = await getDocs(qNum);
                snapshotNum.forEach((doc) => {
                    tarefas.push({ id: doc.id, ...doc.data() });
                });
            }
            
            return tarefas;
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
            throw error;
        }
    },

    // 2. Salvar sem validações complexas (Criação limpa e leve)
    salvar: async (novaTarefa) => {
        try {
            const tarefasRef = collection(db, COLECAO_TAREFAS);
            const { id, ...dadosParaSalvar } = novaTarefa; // Remove o id temporário local
            
            const docRef = await addDoc(tarefasRef, dadosParaSalvar);
            
            // Retorna o ID REAL gerado pelo Firestore para o useKanban mapear certo na memória
            return {
                id: docRef.id,
                ...dadosParaSalvar
            };
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
            throw error;
        }
    },

    // 3. ONDE DEVE FICAR A VALIDAÇÃO: Na Atualização Técnica!
    atualizar: async (tarefaId, dadosAtualizados) => {
        // Ignora checagens pesadas se for apenas uma movimentação de arrastar rápida (opcional),
        // mas se os dados vierem do Modal, fazemos a validação rigorosa aqui:
        if (dadosAtualizados.responsavel !== undefined) {
            const resp = dadosAtualizados.responsavel?.trim() || "";
            if (!resp || resp.toLowerCase() === "a definir") {
                throw new Error("Membro executando precisa ser um nome válido.");
            }
        }

        if (dadosAtualizados.descricao !== undefined && !dadosAtualizados.descricao?.trim()) {
            throw new Error("A descrição do projeto/tarefa não pode ficar vazia.");
        }

        if (dadosAtualizados.dataEntrega !== undefined && !dadosAtualizados.dataEntrega) {
            throw new Error("O prazo de entrega é obrigatório.");
        }

        try {
            const tarefaDocRef = doc(db, COLECAO_TAREFAS, tarefaId);
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
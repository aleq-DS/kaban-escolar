import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Carrega as credenciais de forma segura a partir das variáveis de ambiente
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Se você estiver usando Create React App em vez de Vite, mude a leitura acima para:
// process.env.REACT_APP_FIREBASE_API_KEY, etc.

const app = initializeApp(firebaseConfig);

// Exporta a instância do banco de dados pronta para uso
export const db = getFirestore(app);
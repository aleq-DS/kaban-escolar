import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Login from "./pages/Login";

// Componente de proteção para rotas privadas
function RotaProtegida({ children }) {
    const { logado } = useAuth();
    
    // Se não estiver logado, chuta de volta para o login
    if (!logado) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

function App() {

    return (

        <BrowserRouter basename="/kanban-escolar">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<RotaProtegida> <Home /> </RotaProtegida>} />
                <Route path="/dashboard" element={<RotaProtegida> <Dashboard /> </RotaProtegida>} />
                <Route path="/kanban/:id" element={<RotaProtegida> <Kanban /> </RotaProtegida>} />
            </Routes>
        </BrowserRouter>

    );

}

export default App;
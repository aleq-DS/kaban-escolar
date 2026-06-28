import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/kanban/:id" element={<Kanban />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
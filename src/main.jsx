import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GerenciarReservas from './pages/GerenciarReservas.jsx';
import CadastrarHospedes from './pages/CadastrarHospedes.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastrarHospedes />} />
        <Route path="/gerenciar-reservas" element={<GerenciarReservas />} />
        <Route path="/cadastrar-hospedes" element={<CadastrarHospedes />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

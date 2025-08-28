import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GerenciarReservas from './pages/GerenciarReservas.jsx';
import CadastrarHospedes from './pages/CadastrarHospedes.jsx';
import QuartosOcupados from './pages/QuartosOcupados.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastrarHospedes />} />
        <Route path="/gerenciar-reservas" element={<GerenciarReservas />} />
          <Route path="/quartos-ocupados" element={<QuartosOcupados />} />
        <Route path="/cadastrar-hospedes" element={<CadastrarHospedes />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

// oii

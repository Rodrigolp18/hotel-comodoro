import './Navbar.css';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ titulo = "Gerenciar Reservas", mostrarInicio = true }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <h2 className="navbar__titulo">{titulo}</h2>
      <div className="navbar__logo">
        <img src="/logo-comodoro.png" alt="Logo Comodoro" className="logo" />
      </div>
      <div className="navbar__botoes">
        {mostrarInicio && (
          <button className="btn-vermelho" onClick={() => navigate('/cadastrar-hospedes')}>Início</button>
        )}
        <button className="btn-vermelho" onClick={() => navigate('/quartos-ocupados')}>Quartos</button>
      </div>
    </nav>
  );
}

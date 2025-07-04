import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar__titulo">Gerenciar Reservas</h2>
      <div className="navbar__logo">
        <img src="/logo-comodoro.png" alt="Logo Comodoro" className="logo" />
      </div>
      <div className="navbar__botoes">
        <button className="btn-vermelho">Início</button>
        <button className="btn-vermelho">Quartos</button>
      </div>
    </nav>
    
  );
}

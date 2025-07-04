import './CardQuarto.css';

export default function CardQuarto({ numero, descricao, selecionado, onClick }) {
  return (
    <div
      className={`card ${selecionado ? 'selecionado' : ''}`}
      onClick={onClick}
    >
      <div className="header-card">
        Quarto {numero}
      </div>
      <div className="body">
        {descricao}
      </div>
    </div>
  );
}

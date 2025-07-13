import './CardQuarto.css';
export default function CardQuarto({ numero, descricao, selecionado, onClick }) {
  const classeCard = `card ${selecionado ? 'selecionado' : ''}`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classeCard}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      aria-label={`Quarto ${numero}, ${descricao}`}
    >
      <div className="header-card">
        <strong>Quarto {numero}</strong>
      </div>
      <div className="body">
        <p>{descricao}</p>
      </div>
    </div>
  );
}

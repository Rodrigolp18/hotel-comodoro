import './ModalQuartos.css';
import CardQuarto from './CardQuarto';
import { useState } from 'react';

export default function ModalQuartos({ quartos, closeModal, onSelectQuarto }) {
  const [quartoSelecionado, setQuartoSelecionado] = useState(null);

  const handleSalvar = () => {
    if (quartoSelecionado) {
      onSelectQuarto(quartoSelecionado);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="header-modal">
          <p className="title-modal">Selecione um dos quartos disponíveis</p>
          <div className="button-container">
            <button className="button-modal" onClick={closeModal}>
              Cancelar
            </button>
            <button className="button-modal" onClick={handleSalvar} disabled={!quartoSelecionado}>
              Salvar seleção
            </button>
          </div>
        </div>
        <div className="body-modal">
          {quartos.map((quarto) => (
            <CardQuarto
              key={quarto.numero}
              numero={quarto.numero}
              descricao={quarto.descricao}
              selecionado={quartoSelecionado?.numero === quarto.numero}
              onClick={() => setQuartoSelecionado(quarto)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

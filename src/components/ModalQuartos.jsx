import './ModalQuartos.css';
import CardQuarto from './CardQuarto';
import { useState, useEffect } from 'react';

const gerarDescricao = (quarto) => {
  const partes = [];
  if (quarto['c.casal']) partes.push(`${quarto['c.casal']} Casal`);
  if (quarto['c.solteiro']) partes.push(`${quarto['c.solteiro']} Solteiro`);
  if (quarto['c.auxiliar']) partes.push(`${quarto['c.auxiliar']} Auxiliar`);
  if (quarto['vent.']) partes.push('Ventilador');
  return partes.join(', ');
};

export default function ModalQuartos({ closeModal, onSelectQuarto, reservasSalvas = [], dataEntrada, dataSaida }) {
  const [quartos, setQuartos] = useState([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState(null);

  useEffect(() => {
    async function carregarQuartos() {
      try {
        const res = await fetch('http://localhost:3000/quarto');
        const data = await res.json();
        const quartosFormatados = data.map((quarto) => ({
          numero: quarto.number,
          descricao: gerarDescricao(quarto),
          valor: quarto.valor,
          raw: quarto,
        }));
        setQuartos(quartosFormatados);
      } catch (err) {
        console.error('Erro ao carregar quartos:', err);
      }
    }

    carregarQuartos();
  }, []);

  const salvarSelecao = () => {
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
            <button type="button" className="button-modal" onClick={closeModal}>
              Cancelar
            </button>
            <button
              type="button"
              className="button-modal"
              onClick={salvarSelecao}
              disabled={!quartoSelecionado}
            >
              Salvar seleção
            </button>
          </div>
        </div>
        <div className="body-modal">
          {quartos.length > 0 ? (
            quartos.map((quarto) => {
              return (
                <CardQuarto
                  key={quarto.numero}
                  numero={quarto.numero}
                  descricao={quarto.descricao}
                  selecionado={quartoSelecionado?.numero === quarto.numero}
                  onClick={() => setQuartoSelecionado(quarto)}
                />
              );
            })
          ) : (
            <p>Carregando quartos...</p>
          )}
        </div>
      </div>
    </div>
  );
}

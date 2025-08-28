import './ModalQuartos.css';
import CardQuarto from './CardQuarto';
import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import { quartoEstaOcupado } from '../utils/reservaUtils';

export default function ModalQuartos({ closeModal, onSelectQuarto, reservasSalvas = [], dataEntrada, dataSaida }) {
  const [quartos, setQuartos] = useState([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState(null);

  useEffect(() => {
    const quartosRef = ref(db, 'quarto');
    const unsubscribe = onValue(quartosRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, obj]) => ({
            numero: obj.number,
            descricao: gerarDescricao(obj),
            valor: obj.valor,
            raw: obj,
          }))
        : [];
      setQuartos(lista);
    });
    return () => unsubscribe();
  }, []);

  const salvarSelecao = () => {
    if (quartoSelecionado) {
      onSelectQuarto(quartoSelecionado);
    }
  };

  // Verifica ocupação de cada quarto
  const quartosComStatus = quartos.map((quarto) => {
    const ocupado = quartoEstaOcupado(
      reservasSalvas,
      `Quarto ${quarto.numero}`,
      dataEntrada,
      dataSaida
    );
    return { ...quarto, ocupado };
  });

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
          {quartosComStatus.length > 0 ? (
            quartosComStatus.map((quarto) => (
              <div key={quarto.numero} style={{ position: 'relative' }}>
                <CardQuarto
                  numero={quarto.numero}
                  descricao={quarto.descricao}
                  selecionado={quartoSelecionado?.numero === quarto.numero}
                  onClick={
                    quarto.ocupado
                      ? undefined // Não permite clique
                      : () => setQuartoSelecionado(quarto)
                  }
                  tabIndex={quarto.ocupado ? -1 : 0}
                  aria-disabled={quarto.ocupado}
                  style={quarto.ocupado ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                />
                {quarto.ocupado && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(205,24,31,0.7)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      pointerEvents: 'none',
                    }}
                  >
                    Ocupado
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Carregando quartos...</p>
          )}
        </div>
      </div>
    </div>
  );
}

const gerarDescricao = (quarto) => {
  const partes = [];
  if (quarto['c_casal']) partes.push(`${quarto['c_casal']} Casal`);
  if (quarto['c_solteiro']) partes.push(`${quarto['c_solteiro']} Solteiro`);
  if (quarto['c_auxiliar']) partes.push(`${quarto['c_auxiliar']} Auxiliar`);
  if (quarto['vent_']) partes.push('Ventilador');
  return partes.join(', ');
};

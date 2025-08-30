import Navbar from '../components/Navbar';
import CardQuarto from '../components/CardQuarto';
import './GerenciarReservas.css';
import '../components/ModalQuartos.css';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import { getHojeISO, quartoEstaOcupado } from '../utils/reservaUtils';
import { Link } from 'react-router-dom';

export default function QuartosOcupados() {
  const [quartos, setQuartos] = useState([]);
  const [reservasSalvas, setReservasSalvas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(getHojeISO());

  useEffect(() => {
    const quartosRef = ref(db, 'quarto');
    const unsubQ = onValue(quartosRef, (snap) => {
      const data = snap.val();
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

    const reservasRef = ref(db, 'reservas');
    const unsubR = onValue(reservasRef, (snap) => {
      const data = snap.val();
      const lista = data ? Object.entries(data).map(([id, r]) => ({ id, ...r })) : [];
      setReservasSalvas(lista);
    });

    const clientesRef = ref(db, 'cliente');
    const unsubC = onValue(clientesRef, (snap) => {
      const data = snap.val();
      const lista = data ? Object.entries(data).map(([id, c]) => ({ id, ...c })) : [];
      setClientes(lista);
    });

    return () => {
      unsubQ();
      unsubR();
      unsubC();
    };
  }, []);

  const quartosComStatus = quartos.map((quarto) => {
    const quartoNome = `Quarto ${quarto.numero}`;
    const reservaDoDia = reservasSalvas.find(r => r.quartoSelecionado === quartoNome &&
      // sobrepõe o dia (entrada <= data <= saida)
      new Date(r.dataEntrada) <= new Date(dataSelecionada) && new Date(r.dataSaida) >= new Date(dataSelecionada)
    );
    const ocupado = !!reservaDoDia;
    const clienteNome = reservaDoDia ? (clientes.find(c => c.id === reservaDoDia.clienteId)?.name || '') : '';
    return { ...quarto, ocupado, clienteNome };
  });

  return (
    <div>
      <Navbar />
      <div className="gerenciar-reservas-main">
        <div className="gerenciar-reservas-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Quartos ocupados</h2>
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>
          <div className="nova-reserva-container gerenciar-reservas-nova-reserva">
            <Link to="/gerenciar-reservas">
              <button className="btn-nova-reserva">Voltar</button>
            </Link>
          </div>
        </div>

        <div className="body-modal" style={{ padding: '1.5rem' }}>
          {quartosComStatus.length > 0 ? (
            <div className="quartos-grid">
              {quartosComStatus.map((quarto) => (
                <div key={quarto.numero} style={{ position: 'relative' }}>
                  <CardQuarto
                    numero={quarto.numero}
                    descricao={quarto.ocupado ? quarto.clienteNome : quarto.descricao}
                    selecionado={false}
                    onClick={undefined}
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
              ))}
            </div>
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

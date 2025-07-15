import Navbar from "../components/Navbar";
import Reservas from "../components/Reservas";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from '../firebase/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import { getHojeISO, atualizarReservaFirebase } from '../utils/reservaUtils';
import ReservaSalva from '../components/ReservaSalva';
import './GerenciarReservas.css';

export default function GerenciarReservas() {
    const [criandoReserva, setCriandoReserva] = useState(false);
    const [reservasSalvas, setReservasSalvas] = useState([]);
    const [abertos, setAbertos] = useState({});
    const [clientes, setClientes] = useState([]);
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const clienteId = params.get('clienteId');
    const cliente = clientes.find(c => c.id === clienteId);

    useEffect(() => {
        fetch('/src/mockdata/db.json')
          .then(res => res.json())
          .then(data => setClientes(data.cliente || []));

        const unsub = onValue(ref(db, 'reservas'), (snap) => {
            const data = snap.val();
            if (data) {
                let lista = Object.entries(data).map(([id, r]) => ({ id, ...r }));
                if (clienteId) {
                  lista = lista.filter(r => r.clienteId === clienteId);
                }
                setReservasSalvas(lista.reverse());
            } else {
                setReservasSalvas([]);
            }
        });
        return () => unsub();
    }, [clienteId]);

    const alternarAberto = (id) => setAbertos((prev) => ({ ...prev, [id]: !prev[id] }));

    const salvarAlteracao = async (id, atualizada) => {
        const result = await atualizarReservaFirebase({ id, atualizada, reservasSalvas });
        if (result.ok) {
            alert(result.mensagem);
        } else {
            alert(result.mensagem);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="gerenciar-reservas-main">
                <div className="gerenciar-reservas-header">
                  {cliente && (
                    <div className="gerenciar-reservas-nome">
                      <span>{cliente.name}</span>
                      <span className="gerenciar-reservas-cpf">CPF: {cliente.CPF}</span>
                    </div>
                  )}
                  <div className="nova-reserva-container gerenciar-reservas-nova-reserva">
                    <button className="btn-nova-reserva" onClick={() => setCriandoReserva(true)}>
                      Nova Reserva +
                    </button>
                  </div>
                </div>
                <div className="reserva-wrapper">
                  {criandoReserva && <Reservas reservasSalvas={reservasSalvas} onCancelarCriacao={() => setCriandoReserva(false)} clienteId={clienteId} />}
                  {reservasSalvas.length > 0 && (
                      <div>
                          {reservasSalvas.map((res) => (
                              <ReservaSalva
                                  key={res.id}
                                  res={res}
                                  aberto={abertos[res.id]}
                                  alternarAberto={alternarAberto}
                                  salvarAlteracao={salvarAlteracao}
                                  reservasSalvas={reservasSalvas}
                              />
                          ))}
                      </div>
                  )}
                </div>
            </div>
        </div>
    )
}

import Navbar from '../components/Navbar';
import HospedeCard from '../components/HospedeCard';
import { useState, useEffect } from 'react';
import './GerenciarReservas.css';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase/firebaseconfig'; // Usa a instância correta do Database

export default function CadastrarHospedes() {
  const [hospedes, setHospedes] = useState([]);
  const [criandoHospede, setCriandoHospede] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const hospedesRef = ref(db, 'cliente');
    const unsubscribe = onValue(hospedesRef, (snapshot) => {
      const data = snapshot.val();
      // Converte objeto para array
      const lista = data ? Object.entries(data).map(([id, obj]) => ({ ...obj, id })) : [];
  setHospedes(lista);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (index, campo, valor) => {
    setHospedes(hospedes => {
      const novo = [...hospedes];
      novo[index] = { ...novo[index], [campo]: valor };
      return novo;
    });
  };

  // Função para adicionar novo hóspede no Realtime Database
  const handleAddHospede = async (novoHospede) => {
    const hospedesRef = ref(db, 'cliente');
    const novoRef = push(hospedesRef);
    await novoRef.set(novoHospede);
    setCriandoHospede(false);
  };

  const handleSave = (index, hospedeAtualizado) => {
    setHospedes(hospedes => {
      const novo = [...hospedes];
      novo[index] = hospedeAtualizado;
      return novo;
    });
  };

  function normalizar(str) {
    return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }
  const buscaNormalizada = normalizar(busca);
  const hospedesFiltrados = hospedes
    .slice()
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
    .filter(h =>
      normalizar(h.name).includes(buscaNormalizada) ||
      normalizar(h.CPF).includes(buscaNormalizada)
    );

  return (
    <div>
      <Navbar titulo="Cadastro de Hóspedes" mostrarInicio={false} />
      <div style={{ padding: '2rem', paddingTop: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div className="nova-reserva-container gerenciar-reservas-nova-reserva">
            <button className="btn-nova-reserva" onClick={() => setCriandoHospede(true)}>
              Cadastrar +
            </button>
          </div>
          <div className="frigobar-pesquisa" style={{ width: '300px' }}>
            <input
              type="text"
              placeholder="Pesquisar hóspede por nome ou CPF"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            <span className="icone-busca">🔍</span>
          </div>
        </div>
        {criandoHospede && (
          <HospedeCard
            hospede={{ name: '', CPF: '', birth: '', phone: '', car: '', address: '', observations: '' }}
            onChange={() => {}}
            onSave={novoHospede => handleAddHospede(novoHospede)}
            onClose={() => setCriandoHospede(false)}
            initialOpen={true}
            initialEdit={true}
            cadastro={true}
          />
        )}
        {hospedesFiltrados.map((hospede, idx) => (
          <HospedeCard
            key={hospede.id}
            hospede={hospede}
            onChange={(campo, valor) => handleChange(idx, campo, valor)}
            onSave={hospedeAtualizado => handleSave(idx, hospedeAtualizado)}
          />
        ))}
      </div>
    </div>
  );
}

import Navbar from '../components/Navbar';
import HospedeCard from '../components/HospedeCard';
import { useState, useEffect } from 'react';

export default function CadastrarHospedes() {
  const [hospedes, setHospedes] = useState([]);

  useEffect(() => {
    fetch('/src/mockdata/db.json')
      .then(res => res.json())
      .then(data => setHospedes(data.cliente || []));
  }, []);

  const handleChange = (index, campo, valor) => {
    setHospedes(hospedes => {
      const novo = [...hospedes];
      novo[index] = { ...novo[index], [campo]: valor };
      return novo;
    });
  };

  const handleSave = (index, hospedeAtualizado) => {
    setHospedes(hospedes => {
      const novo = [...hospedes];
      novo[index] = hospedeAtualizado;
      return novo;
    });
  };

  return (
    <div>
      <Navbar titulo="Cadastro de Hóspedes" mostrarInicio={false} />
      <div style={{ padding: '2rem', paddingTop: '6rem' }}>
        {hospedes.map((hospede, idx) => (
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

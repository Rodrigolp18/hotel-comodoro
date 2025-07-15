import './HospedeCard.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HospedeCard({ hospede, onChange }) {
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [localHospede, setLocalHospede] = useState(hospede);
  const navigate = useNavigate();

  const handleFieldChange = (campo, valor) => {
    setLocalHospede(h => ({ ...h, [campo]: valor }));
    onChange?.(campo, valor);
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:3000/cliente/${localHospede.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localHospede)
      });
      setEditando(false);
      alert('Dados salvos com sucesso!');
    } catch (err) {
      alert('Erro ao salvar!');
    }
  };

  return (
    <div className={`reserva-wrapper${aberto ? ' aberto' : ''}`}>
      <div className="reserva-header hospede-header" onClick={() => setAberto(a => !a)}>
        <span className="hospede-header__name">{localHospede.name}</span>
        <span className="hospede-header__cpf">CPF: {localHospede.CPF}</span>
        <button className="hospede-header__btn" onClick={e => { e.stopPropagation(); navigate(`/gerenciar-reservas?clienteId=${localHospede.id}`); }}>Gerenciar Reservas</button>
        <span className={`hospede-header__arrow${aberto ? ' aberto' : ''}`}>▼</span>
      </div>
      {aberto && (
        <div className="reserva-container" style={{ position: 'relative', paddingBottom: '3rem' }}>
          <div className="hospede-formulario-duas-colunas">
            <div className="hospede-coluna-esquerda">
              <div className="reserva-row">
                <label className='required'>Data de Nascimento:</label>
                <input type="date" value={localHospede.birth} onChange={e => handleFieldChange('birth', e.target.value)} disabled={!editando} />
              </div>
              <div className="reserva-row">
                <label className='required'>Telefone:</label>
                <input type="tel" pattern="[0-9]*" inputMode="numeric" value={localHospede.phone} onChange={e => handleFieldChange('phone', e.target.value.replace(/\D/g, ''))} disabled={!editando} />
              </div>
              <div className="reserva-row">
                <label>Placa do Automóvel:</label>
                <input type="text" value={localHospede.car} onChange={e => handleFieldChange('car', e.target.value)} disabled={!editando} />
              </div>
            </div>
            <div className="hospede-coluna-direita">
              <div className="reserva-row">
                <label className='required'>Endereço:</label>
                <input type="text" value={localHospede.address} onChange={e => handleFieldChange('address', e.target.value)} disabled={!editando} />
              </div>
              <div className="reserva-row">
                <label>Observações:</label>
                <textarea className="hospede-observacoes" value={localHospede.observations} onChange={e => handleFieldChange('observations', e.target.value)} rows={4} disabled={!editando} />
              </div>
            </div>
          </div>
          {editando ? (
            <button className="hospede-editar-btn" onClick={handleSave}>Salvar</button>
          ) : (
            <button className="hospede-editar-btn" onClick={() => setEditando(true)}>Editar</button>
          )}
        </div>
      )}
    </div>
  );
}

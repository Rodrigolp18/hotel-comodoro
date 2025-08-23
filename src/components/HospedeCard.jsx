import './HospedeCard.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HospedeCard({ hospede, onChange, initialOpen = false, initialEdit = false, cadastro = false, onClose }) {
  const [aberto, setAberto] = useState(initialOpen);
  const [editando, setEditando] = useState(initialEdit);
  const [localHospede, setLocalHospede] = useState(hospede);
  const navigate = useNavigate();

  const handleFieldChange = (campo, valor) => {
    setLocalHospede(h => ({ ...h, [campo]: valor }));
    onChange?.(campo, valor);
  };

  const handleSave = async () => {
    // Validação dos campos obrigatórios
    const obrigatorios = [
      { campo: 'name', label: 'Nome' },
      { campo: 'CPF', label: 'CPF' },
      { campo: 'birth', label: 'Data de Nascimento' },
      { campo: 'phone', label: 'Telefone' },
      { campo: 'address', label: 'Endereço' }
    ];
    const faltando = obrigatorios.filter(f => !localHospede[f.campo]?.trim());
    if (faltando.length > 0) {
      alert('Preencha os campos obrigatórios: ' + faltando.map(f => f.label).join(', '));
      return;
    }
    try {
      if (cadastro) {
        // Cadastro: POST para criar novo hóspede
        const response = await fetch('http://localhost:3000/cliente/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...localHospede, id: Date.now().toString() })
        });
        if (!response.ok) throw new Error('Erro ao cadastrar!');
        alert('Hóspede cadastrado com sucesso!');
        if (onClose) onClose();
      } else {
        // Edição: PATCH para atualizar hóspede existente
        await fetch(`http://localhost:3000/cliente/${localHospede.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localHospede)
        });
        alert('Dados salvos com sucesso!');
      }
      setEditando(false);
    } catch (err) {
      alert('Erro ao salvar!');
    }
  };

  return (
    <div className={`reserva-wrapper${aberto ? ' aberto' : ''}`}>
      <div className="reserva-header hospede-header" style={cadastro ? { cursor: 'default' } : {}}>
        {cadastro ? (
          <div style={{ display: 'flex', width: '100%', alignItems: 'center', position: 'relative' }}>
            <div className="reserva-row" style={{ marginRight: '1rem', marginBottom: 0, flex: 1 }}>
              <label className='required' style={{ marginBottom: 0 }}>Nome:</label>
              <input
                type="text"
                value={localHospede.name}
                onChange={e => handleFieldChange('name', e.target.value)}
                disabled={!editando}
                style={{ width: '220px' }}
              />
            </div>
            <div className="reserva-row" style={{ marginBottom: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', minWidth: '220px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <label className='required' style={{ marginBottom: 0, marginRight: '8px' }}>CPF:</label>
              <input
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                value={localHospede.CPF}
                onChange={e => handleFieldChange('CPF', e.target.value.replace(/\D/g, ''))}
                disabled={!editando}
                style={{ width: '180px', textAlign: 'center' }}
              />
            </div>
          </div>
        ) : (
          <>
            <span className="hospede-header__name">{localHospede.name}</span>
            <span className="hospede-header__cpf">CPF: {localHospede.CPF}</span>
            <button className="hospede-header__btn" onClick={e => { e.stopPropagation(); navigate(`/gerenciar-reservas?clienteId=${localHospede.id}`); }}>Gerenciar Reservas</button>
            <span className={`hospede-header__arrow${aberto ? ' aberto' : ''}`} onClick={() => setAberto(a => !a)}>▼</span>
          </>
        )}
      </div>
      {(aberto || cadastro) && (
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              {cadastro && (
                <button className="hospede-editar-btn" style={{ left: '40%' }} onClick={() => onClose && onClose()}>Cancelar</button>
              )}
              <button className="hospede-editar-btn" onClick={handleSave}>Salvar</button>
            </div>
          ) : (
            <button className="hospede-editar-btn" onClick={() => setEditando(true)}>Editar</button>
          )}
        </div>
      )}
    </div>
  );
}

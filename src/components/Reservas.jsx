import React, { useState } from 'react';
import './Reservas.css';
import ModalQuartos from './ModalQuartos';

const Reservas = () => {
  const [quartoSelecionado, setQuartoSelecionado] = useState('');
  const [valorDiaria, setValorDiaria] = useState('');
  const [cupom, setCupom] = useState('');
  const [valorComDesconto, setValorComDesconto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [horaSaida, setHoraSaida] = useState('');

  const [modalAberto, setModalAberto] = useState(false);

  const quartos = [
    { numero: 201, descricao: '1 Solteiro, 1 Auxiliar' },
    { numero: 202, descricao: '2 Solteiro' },
    { numero: 203, descricao: '1 Casal, 1 Auxiliar' },
    { numero: 204, descricao: '1 Casal, 1 Solteiro, 1 Auxiliar' },
    { numero: 205, descricao: '1 Casal, 1 Solteiro' },
    { numero: 206, descricao: '1 Casal, 1 Auxiliar' },
  ];

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  const selecionarQuarto = (quarto) => {
    setQuartoSelecionado(`Quarto ${quarto.numero}`);
    fecharModal();
  };

  const aplicarDesconto = () => {
    if (cupom === 'DESC10') {
      const valor = parseFloat(valorDiaria);
      const comDesconto = valor - valor * 0.1;
      setValorComDesconto(comDesconto.toFixed(2));
    } else {
      setValorComDesconto(valorDiaria);
    }
  };

  const salvarReserva = () => {
    alert('Reserva salva!');
  };

  const cancelarReserva = () => {
    setQuartoSelecionado('');
    setValorDiaria('');
    setCupom('');
    setValorComDesconto('');
    setFormaPagamento('');
    setDataEntrada('');
    setHoraEntrada('');
    setDataSaida('');
    setHoraSaida('');
  };

  return (
   <div className="reserva-container">
      <div className="reserva-row">
        <div className="reserva-quarto">
          <label className="required">Quarto</label>
          <input
            type="text"
            value={quartoSelecionado}
            readOnly
            placeholder="Quarto Selecionado"
          />
        </div>
        <div className="reserva-label">
          <label>&nbsp;</label>
          <button
            className="reserva-botao-selecionar"
            onClick={abrirModal}
          >
            Selecionar
          </button>
        </div>
      </div>

      {modalAberto && (
        <ModalQuartos 
        quartos={quartos} 
        closeModal={fecharModal} 
        onSelectQuarto={selecionarQuarto} />
      )}

      <div className="reserva-row">
        <div className="reserva-valor-diaria reserva-label">
          <label className="required">Valor da Diária</label>
          <input
            type="number"
            value={valorDiaria}
            onChange={(e) => setValorDiaria(e.target.value)}
          />
        </div>

        <div className="reserva-cupom">
          <label>Cupom de Desconto</label>
          <div className="reserva-cupom-row">
            <input
              type="text"
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
            />
            <button onClick={aplicarDesconto}>Aplicar</button>
          </div>
        </div>
      </div>

      {valorComDesconto && (
        <div className="reserva-desconto">
          Valor com desconto: R$ {valorComDesconto}
        </div>
      )}

      <div className="reserva-pagamento reserva-label">
        <label className="required">Forma de Pagamento</label>
        <details>
          <summary>{formaPagamento || 'Selecionar'}</summary>
          <ul>
            {['crédito', 'débito', 'dinheiro', 'PIX'].map((forma) => (
              <li key={forma}>
                <button type="button" onClick={() => setFormaPagamento(forma)}>
                  {forma}
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="reserva-row">
        <div className="reserva-data-entrada">
          <label className="required">Data de Entrada</label>
          <input
            type="date"
            value={dataEntrada}
            onChange={(e) => setDataEntrada(e.target.value)}
          />
        </div>
        <div className="reserva-checkin">
          <label>Check-in</label>
          <input
            type="time"
            value={horaEntrada}
            onChange={(e) => setHoraEntrada(e.target.value)}
          />
        </div>
      </div>

      <div className="reserva-row">
        <div className="reserva-data-saida">
          <label className="required">Data de Saída</label>
          <input
            type="date"
            value={dataSaida}
            onChange={(e) => setDataSaida(e.target.value)}
          />
        </div>
        <div className="reserva-checkout">
          <label className="required">Check-out</label>
          <input
            type="time"
            value={horaSaida}
            onChange={(e) => setHoraSaida(e.target.value)}
          />
        </div>
      </div>

      <div className="reserva-botoes">
        <button onClick={cancelarReserva}>Cancelar</button>
        <button onClick={salvarReserva}>Salvar Reserva</button>
      </div>
    </div>
  );
};

export default Reservas;

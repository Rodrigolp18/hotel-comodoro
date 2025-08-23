import { useState } from 'react';
import './Reservas.css';
import Frigobar from './Frigobar';
import ModalQuartos from './ModalQuartos';
import {
  aplicarCupomDesconto,
  formasPagamento,
  reservaInicial,
  formatarData,
  calcularDiasEntreDatas,
  getHojeISO,
  quartoEstaOcupado,
  validarDatasReserva,
} from '../utils/reservaUtils';
import { db } from '../firebase/firebaseconfig';
import { ref, push, set } from 'firebase/database';

const Campo = ({ valor, tipo = 'text', onChange, readOnly, min }) => (
  <input
    type={tipo}
    value={valor}
    readOnly={readOnly}
    min={min}
    onChange={(e) => onChange?.(e.target.value)}
  />
);

const SeletorPagamento = ({ valor, editando, onSelecionar }) =>
  editando ? (
    <select
      className="select-forma-pagamento"
      value={valor}
      onChange={e => onSelecionar(e.target.value)}
    >
      <option value="">Selecionar</option>
      {formasPagamento.map((forma) => (
        <option key={forma} value={forma}>{forma}</option>
      ))}
    </select>
  ) : (
    <Campo valor={valor} readOnly />
  );

const Reservas = ({ reservasSalvas = [], onCancelarCriacao, clienteId }) => {
  const [reserva, setReserva] = useState(reservaInicial);
  const [modalAberto, setModalAberto] = useState(false);

  const hojeISO = getHojeISO();

  const atualizar = (campo, valor) => setReserva((prev) => ({ ...prev, [campo]: valor }));
  const cancelarReserva = () => {
    setReserva(reservaInicial);
    if (typeof onCancelarCriacao === 'function') {
      onCancelarCriacao();
    }
  };

  const aplicarDesconto = () => {
    const { valorDescontado, mensagem } = aplicarCupomDesconto(reserva.valorDiaria, reserva.cupom);
    atualizar('valorComDesconto', valorDescontado === reserva.valorDiaria ? '' : valorDescontado);
    alert(mensagem);
  };

  const selecionarQuarto = ({ numero, valor }) => {
    setReserva({
      ...reserva,
      quartoSelecionado: `Quarto ${numero}`,
      valorDiaria: valor,
      valorComDesconto: '',
      cupom: '',
    });
    setModalAberto(false);
  };

  const salvarReserva = async () => {
    const {
      quartoSelecionado,
      valorDiaria,
      formaPagamento,
      dataEntrada,
      dataSaida,
    } = reserva;

    if (!quartoSelecionado || !valorDiaria || !formaPagamento || !dataEntrada || !dataSaida) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const { valido, mensagem } = validarDatasReserva(dataEntrada, dataSaida);
    if (!valido) {
      alert(mensagem);
      return;
    }

    const quartoOcupado = quartoEstaOcupado(reservasSalvas, quartoSelecionado, dataEntrada, dataSaida);
    if (quartoOcupado) {
      alert('Este quarto já está reservado para o período selecionado.');
      return;
    }

    const novaReserva = {
      ...reserva,
      valorComDesconto: reserva.valorComDesconto || reserva.valorDiaria,
      criadaEm: new Date().toISOString(),
      clienteId: clienteId || null,
    };

    try {
      const novaRef = push(ref(db, 'reservas'));
      await set(novaRef, novaReserva);
      alert('Reserva salva com sucesso!');
      cancelarReserva();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  const campo = (nome, tipo = 'text') => {
    let min;
    if (tipo === 'date') {
      if (nome === 'dataEntrada') min = hojeISO;
      if (nome === 'dataSaida') min = reserva.dataEntrada || hojeISO;
    }
    return (
      <Campo
        tipo={tipo}
        valor={reserva[nome]}
        onChange={(v) => atualizar(nome, v)}
        min={min}
      />
    );
  };

  const dias = calcularDiasEntreDatas(reserva.dataEntrada, reserva.dataSaida);
  const valorBase = reserva.valorComDesconto || reserva.valorDiaria || 0;
  const valorDiarias = dias * parseFloat(valorBase || 0);
  const valorFrigobar = reserva.consumoFrigobar?.reduce((total, item) => total + item.total, 0) || 0;
  const valorTotal = valorDiarias + valorFrigobar;

  return (
    <div>
      <div className="reserva-wrapper">
        <div className="reserva-header">
          <span className="reserva-header__data">Data: {formatarData(reserva.dataEntrada)}</span>
          <strong className="reserva-header__status">Criando Reserva</strong>
          <span></span>
        </div>

        <div className="reserva-collapse aberto">
          <div className="reserva-container reserva-com-frigobar">
            <div className="reserva-formulario">
              {/* 1. Data de entrada e saída no topo */}
              <div className="reserva-row">
                <div className="reserva-data-entrada">
                  <label className="required">Data de Entrada</label>
                  {campo('dataEntrada', 'date')}
                </div>
                <div className="reserva-checkin">
                  <label>Check-in</label>
                  {campo('horaEntrada', 'time')}
                </div>
                <div className="reserva-data-saida">
                  <label className="required">Data de Saída</label>
                  {campo('dataSaida', 'date')}
                </div>
                <div className="reserva-checkout">
                  <label>Check-out</label>
                  {campo('horaSaida', 'time')}
                </div>
              </div>

              {/* 2. Seleção de quarto abaixo das datas */}
              <div className="reserva-row">
                <div className="reserva-quarto">
                  <label className="required">Quarto</label>
                  {campo('quartoSelecionado')}
                </div>
                <div className="reserva-label">
                  <label>&nbsp;</label>
                  <button className="reserva-botao-selecionar" onClick={() => setModalAberto(true)}>
                    Selecionar
                  </button>
                </div>
              </div>

              {modalAberto && (
                <ModalQuartos
                  closeModal={() => setModalAberto(false)}
                  onSelectQuarto={selecionarQuarto}
                  reservasSalvas={reservasSalvas}
                  dataEntrada={reserva.dataEntrada}
                  dataSaida={reserva.dataSaida}
                />
              )}

              <div className="reserva-row">
                <div className="reserva-valor-diaria reserva-label">
                  <label className="required">Valor da Diária</label>
                  {campo('valorDiaria')}
                </div>
                <div className="reserva-cupom">
                  <label>Cupom de Desconto</label>
                  <div className="reserva-cupom-row">
                    <Campo valor={reserva.cupom} onChange={(v) => atualizar('cupom', v)} />
                    <button onClick={aplicarDesconto} disabled={!reserva.cupom.trim()}>
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>

              {reserva.valorComDesconto && (
                <div className="reserva-desconto">Valor com desconto: R$ {reserva.valorComDesconto}</div>
              )}

              <div className="reserva-pagamento reserva-label">
                <label className="required">Forma de Pagamento</label>
                <SeletorPagamento
                  valor={reserva.formaPagamento}
                  editando
                  onSelecionar={(v) => atualizar('formaPagamento', v)}
                />
              </div>

              <div className="reserva-botoes">
                <button onClick={cancelarReserva}>Cancelar</button>
                <button onClick={salvarReserva}>Salvar Reserva</button>
              </div>
            </div>

            <div>
              <Frigobar
                consumo={reserva.consumoFrigobar}
                setConsumo={(lista) => atualizar('consumoFrigobar', lista)}
              />

              <div className="reserva-total">
                <strong>Valor total da reserva:</strong> R$ {valorTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;

import { useState, useEffect } from 'react';
import './Reservas.css';
import Frigobar from './Frigobar';
import ModalQuartos from './ModalQuartos';
import {
    aplicarCupomDesconto,
    formasPagamento,
    formatarData,
    calcularTotaisReserva,
    getHojeISO,
    atualizarReservaFirebase,
} from '../utils/reservaUtils';

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

const ReservaSalva = ({ res, aberto, alternarAberto, salvarAlteracao, reservasSalvas }) => {
    const [editando, setEditando] = useState(false);
    const [reservaEditada, setReservaEditada] = useState(res);
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
      if (!editando) {
        setReservaEditada(res);
      }
    }, [res, editando]);
    const selecionarQuarto = ({ numero, valor }) => {
        setReservaEditada((prev) => ({
            ...prev,
            quartoSelecionado: `Quarto ${numero}`,
            valorDiaria: valor,
            valorComDesconto: '',
            cupom: '',
        }));
        setModalAberto(false);
    };
    const hojeISO = getHojeISO();
    const isEditavel = res.dataSaida >= hojeISO;

    const atualizar = (campo, valor) => {
        const nova = { ...reservaEditada, [campo]: valor };
        if (campo === 'cupom') {
            nova.valorComDesconto = calcularDesconto(nova.valorDiaria, valor);
        }
        setReservaEditada(nova);
    };

    const campo = (nome, tipo = 'text') => {
        let min;
        if (tipo === 'date') {
            if (nome === 'dataEntrada') min = hojeISO;
            if (nome === 'dataSaida') min = reservaEditada.dataEntrada || hojeISO;
        }
        return (
            <Campo
                tipo={tipo}
                valor={editando ? reservaEditada[nome] : res[nome]}
                onChange={editando && isEditavel ? (v) => atualizar(nome, v) : undefined}
                readOnly={!editando || !isEditavel}
                min={min}
            />
        );
    };

    const reservaParaCalculo = editando ? reservaEditada : res;
    const valorComDesconto = reservaParaCalculo.valorComDesconto;
    const valorDiariaAtual = reservaParaCalculo.valorDiaria;
    const { dias, valorBase, valorDiarias, valorFrigobar, valorTotal } = calcularTotaisReserva(reservaParaCalculo);
    const consumo = reservaParaCalculo.consumoFrigobar || [];

    return (
        <div className="reserva-wrapper">
            <div className="reserva-header" onClick={() => alternarAberto(res.id)}>
                <span className="reserva-header__data">Data: {formatarData(res.dataEntrada)}</span>
                <strong className="reserva-header__status">{isEditavel ? 'Reserva Ativa' : 'Reserva Fechada'}</strong>
                <span className={`seta${aberto ? ' aberta' : ''}`}>&#x25BC;</span>
            </div>

            <div className={`reserva-collapse${aberto ? ' aberto' : ''}`}>
                <div className="reserva-container reserva-com-frigobar">
                    <div className="reserva-formulario">
                        <div className="reserva-row">
                            <div className="reserva-quarto">
                                <label className="required">Quarto</label>
                                {campo('quartoSelecionado')}
                            </div>
                            {editando && isEditavel && (
                                <div className="reserva-label">
                                    <label>&nbsp;</label>
                                    <button className="reserva-botao-selecionar" onClick={() => setModalAberto(true)}>
                                        Selecionar
                                    </button>
                                </div>
                            )}
                        </div>
                        {modalAberto && (
                            <ModalQuartos closeModal={() => setModalAberto(false)} onSelectQuarto={selecionarQuarto} />
                        )}

                        <div className="reserva-row">
                            <div className="reserva-valor-diaria reserva-label">
                                <label className="required">Valor da Diária</label>
                                {campo('valorDiaria')}
                            </div>
                            <div className="reserva-cupom">
                                <label>Cupom de Desconto</label>
                                {editando ? (
                                    <div className="reserva-cupom-row">
                                        <Campo valor={reservaEditada.cupom || ''} onChange={(v) => atualizar('cupom', v)} />
                                        <button
                                            onClick={() => {
                                                const { valorDescontado } = aplicarCupomDesconto(reservaEditada.valorDiaria, reservaEditada.cupom);
                                                atualizar('valorComDesconto', valorDescontado === reservaEditada.valorDiaria ? '' : valorDescontado);                                            }}
                                            disabled={!reservaEditada.cupom?.trim()}
                                        >
                                            Aplicar
                                        </button>
                                    </div>
                                ) : (
                                    campo('cupom')
                                )}
                            </div>
                        </div>

                        {(res.cupom && valorComDesconto && valorComDesconto !== valorDiariaAtual) && (
                            <div className="reserva-desconto">Valor com desconto: R$ {valorComDesconto}</div>
                        )}

                        <div className="reserva-pagamento reserva-label">
                            <label className="required">Forma de Pagamento</label>
                            <SeletorPagamento
                                valor={editando ? reservaEditada.formaPagamento : res.formaPagamento}
                                editando={editando}
                                onSelecionar={(v) => atualizar('formaPagamento', v)}
                            />
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-data-entrada">
                                <label className="required">Data de Entrada</label>
                                {campo('dataEntrada', 'date')}
                            </div>
                            <div className="reserva-checkin">
                                <label>Check-in</label>
                                {campo('horaEntrada', 'time')}
                            </div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-data-saida">
                                <label className="required">Data de Saída</label>
                                {campo('dataSaida', 'date')}
                            </div>
                            <div className="reserva-checkout">
                                <label>Check-out</label>
                                {campo('horaSaida', 'time')}
                            </div>
                        </div>

                        <div className="reserva-botoes">
                            {editando ? (
                                <>
                                    <button onClick={() => {
                                        setEditando(false);
                                        setReservaEditada(res);
                                    }}>Cancelar</button>
                                    <button onClick={async () => {
                                        const result = await atualizarReservaFirebase({ id: res.id, atualizada: reservaEditada, reservasSalvas });
                                        if (result.ok) {
                                            salvarAlteracao(res.id, reservaEditada);
                                            setEditando(false);
                                        } else {
                                            alert(result.mensagem);
                                        }
                                    }}>
                                        Salvar Alterações
                                    </button>
                                </>
                            ) : (
                                isEditavel ? (
                                    <button onClick={() => setEditando(true)}>Editar</button>
                                ) : (
                                    <span className="reserva-nao-editavel">
                                        Não editável (reserva já finalizada)<br />
                                        Criada em: {new Date(res.criadaEm).toLocaleString('pt-BR')}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                    <div>
                        <Frigobar consumo={consumo} setConsumo={editando ? (lista) => atualizar('consumoFrigobar', lista) : () => { }} />
                        <div className="reserva-total">
                            <strong>Valor total da reserva:</strong> R$ {valorTotal.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservaSalva;

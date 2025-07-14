export function calcularTotaisReserva(reserva) {
  const dias = calcularDiasEntreDatas(reserva.dataEntrada, reserva.dataSaida);
  const valorBase = parseFloat(reserva.valorComDesconto || reserva.valorDiaria || 0);
  const valorDiarias = dias * valorBase;
  const consumo = reserva.consumoFrigobar || [];
  const valorFrigobar = consumo.reduce((acc, item) => acc + (item.total || 0), 0);
  const valorTotal = valorDiarias + valorFrigobar;
  return { dias, valorBase, valorDiarias, valorFrigobar, valorTotal };
}

export async function atualizarReservaFirebase({ id, atualizada, reservasSalvas }) {
  const entradaStr = atualizada.dataEntrada;
  const saidaStr = atualizada.dataSaida;
  const { valido, mensagem } = validarDatasReserva(entradaStr, saidaStr);
  if (!valido) {
    return { ok: false, mensagem };
  }
  const quartoOcupado = quartoEstaOcupado(reservasSalvas, atualizada.quartoSelecionado, entradaStr, saidaStr, id);
  if (quartoOcupado) {
    return { ok: false, mensagem: 'Este quarto já está reservado para o período selecionado.' };
  }
  try {
    const { id: _, ...dados } = atualizada;
    const { db } = await import('../firebase/firebaseconfig');
    const { ref, set } = await import('firebase/database');
    await set(ref(db, `reservas/${id}`), dados);
    return { ok: true, mensagem: 'Reserva atualizada com sucesso!' };
  } catch (err) {
    return { ok: false, mensagem: 'Erro ao atualizar. Tente novamente.' };
  }
}

export function validarDatasReserva(dataEntrada, dataSaida) {
  if (!dataEntrada || !dataSaida) {
    return { valido: false, mensagem: 'Preencha as datas de entrada e saída.' };
  }
  if (dataEntrada < getHojeISO()) {
    return { valido: false, mensagem: 'A data de entrada não pode ser anterior a hoje.' };
  }
  if (dataEntrada > dataSaida) {
    return { valido: false, mensagem: 'A data de entrada não pode ser posterior à data de saída.' };
  }
  return { valido: true };
}

export function quartoEstaOcupado(reservas, quartoSelecionado, dataEntrada, dataSaida, idIgnorar = null) {
  return reservas.some(r => {
    if (idIgnorar && r.id === idIgnorar) return false;
    if (r.quartoSelecionado !== quartoSelecionado) return false;
    return periodoSobrepoe(
      dataEntrada,
      dataSaida,
      r.dataEntrada,
      r.dataSaida
    );
  });
}

export function aplicarCupomDesconto(valorDiaria, cupom) {
  if (!cupom || !cupom.trim()) {
    return {
      valorDescontado: valorDiaria,
      mensagem: 'Digite um cupom antes de aplicar.'
    };
  }
  const valorDescontado = calcularDesconto(valorDiaria, cupom);
  if (valorDescontado === valorDiaria) {
    return {
      valorDescontado,
      mensagem: 'Cupom inválido.'
    };
  }
  return {
    valorDescontado,
    mensagem: `Cupom aplicado! Novo valor: R$ ${valorDescontado}`
  };
}

export const calcularDiasEntreDatas = (dataEntrada, dataSaida) => {
  if (!dataEntrada || !dataSaida) return 0;
  const entrada = new Date(dataEntrada);
  const saida = new Date(dataSaida);
  const diff = (saida - entrada) / (1000 * 60 * 60 * 24);
  return Math.max(diff, 0);
};

export const periodoSobrepoe = (aInicio, aFim, bInicio, bFim) => {
  if (!aInicio || !aFim || !bInicio || !bFim) return false;
  return (
    new Date(aInicio) <= new Date(bFim) &&
    new Date(aFim) >= new Date(bInicio)
  );
};

export const getHojeISO = () => {
  const hoje = new Date();
  return hoje.getFullYear() + '-' +
    String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoje.getDate()).padStart(2, '0');
};

export const formasPagamento = ['crédito', 'débito', 'dinheiro', 'PIX'];

export const reservaInicial = {
  quartoSelecionado: '',
  valorDiaria: '',
  cupom: '',
  valorComDesconto: '',
  formaPagamento: '',
  dataEntrada: '',
  horaEntrada: '',
  dataSaida: '',
  horaSaida: '',
  consumoFrigobar: [],
};

export const calcularDesconto = (valor, cupom) => {
  const valorNumerico = parseFloat(valor);
  if (!cupom || typeof cupom !== 'string') return valor;

  const cupomValido = cupom.trim().toUpperCase();
  switch (cupomValido) {
    case 'DESC10':
      return (valorNumerico * 0.9).toFixed(2);
    default:
      return valor;
  }
};

export const formatarData = (data) => {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

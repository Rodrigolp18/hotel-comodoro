const { strict: assert } = await import('assert');

// Reproduce the updated logic from reservaUtils (minimal parts)
export function getHojeISO() {
  const hoje = new Date();
  return hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');
}

export function validarDatasReserva(dataEntrada, dataSaida) {
  if (!dataEntrada) {
    return { valido: false, mensagem: 'Preencha a data de entrada.' };
  }
  if (dataEntrada < getHojeISO()) {
    return { valido: false, mensagem: 'A data de entrada não pode ser anterior a hoje.' };
  }
  if (dataSaida) {
    if (dataEntrada > dataSaida) {
      return { valido: false, mensagem: 'A data de entrada não pode ser posterior à data de saída.' };
    }
  }
  return { valido: true };
}

export const calcularDiasEntreDatas = (dataEntrada, dataSaida) => {
  if (!dataEntrada || !dataSaida) return 0;
  const entrada = new Date(dataEntrada);
  const saida = new Date(dataSaida);
  const diff = (saida - entrada) / (1000 * 60 * 60 * 24);
  return Math.max(diff, 0);
};

export const periodoSobrepoe = (aInicio, aFim, bInicio, bFim) => {
  if (!aInicio || !bInicio) return false;

  const aStart = new Date(aInicio);
  const aEnd = aFim ? new Date(aFim) : null;
  const bStart = new Date(bInicio);
  const bEnd = bFim ? new Date(bFim) : null;

  if (aEnd && bEnd) {
    return aStart <= bEnd && aEnd >= bStart;
  }
  if (!aEnd && bEnd) {
    return aStart <= bEnd;
  }
  if (aEnd && !bEnd) {
    return aEnd >= bStart;
  }
  return true;
};

function run() {
  const hoje = getHojeISO();
  console.log('Hoje ISO:', hoje);

  // 1. Validar sem dataSaida
  let r = validarDatasReserva(hoje, '');
  console.log('sem dataSaida valido:', r);
  assert.equal(r.valido, true);

  // 2. Data entrada anterior a hoje
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const ontemISO = ontem.getFullYear() + '-' + String(ontem.getMonth() + 1).padStart(2, '0') + '-' + String(ontem.getDate()).padStart(2, '0');
  r = validarDatasReserva(ontemISO, '');
  console.log('entrada ontem valido:', r);
  assert.equal(r.valido, false);

  // 3. entrada > saida
  r = validarDatasReserva('2025-09-10', '2025-09-05');
  console.log('entrada > saida:', r);
  assert.equal(r.valido, false);

  // 4. calcularDiasEntreDatas
  const dias = calcularDiasEntreDatas('2025-09-01', '2025-09-03');
  console.log('dias 2025-09-01 a 2025-09-03 =', dias);
  assert.equal(dias, 2);
  const diasSemSaida = calcularDiasEntreDatas('2025-09-01', '');
  console.log('dias sem saida =', diasSemSaida);
  assert.equal(diasSemSaida, 0);

  // 5. periodoSobrepoe com aberto
  // A aberto, B com fim depois do inicio -> sobrepoe
  let sobre = periodoSobrepoe('2025-09-01', '', '2025-09-05', '2025-09-10');
  console.log('A aberto vs B com fim depois =', sobre);
  assert.equal(sobre, true);

  // B aberto, A com fim antes do inicio -> não sobrepoe
  sobre = periodoSobrepoe('2025-09-01', '2025-09-05', '2025-09-06', '');
  console.log('A fim antes de B start =', sobre);
  assert.equal(sobre, false);

  // ambos abertos
  sobre = periodoSobrepoe('2025-09-01', '', '2025-09-02', '');
  console.log('ambos abertos =', sobre);
  assert.equal(sobre, true);

  console.log('Todos os testes passaram.');
}

run();

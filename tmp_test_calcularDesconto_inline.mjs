const calcularDesconto = (valor, cupom) => {
  const valorNumerico = parseFloat(valor) || 0;
  if (!cupom || typeof cupom !== 'string') return valor;

  const cupomValido = cupom.trim().toUpperCase();
  const match = /^DESC(\d+(?:\.\d+)?)$/.exec(cupomValido);
  if (match) {
    const descontoFix = parseFloat(match[1]) || 0;
    const novoValor = Math.max(0, valorNumerico - descontoFix);
    return Number(novoValor.toFixed(2));
  }

  return valor;
};

const entradas = [
  { valor: '100', cupom: 'DESC10' },
  { valor: '50', cupom: 'DESC5.5' },
  { valor: '30', cupom: 'desc40' },
  { valor: '20', cupom: 'INVALID' },
  { valor: '5', cupom: 'DESC10' },
  { valor: 'abc', cupom: 'DESC2' },
];

for (const e of entradas) {
  console.log(e, '=>', calcularDesconto(e.valor, e.cupom));
}

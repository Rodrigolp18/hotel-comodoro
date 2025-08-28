import { calcularDesconto } from './src/utils/reservaUtils.jsx';

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

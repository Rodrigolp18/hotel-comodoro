import { useState } from 'react';
import './Frigobar.css';

const itensDisponiveis = [
  { id: 1, nome: 'Água sem gás', valor: 4.5 },
  { id: 2, nome: 'Água com gás', valor: 5.0 },
  { id: 3, nome: 'Refrigerante', valor: 6.0 },
  { id: 4, nome: 'SKOL lata', valor: 7.0 },
  { id: 5, nome: 'Achocolatado', valor: 5.0 },
];

const Frigobar = ({ consumo = [], setConsumo }) => {
  const [busca, setBusca] = useState('');

  const getQuantidade = (id) => {
    const item = consumo.find((i) => i.id === id);
    return item?.quantidade || 0;
  };

  const alterarQuantidade = (itemBase, delta) => {
    const atual = consumo.find((i) => i.id === itemBase.id);
    const novaQtd = Math.max(0, (atual?.quantidade || 0) + delta);

    const atualizado = consumo.filter((i) => i.id !== itemBase.id);

    if (novaQtd > 0) {
      atualizado.push({
        ...itemBase,
        quantidade: novaQtd,
        total: itemBase.valor * novaQtd,
      });
    }

    setConsumo(atualizado);
  };

  const filtrados = itensDisponiveis.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="frigobar">
      <h3>Frigobar</h3>
      <div className="frigobar-pesquisa">
        <input
          type="text"
          placeholder="Pesquisar item"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <span className="icone-busca">🔍</span>
      </div>

      <div className="frigobar-tabela">
        <div className="frigobar-cabecalho">
          <span>Quant.</span>
          <span>Especificação</span>
          <span>Valor (R$)</span>
        </div>

        {filtrados.map((item) => (
          <div key={item.id} className="frigobar-item">
            <div className="frigobar-quantidade">
              <button onClick={() => alterarQuantidade(item, -1)}>-</button>
              <span>{getQuantidade(item.id)}</span>
              <button onClick={() => alterarQuantidade(item, 1)}>+</button>
            </div>
            <span>{item.nome}</span>
            <span>{item.valor.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frigobar;

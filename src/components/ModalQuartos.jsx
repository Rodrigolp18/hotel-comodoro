// Aqui vai o modal da janela de selecionar o quarto pra nova reserva, ele chama o componente CarQuarto
//para listar todos os quartos
import './ModalQuartos.css'
import { CardQuarto } from "./CardQuarto"

export function ModalQuartos({ quartos, closeModal }) {
    return (
        <div className="modal-overlay">
            <div class="modal">
                <div class="header-modal">
                    <p class="title-modal">Selecione um dos quartos disponíveis</p>
                    <div class="button-container">
                        <button class="button-modal" onClick={closeModal}>
                            Cancelar
                        </button>
                        <button class="button-modal">
                            Salvar seleção
                        </button>
                    </div>
                </div>
                <div class="body-modal">
                    {quartos.map((quarto) => {
                        return <CardQuarto numero={quarto.numero} descricao={quarto.descricao} />
                    })}
                </div>
            </div>
        </div>
    )
}
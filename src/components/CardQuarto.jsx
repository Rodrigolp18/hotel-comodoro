import './CardQuarto.css'

export function CardQuarto({ numero, descricao }) {
    return (
        <div class="card">
            <div class="header-card">
                Quarto {numero}
            </div>
            <div class="body">
                {descricao}
            </div>
        </div>
    )
}
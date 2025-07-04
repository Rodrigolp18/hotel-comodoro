//Aqui vão ser puxados os demais componentes e também vão ser criados os textos do nome e CPF do cliente
//da página, e o botão de criar nova reserva

import { useState } from "react";
import { CardQuarto } from "../components/CardQuarto";
import { ModalQuartos } from "../components/ModalQuartos";

const quartos = [
    {numero: 201, descricao: "1 Solteiro, 1 Auxiliarbla"},
    {numero: 202, descricao: "2 Solteiro"},
    {numero: 203, descricao: "1 Casal, 1 Auxiliar"},
    {numero: 204, descricao: "1 Casal, 1 Solteiro, 1 Auxiliar"},
    {numero: 205, descricao: "1 Casal, 1 Solteiro"},
    {numero: 206, descricao: "1 Casal, 1 Auxiliar"}
];

export default function GerenciarReservas() {

    const [modal, setModal] = useState(false)

    function handleModal() {
        setModal(true)
    }

    function closeModal(){
        setModal(false)
    }

    return (
        <div>
            <h1>Hello World</h1>
            <button onClick={handleModal}>
                Quartos
            </button>
            {modal &&
                <ModalQuartos quartos={quartos} closeModal={closeModal}/>
            }
        </div>
    )
}
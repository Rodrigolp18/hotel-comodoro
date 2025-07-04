//Aqui vão ser puxados os demais componentes e também vão ser criados os textos do nome e CPF do cliente
//da página, e o botão de criar nova reserva

import { useState } from "react";
import Navbar from "../components/Navbar";
import Reservas from "../components/Reservas";

export default function GerenciarReservas() {
    return (
        <div>
            <Navbar/>
            <h1>Hello World</h1>
            <Reservas />
        </div>
    )
}
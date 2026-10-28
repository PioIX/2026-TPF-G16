"use client"

import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function ChatsPage() {
    const [chats, setChats] = useState([]);
    const [chatElegido, setChatElegido] = useState(null);
    const [ultimosMsj, setUltimosMsj] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [error, setError] = useState("");

    const [errorCierre, setErrorCierre] = useState("");

    useEffect(() => {
        cargarChats()
    }, []);

    const cargarChats = () => {
        fetch('http://localhost:4000/chats')
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setChats(data);
                }
            })
    }

    const cerrarSesion = () => {
        fetch('http://localhost:4000/cierreSesion')
            .then(response => response.json())
            .then(data => {
                if (data === 0) {
                    router.replace('/');
                } else {
                    setErrorCierre("Ha ocurrido un error, intente denuevo más tarde.");
                }
            });
    }

    return(
        <main>
            <div>
                <div>
                    <img></img>
                    <h2>PetMatch</h2>
                </div>
                <div>
                    <Button text={"Matches"} funcion={() => {router.push("/matches")}}></Button>
                    <Button text={"Chats"} funcion={() => {router.push("/chats")}}></Button>
                </div>
            </div>
            <div>
                <Popup trigger={<Button text={abierto ? "Volver" : "Cerrar Sesión"}></Button>}>
                    <div>
                        <p>¿Estás seguro de que quieres cerrar sesión?</p>
                        <Button text={"Confirmar"} funcion={cerrarSesion}></Button>
                        {errorCierre && (<p>{errorCierre}</p>)}
                    </div>
                </Popup>
                <div>
                    <div>
                        <h1>Tus chats</h1>
                        {chats.map(chat => {
                            <div id={chat.id_chat}>
                                <img src=""></img>
                                <div>
                                    <h4>{chat.nombre}</h4>
                                    <p>{chat.nombre_refugio}</p>
                                    <p>{chat.ultimoMsj}</p>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}
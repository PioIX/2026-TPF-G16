"use client"

import { useState, useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import ChatObj from "@/components/ChatObj";
import Chat from "@/components/Chat";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function ChatsPage() {
    const [chats, setChats] = useState([]);
    const [chatElegido, setChatElegido] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [error, setError] = useState("");

    const [errorCierre, setErrorCierre] = useState("");
    const { socket, isConnected } = useSocket();

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
    const selectChat = (id_chat) => {
        chats.forEach(chat => {
            if (chat.id_chat = id_chat) {
                setChatElegido(chat);
                if (socket) {
                socket.emit('joinRoom', { room: id_chat })
            }
            }
        })
    }

    useEffect(() => {
        fetch(`http://localhost:4000/mensajes/${chatElegido.id_chat}`)
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setMensajes(data);
                }
            })
    }, [chatElegido])

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
                            <Chat chat={chat} funcion={selectChat}></Chat>
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}
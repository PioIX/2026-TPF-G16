"use client"

import { useState, useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import ChatList from "@/components/ChatList";
import Chat from "@/components/Chat";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function ChatsPage() {
    const [chats, setChats] = useState([]);
    const [chatElegido, setChatElegido] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [msj, setMsj] = useState("");
    const [error, setError] = useState("");

    const [errorCierre, setErrorCierre] = useState("");
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        cargarChats()
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("userData", (data) => {setUsuario(data);})
        socket.on("newMessage", (data) => {setMensajes([...mensajes, data])})

        return () => {
            socket.off("userData");
            socket.off("newMessage");
        }
    }, [socket]);

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

    const enviarMsj = () => {
        if (msj) {
            socket.emit('sendMessage', msj)
            setMsj("");
        }
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
                            <ChatList chat={chat} funcion={selectChat}></ChatList>
                        })}
                    </div>
                    <div>
                        {chatElegido && (
                            <Chat mensajes={mensajes} tipoUser={usuario.type} change={setMsj} funcion={enviarMsj}></Chat>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
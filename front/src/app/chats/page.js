"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import ChatList from "@/components/ChatList";
import Chat from "@/components/Chat";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Button from "@/components/Button";

export default function ChatsPage() {
    const [chats, setChats] = useState([]);
    const [chatElegido, setChatElegido] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [msj, setMsj] = useState("");
    const [error, setError] = useState("");
    
    const [listo, setListo] = useState(false);

    const { socket, isConnected } = useSocket();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const tipo = searchParams.get("tipo");

    useEffect(() => {
        cargarChats();
        setListo(true);
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (data) => {setMensajes(original => [...original, data.message])})
        return () => {
            socket.off("newMessage");
        }
    }, [socket, isConnected]);

    const cargarChats = () => {
        fetch(`http://localhost:4000/chats/${id}/${tipo}`, {
            credentials: "include"
        })
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
            if (Number(chat.id_chat) === Number(id_chat)) {
                setChatElegido(chat);
                if (socket) {
                    socket.emit('joinRoom', { room: id_chat })
                }
            }
        })
    }

    const adoptar = () => {
        const datos = {id_ref: id, id_pet: chatElegido.id_mascota, pet: chatElegido.nombreSecundario, id_usuario: chatElegido.id_usuario, id_chat: chatElegido.id_chat};
        fetch(`http://localhost:4000/adoptar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data === -1) {
                setError("Ha ocurrido un error, intente denuevo más tarde.");
            } else {
                cargarChats();
                setChatElegido(null);
            }
        });
    }
    const eliminar = () => {
        const datos = {id_chat: chatElegido.id_chat};
        fetch(`http://localhost:4000/eliminarChat`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(datos)
            })
        .then(response => response.json())
        .then(data => {
            if (data === -1) {
                setError("Ha ocurrido un error, intente denuevo más tarde.");
            } else {
                cargarChats();
                setChatElegido(null);
            }
        });
    }

    const enviarMsj = () => {
        if (msj.trim() !== "" && socket && chatElegido) {
            socket.emit('sendMessage', {msj: msj, tipo: tipo, id: id})
            setMsj("");
        }
    }

    useEffect(() => {
        if (!chatElegido) return;
        fetch(`http://localhost:4000/mensajes/${chatElegido.id_chat}`, {
            credentials: "include"
        })
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
        router.replace('/');
    }

    return(
        <main className="chats-main">
            <div className="chats-sidebar">
                <div className="sidebar-brand">
                    <img className="logo-img"></img>
                    <h2>PetMatch</h2>
                </div>
                <div className="sidebar-menu chats-menu">
                    <Button text={"Matches"} funcion={() => {
                        if (tipo === "usuario") {
                            router.push(`/matches?id=${id}`)
                        } else {
                            router.push(`mascotas?id=${id}`)
                        }}}></Button>
                    <Button text={"Chats"} funcion={() => {router.push(`/chats?id=${id}&tipo=${tipo}`)}}></Button>
                </div>
            </div>
            <div className="chats-body">
                {listo && (
                    <Popup trigger={<button className="btn-cerrar-sesion">Cerrar Sesión</button>}>
                        <div className="popup-box">
                            <p>¿Estás seguro de que quieres cerrar sesión?</p>
                            <Button text={"Confirmar"} funcion={cerrarSesion}></Button>
                        </div>
                    </Popup>
                )}
                <div className="chats-workspace">
                    <div className="chats-list-column">
                        <h1>Tus chats</h1>
                        {chats.map(chat => (
                            <ChatList key={chat.id_chat} chat={chat} funcion={selectChat}></ChatList>
                        ))}
                    </div>
                    <div className="chat-conversation-column">
                        {error && (<p className="error-message">{error}</p>)}
                        {chatElegido && usuario && (
                            <>
                                {usuario.type === "refugio" ? (
                                    <div className="chat-actions-bar">
                                        <Button text={"Marcar como adoptado"} funcion={adoptar}></Button>
                                        <Button text={"Eliminar chat"} funcion={eliminar}></Button>
                                    </div>
                                ) : (
                                    (chatElegido.estado === "Adoptado" && (
                                        <Button text={"Eliminar chat"} funcion={eliminar}></Button>
                                    ))
                                )}
                                <Chat mensajes={mensajes} tipoUser={usuario.type}  change={setMsj} funcion={enviarMsj}></Chat>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
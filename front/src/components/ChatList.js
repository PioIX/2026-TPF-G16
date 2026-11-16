export default function ChatList({ chat, funcion }) {
    return(
        <button id={chat.id_chat} onClick={() => funcion(chat.id_chat)}>
            <img src={chat.foto ? `http://localhost:4000${chat.foto} : "http://localhost:4000/uploads/foto_default.png`} alt={chat.nombrePrincipal}></img>
            <div>
                <h4>{chat.nombrePrincipal}</h4>
                <p>{chat.nombreSecundario}</p>
                <p>{chat.ultimoMsj.texto}</p>
            </div>
        </button>
    );
}
export default function ChatList({ chat, funcion }) {
    <button id={chat.id_chat} onClick={() => funcion(id_chat)}>
        <img src=""></img>
        <div>
            <h4>{chat.nombrePrincipal}</h4>
            <p>{chat.nombreSecundario}</p>
            <p>{chat.ultimoMsj}</p>
        </div>
    </button>
}
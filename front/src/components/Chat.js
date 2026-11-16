export default function Chat({ mensajes, tipoUser, change, funcion }) {
    const esMio = (msj) => {
        if (tipoUser === "usuario" && msj.id_usuario) {
            return true;
        }
        if (tipoUser === "refugio" && msj.id_refugio){
            return true;
        }
        return false;
    }
    return(
        <>
            {mensajes.map(msj => (
                <div key={msj.id_mensaje} className={esMio(msj) ? "clase1" : "clase2"}> /* depende de si es del usuario o no se muestra diferente */
                    <p>{msj.texto}</p>
                    <p>{msj.fecha_envio}</p>
                </div>
            ))}
            <div>
                <input type="text" placeholder="Escriba un mensaje..." onChange={(e) => {change(e.target.value)}}></input>
                <button onClick={funcion}></button>
            </div>
        </>
    )
}
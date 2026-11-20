import Button from "@/components/Button";

export default function Chat({ mensajes, tipoUser, change, funcion }) {
    const esMio = (msj) => {
        if (tipoUser === "usuario" && msj.id_usuario) {
            return 1; // del usuario
        } if (tipoUser === "refugio" && msj.id_refugio){
            return 1; // del usuario
        } if (!msj.id_refugio && !msj.id_usuario) {
            return -1; // del sistema (aviso)
        }
        return 0; // de la otra persona
    }
    return(
        <>
            <div>
                {mensajes.map(msj => (
                    <div key={msj.id_mensaje} className={""}> {/* depende de si es del usuario o del otro o del sistema, se muestra diferente */}
                        <p>{msj.texto}</p>
                        <p>{msj.fecha_envio}</p>
                    </div>
                ))}
            </div>
            <div>
                <input type="text" placeholder="Escriba un mensaje..." onChange={(e) => {change(e.target.value)}}></input>
                <Button text={"Enviar"} funcion={funcion}></Button>
            </div>
        </>
    )
}
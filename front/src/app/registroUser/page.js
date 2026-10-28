"use client"

import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/main.css"

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [foto, setFoto] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const registrarse = () => {
        const datos = new FormData();

        datos.append("nombre", nombre);
        datos.append("apellido", apellido);
        datos.append("mail", mail);
        datos.append("password", password);
        datos.append("foto", foto);

        fetch('http://localhost:4000/registerUser', {
            method: 'POST',
            body: datos
        })
            .then(response => response.json())
            .then(data => {
                if (data === 0){
                    setError("Ya existe una cuenta con este mail, intente denuevo.");
                } else if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    router.replace(`/matches?user=usuario`);
                }
            });
    }

    return(
        <main>
            <div>
                <div>
                    <img></img>
                    <h1>Pio Chat</h1>
                </div>
                <Button text={"Volver al inicio"} funcion={() => {router.back()}}></Button>
            </div>
            <div>
                <div>
                    <img></img>
                    <h2>Registro</h2>
                    <p>¡Gracias por visitar!</p>
                </div>
                <div>
                    <Input type={"text"} text={"Nombre"} placeholder={"Ingrese su nombre"} change={setNombre}></Input>
                    <Input type={"text"} text={"Apellido"} placeholder={"Ingrese su apellido"} change={setApellido}></Input>
                    <Input type={"email"} text={"Mail"} placeholder={"ejemplo@gmail.com"} change={setMail}></Input>
                    <Input type={"password"} text={"Contraseña"} placeholder={"Ingrese su contraseña"} change={setPassword}></Input>
                    <Input type={"file"} text={"Foto de perfil"} placeholder={"Suba su foto de perfil (OPCIONAL)"} change={setFoto}></Input>
                    <Button text={"Registrarse"} funcion={registrarse}></Button>
                    {error && (<p>{error}</p>)}
                </div>
                <div>
                    <p>¿Ya tenés una cuenta?</p>
                    <Button text={"Iniciar sesión aquí"} funcion={() => {router.push("/login?user=usuario")}}></Button>
                </div>
            </div>
        </main>
    )
}
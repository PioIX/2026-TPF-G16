"use client"

import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const user = searchParams.get("user");

    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const iniciarSesion = () => {
        const datos = {tipoUser: user, mail: mail, password: password};

        fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {
                if (data === 0){
                    setError("Mail o contraseña incorrectos, intenta denuevo.");
                } else if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    if (user === "usuario") {
                        router.replace("/matches");
                    } else {
                        router.replace("/mascotas");
                    }
                }
            });
    }

    const irRegistro = () => {
        if (user === "usuario") {
            router.push("/registroUser");
        } else {
            router.push("/registroRef");
        }
    }

    return(
        <main>
            <div>
                <div>
                    <img></img>
                    <h1>PetMatch</h1>
                </div>
                <Button text={"Volver al inicio"} funcion={() => {router.back()}}></Button>
            </div>
            <div>
                <div>
                    <img></img>
                    <h2>Iniciar sesión</h2>
                    <p>¡Qué bueno verte denuevo!</p>
                </div>
                <div>
                    <Input type={"email"} text={"Correo electrónico"} placeholder={"ejemplo@gmail.com"} change={setMail}></Input>
                    <Input type={"password"} text={"Contraseña"} placeholder={"Ingresa tu contraseña"} change={setPassword}></Input>
                    <Button text={"Iniciar sesión"} funcion={iniciarSesion}></Button>
                    {error && (<p>{error}</p>)}
                </div>
                <div>
                    <p>¿No tenés una cuenta?</p>
                    <Button text={"Registrate aquí"} funcion={irRegistro}></Button>
                </div>
            </div>
        </main>
    )
}
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

    const router = useRouter();

    const iniciarSesion = () => {
        const datos = {user: user, mail: mail, contrasena: password};

        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {
                if (data === 0){
                    return(
                        <p>Mail o contraseña incorrectos, intenta denuevo.</p>
                    )
                } else if (data === -1) {
                    return(
                        <p>A ocurrido un error, intente denuevo más tarde.</p>
                    )
                } else {
                    router.replace("/matches?user=");
                }
            });
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
                </div>
                <div>
                    <p>¿No tenés una cuenta?</p>
                    <a href="/registro">Registrate aquí</a>
                </div>
            </div>
        </main>
    )
}
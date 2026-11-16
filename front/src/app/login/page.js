"use client";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@/main.css";

export default function Login() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const searchParams = useSearchParams();
    const tipo = searchParams.get("user");

    const iniciarSesion = () => {
        const datos = {user: tipo, mail: mail, password: password};
        fetch(`http://localhost:4000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data === 0) {
                setError("Mail o contraseña incorrecta.")
            } else if (data === -1) {
                setError("Ha ocurrido un error, intente denuevo más tarde.");
            } else {
                if (tipo === "usuario") {
                    router.push("/matches");
                } else {
                    router.push("/mascotas");
                }
            }
        });
    };

    return (
        <main className="form-container">
            <div className="top-header">
                <div className="logo-box">
                    <img src="/logo-paws.png" alt="PetMatch Logo" className="logo-img" />
                    <h1 className="logo-title">PetMatch</h1>
                </div>
                <Button text={"← Volver al inicio"} funcion={() => router.back()} />
            </div>

            <div className="form-card">
                <div className="card-header">
                    <img
                        src="/pets-illustration.png"
                        alt="Mascotas"
                        className="header-illustration"
                    />
                    <h2 className="card-title">Iniciar sesión</h2>
                    <p className="card-subtitle">¡Qué bueno verte de nuevo!</p>
                </div>

                <div className="inputs-wrapper">
                    <Input
                        type={"email"}
                        text={"Correo electrónico"}
                        placeholder={"ejemplo@gmail.com"}
                        change={setMail}
                    />
                    <Input
                        type={"password"}
                        text={"Contraseña"}
                        placeholder={"Ingresa tu contraseña"}
                        change={setPassword}
                    />

                    <Button text={"Iniciar sesión →"} funcion={iniciarSesion} />
                    {error && <p className="error-message">{error}</p>}
                </div>

                <div className="divider">
                    <div className="divider-line"></div>
                    <span className="divider-dot">o</span>
                    <div className="divider-line"></div>
                </div>

                <div className="footer-account">
                    <p className="footer-text">¿No tenés una cuenta?</p>
                    {tipo === "usuario" ? (
                        <Button
                            text={"Registrate aquí"}
                            funcion={() => router.push("/registroUser")}
                        />
                    ) : (
                        <Button
                            text={"Registrate aquí"}
                            funcion={() => router.push("/registroRef")}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
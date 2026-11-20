"use client";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/main.css";

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [foto, setFoto] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const registrarse = () => {
        setError("");
        if (nombre.trim() === "" || apellido.trim() === "" || mail.trim() === "" || password.trim() === "") {
            setError("Debes completar todos los campos para registrarte.")
        } else if (password.length < 8) {
            setError("La contraseña debe ser de minimo 8 caracteres.")
        } else {
            const datos = new FormData();
            datos.append("nombre", nombre);
            datos.append("apellido", apellido);
            datos.append("mail", mail);
            datos.append("password", password);
            if (foto) {
                datos.append("foto", foto);
            }

            fetch('http://localhost:4000/registerUser', {
                method: 'POST',
                credentials: "include",
                body: datos
            })
                .then(x => x.json())
                .then(data => {
                    if (data === 0){
                        setError("Ya existe una cuenta con este mail, intente denuevo.");
                    } else if (data === -1) {
                        setError("Ha ocurrido un error, intente denuevo más tarde.");
                    } else {
                        router.replace(`/matches?id=${data}`);
                    }
                });
        }
    }

    return (
        <main className="form-container">
            <div className="top-header">
                <div className="logo-box">
                    <img src="/logo-paws.png" alt="PetMatch Logo" className="logo-img" />
                    <h1 className="logo-title">PetMatch</h1>
                </div>
                <Button text={"← Volver al inicio"} funcion={() => { router.back() }}></Button>
            </div>

            <div className="form-card">
                <div className="card-header">
                    <img src="/mascotas.png" alt="Mascotas" className="header-illustration" />
                    <h2 className="card-title">Registro</h2>
                    <p className="card-subtitle">¡Gracias por visitar!</p>
                </div>

                <div className="inputs-wrapper">
                    <Input type={"text"} text={"Nombre"} placeholder={"Ingrese su nombre"} change={setNombre}></Input>
                    <Input type={"text"} text={"Apellido"} placeholder={"Ingrese su apellido"} change={setApellido}></Input>
                    <Input type={"email"} text={"Mail"} placeholder={"ejemplo@gmail.com"} change={setMail}></Input>
                    <Input type={"password"} text={"Contraseña"} placeholder={"Ingrese su contraseña"} change={setPassword}></Input>
                    <Input type={"file"} text={"Foto de perfil"} placeholder={"Suba su foto de perfil (OPCIONAL)"} change={setFoto}></Input>
                    
                    <Button text={"Registrarse →"} funcion={registrarse}></Button>
                    {error && (<p className="error-message">{error}</p>)}
                </div>

                <div className="divider">
                    <div className="divider-line"></div>
                    <span className="divider-dot">o</span>
                    <div className="divider-line"></div>
                </div>

                <div className="footer-account">
                    <p className="footer-text">¿Ya tenés una cuenta?</p>
                    <Button text={"Iniciar sesión aquí"} funcion={() => { router.push("/login?user=usuario") }}></Button>
                </div>
            </div>
        </main>
    );
}

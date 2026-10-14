"use client"

import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function MascotasPage() {
    const [nombre, setNombre] = useState("");
    const [especie, setEspecie] = useState("");
    const [raza, setRaza] = useState("");
    const [edad, setEdad] = useState(null);
    const [sexo, setSexo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [foto, setFoto] = useState(null);
    const [caracPet, setCaracPet] = useState([]);
    
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [error, setError] = useState("");

    const router = useRouter();

    const cargarCaracteristicas = () => {
        fetch('http://localhost:4000/getCaracteristicas')
            .then(response => response.json())
            .then(data => setCaracteristicas(data));
    }

    const mascotaNueva = () => {
        // primero guardar las caracteristicas
        const datos = new FormData();

        datos.append("nombre", nombre);
        datos.append("especie", especie);
        datos.append("raza", raza);
        datos.append("edad", edad);
        datos.append("sexo", sexo);
        datos.append("desc", descripcion);
        datos.append("foto", foto);

        fetch('http://localhost:4000/registerPet', {
            method: 'POST',
            body: datos
        })
            .then(response => response.json())
            .then(data => {
                if (data === 0){
                    setError("Ya tienes registrada una mascota con ese nombre.");
                } else if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    guardarCaracteristicas();
                }
            });
    }

    const guardarCaracteristicas = () => {}

    return (
        <main>
            <div>
                <div>
                    <img></img>
                    <h2>PetMatch</h2>
                </div>
                <div>
                    <Button text={"Mascotas"} funcion={() => {router.push("/matches")}}></Button>
                    <Button text={"Chats"} funcion={() => {router.push("/matches")}}></Button>
                </div>
            </div>
            <div>
                <div>
                    <div>
                        <h1>Tus mascotas</h1>
                        <p>Visualiza las mascotas ingresadas</p>
                    </div>
                    <Button text={"Cerrar sesión"} funcion={cerrarSesion}></Button>
                </div>
                <div>
                    <h2>Lista Mascotas</h2>
                </div>
                <div>
                    <Popup trigger={<Button text={"Nueva mascota"}></Button>}>
                        <div>
                            <h2>Registrar mascota</h2>
                            <p>Ingrese todos los campos para registrar a su nueva mascota.</p>
                        </div>
                        <div>
                            <Input type={"text"} text={"Nombre"} placeholder={"Ingrese su nombre"} change={setNombre}></Input>
                            <Select text={"Tipo"} change={setEspecie} options={["Perro", "Gato", "Pajaro", "Conejo"]}></Select>
                            <Input type={"text"} text={"Raza"} placeholder={"Ingrese su raza/especie"} change={setRaza}></Input>
                            <Input type={"number"} text={"Edad"} placeholder={"Ingrese su edad"} change={setEdad}></Input>
                            <Select text={"Sexo"} change={setSexo} options={["F", "M"]}></Select>
                            <Input type={"text"} text={"Descripción"} placeholder={"Describa a la mascota"} change={setDescripcion}></Input>
                            <Input type={"file"} text={"Foto"} placeholder={"Ingrese una foto de su amiguito"} change={setFoto}></Input>
                            <div>
                                <label>Caracteristicas</label>
                                {caracteristicas.map(car => {
                                    <div>
                                    </div>
                                })}
                            </div>
                            <Button text={"Registrar mascota"} funcion={mascotaNueva}></Button>
                        </div>
                    </Popup>
                </div>
            </div>
        </main>
    )
}
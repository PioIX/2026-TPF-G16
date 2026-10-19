"use client"

import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function MascotasPage() {
    const [mascotas, setMascotas] = useState("");

    const [nombre, setNombre] = useState("");
    const [especie, setEspecie] = useState("");
    const [raza, setRaza] = useState("");
    const [edad, setEdad] = useState(null);
    const [sexo, setSexo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [foto, setFoto] = useState(null);
    const [carMascota, setCarMascota] = useState([]);
    
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [error, setError] = useState("");
    const [confirmacion, setConfirmacion] = useState(false);
    const [errorCierre, setErrorCierre] = useState("");

    const router = useRouter();

    const cargarMascotas = () => {
        fetch('http://localhost:4000/mascotas')
            .then(response => response.json())
            .then(data => setMascotas(data))
    }
    cargarMascotas();

    const cargarCaracteristicas = () => {
        fetch('http://localhost:4000/caracteristicas')
            .then(response => response.json())
            .then(data => setCaracteristicas(data))
    }
    cargarCaracteristicas();

    const cambiarCaracteristicas = (bool, id_car) => {
        if (bool) {
            if (!carMascota.includes(id_car)) {
                setCarMascota([...carMascota, id_car]);
            }
        } else {
            if (carMascota.includes(id_car)) {
                setCarMascota(carMascota.filter(id => id !== id_car));
            }
        }
    }

    const mascotaNueva = () => {
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
                    guardarCaracteristicas(data);
                }
            });
    }

    const guardarCaracteristicas = (id_pet) => {
        const datos = {id_pet: id_pet, car: carMascota};
        fetch('http://localhost:4000/registerCar', {
            method: 'POST',
            body: datos
        })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    cargarMascotas();
                }
            });
    }

    const confirmar = () => {
        setConfirmacion(true);
    }

    const cerrarSesion = () => {
        fetch('http://localhost:4000/cierreSesion')
            .then(response => response.json())
            .then(data => {
                if (data === 0) {
                    router.replace('/');
                } else {
                    setErrorCierre("Ha ocurrido un error, intente denuevo más tarde.");
                }
            });
    }

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
                    <Button text={"Cerrar sesión"} funcion={confirmar}></Button>
                    {confirmacion && (
                        <div>
                            <p>¿Estás seguro de que quieres cerrar sesión?</p>
                            <Button text={"Confirmar"} funcion={cerrarSesion}></Button>
                            <Button text={"Volver"} funcion={() => {setConfirmacion(false)}}></Button>
                        </div>
                    )}
                    {errorCierre && (<p>{errorCierre}</p>)}
                </div>
                <div>
                    <h2>Mascotas</h2>
                    {mascotas.map(pet => (
                        <div>
                            <img></img>
                            <div>
                                <h3>{pet.nombre}</h3>
                                <div>
                                    <img></img>
                                    <p>{pet.especie} - {pet.raza}</p>
                                </div>
                                <div>
                                    <div>
                                        <img></img>
                                        <p>{pet.edad} años</p>
                                    </div>
                                    {pet.sexo === "F" ? (
                                        <div>
                                            <img></img>
                                            <p>Hembra</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <img></img>
                                            <p>Macho</p>
                                        </div>
                                    )}
                                    <p>{pet.descripcion}</p>
                                    <div>
                                        <h4>Caracteristicas</h4>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                {caracteristicas.map(car => (
                                    <div>
                                        <Checkbox id={car.id_caracteristica} text={car.descripcion} change={cambiarCaracteristicas}></Checkbox>
                                    </div>
                                ))}
                            </div>
                            <Button text={"Registrar mascota"} funcion={mascotaNueva}></Button>
                            {error && (<p>{error}</p>)}
                        </div>
                    </Popup>
                </div>
            </div>
        </main>
    )
}
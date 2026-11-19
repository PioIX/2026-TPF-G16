"use client"

import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function MascotasPage() {
    const [mascotas, setMascotas] = useState([]);
    const [carPorMascota, setCarPorMascota] = useState([]);

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
    const [errorRegistro, setErrorRegistro] = useState("");
    const [errorCierre, setErrorCierre] = useState("");

    const [listo, setListo] = useState(false);

    const router = useRouter();

    const cargarMascotas = () => {
        console.log("probando")
        fetch('http://localhost:4000/mascotas',
            {
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.")
                } else {
                    setMascotas(data);
                    cargarCarPorMascota(data);
                }
            })
    }
    const cargarCarPorMascota = (pets) => {
        let datos = {mascotas: pets};
        fetch('http://localhost:4000/carPorMascota', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setCarPorMascota(data);
                }
            });
    }
    const cargarCaracteristicas = () => {
        fetch('http://localhost:4000/caracteristicas', {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setCaracteristicas(data);
                }
            });
    }
    useEffect(() => {
        cargarMascotas();
        cargarCaracteristicas();
        setListo(true);
    }, []);

    const cambiarCaracteristicas = (bool, id_car) => {
        id_car = Number(id_car);
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
        if (nombre.trim() === "" || especie.trim() === "" || raza.trim() === "" || !edad || sexo.trim() === "" || descripcion.trim() === "" || !foto) {
            setErrorRegistro("Debes completar todos los campos.");
        } else {
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
                credentials: "include",
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
    }
    const guardarCaracteristicas = (id_pet) => {
        const datos = {id_pet: id_pet, car: carMascota};
        fetch('http://localhost:4000/registerCar', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setCarMascota([]);
                    setNombre("");
                    setEspecie("");
                    setRaza("");
                    setEdad(null);
                    setSexo("");
                    setDescripcion("");
                    setFoto(null);

                    cargarMascotas();
                }
            });
    }

    const cerrarSesion = () => {
        fetch('http://localhost:4000/cierreSesion', {
            credentials: "include"
        })
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
        <main className="mascotas-main">
            <div className="mascotas-sidebar">
                <div className="sidebar-brand">
                    <img className="logo-img"></img>
                    <h2>PetMatch</h2>
                </div>
                <div className="sidebar-menu">
                    <Button text={"Mascotas"} funcion={() => {router.push("/mascotas")}}></Button>
                    <Button text={"Chats"} funcion={() => {router.push("/chats")}}></Button>
                </div>
            </div>
            <div className="mascotas-body">
                <div className="mascotas-topbar">
                    {error && (<p className="error-message">{error}</p>)}
                    <div className="topbar-tittles">
                        <h1>Tus mascotas</h1>
                        <p>Visualiza las mascotas ingresadas</p>
                    </div>
                    {listo && (
                        <Popup trigger={<button>Cerrar Sesión</button>}>
                            <div className="popup-box">
                                <p>¿Estás seguro de que quieres cerrar sesión?</p>
                                <Button text={"Confirmar"} funcion={cerrarSesion}></Button>
                                {errorCierre && (<p className="error-message">{errorCierre}</p>)}
                            </div>
                        </Popup>
                    )}
                </div>
                <div className="mascotas-list-container">
                    <h2>Mascotas</h2>
                    {mascotas.map(pet => (
                        <div key={pet.id_mascota} className="pet-list-item-card">
                            <img src={`http://localhost:4000${pet.foto}`} alt="Foto mascota"></img>
                            {console.log(pet.foto)}
                            <div className="pets-list-details">
                                <h3>{pet.nombre}</h3>
                                <div>
                                    <img></img>
                                    <p>{pet.especie} - {pet.raza}</p>
                                </div>
                                <div className="pet-info-stack-list">
                                    <div className="pet-stat-list">
                                        <img></img>
                                        <p>{pet.edad} años</p>
                                    </div>
                                    {pet.sexo === "F" ? (
                                        <div className="pet-stat-list">
                                            <img></img>
                                            <p>Hembra</p>
                                        </div>
                                    ) : (
                                        <div className="pet-stat-list">
                                            <img></img>
                                            <p>Macho</p>
                                        </div>
                                    )}
                                    <p className="pet-list-desc">{pet.descripcion}</p>
                                    <div className="pet-list-traits">
                                        <h4>Caracteristicas</h4>
                                        <ul className="traits-list-ul">
                                            {carPorMascota.filter(car => Number(car.id_mascota) === Number(pet.id_mascota)).map(car => (
                                                <li key={car.id_caracteristica}>{car.descripcion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    {listo && (
                        <Popup trigger={<Button text={"Nueva mascota"}></Button>}>
                            <div>
                                <h2>Registrar mascota</h2>
                                <p>Ingrese todos los campos para registrar a su nueva mascota.</p>
                            </div>
                            <div>
                                <Input type={"text"} text={"Nombre"} placeholder={"Ingrese su nombre"} change={setNombre}></Input>
                                <Select text={"Especie"} change={setEspecie} options={["Perro", "Gato", "Pajaro", "Conejo"]}></Select>
                                <Input type={"text"} text={"Raza"} placeholder={"Ingrese su raza/especie"} change={setRaza}></Input>
                                <Input type={"number"} text={"Edad"} placeholder={"Ingrese su edad"} change={setEdad}></Input>
                                <Select text={"Sexo"} change={setSexo} options={["F", "M"]}></Select>
                                <Input type={"text"} text={"Descripción"} placeholder={"Describa a la mascota"} change={setDescripcion}></Input>
                                <Input type={"file"} text={"Foto"} placeholder={"Ingrese una foto de su amiguito"} change={setFoto}></Input>
                                <div>
                                    <label>Caracteristicas</label>
                                    {caracteristicas.map(car => (
                                        <div key={car.id_caracteristica}>
                                            <Checkbox text={car.descripcion} change={cambiarCaracteristicas} id={car.id_caracteristica}></Checkbox>
                                        </div>
                                    ))}
                                </div>
                                <Button text={"Registrar mascota"} funcion={mascotaNueva}></Button>
                                {errorRegistro && (<p>{errorRegistro}</p>)}
                            </div>
                        </Popup>
                    )}
                </div>
            </div>
        </main>
    )
}
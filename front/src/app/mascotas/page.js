"use client"

import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "@/main.css";
import "@/mascotas.css";

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
        let datos = { mascotas: pets };
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

    const inicializarCar = (id_pet) => {
        let car = carPorMascota.filter(registro => Number(registro.id_mascota) === Number(id_pet));
        car = car.map(registro => Number(registro.id_caracteristica))
        setCarMascota(car);

        setNombre("");
        setEspecie("");
        setRaza("");
        setEdad(null);
        setSexo("");
        setDescripcion("");
        setFoto(null);
    }
    const editar = (id_pet) => {
        let mascota = mascotas.find(pet => pet.id_mascota === id_pet);
        const datos = new FormData();
        if (nombre) { datos.append("nombre", nombre) } else { datos.append("nombre", mascota.nombre) }
        if (especie) { datos.append("especie", especie) } else { datos.append("especie", mascota.especie) }
        if (raza) { datos.append("raza", raza) } else { datos.append("raza", mascota.raza) }
        if (edad) { datos.append("edad", edad) } else { datos.append("edad", mascota.edad) }
        if (sexo) { datos.append("sexo", sexo) } else { datos.append("sexo", mascota.sexo) }
        if (descripcion) { datos.append("desc", descripcion) } else { datos.append("desc", mascota.descripcion) }
        if (foto) { datos.append("foto", foto) }

        fetch(`http://localhost:4000/mascotas`, {
            method: 'PUT',
            credentials: "include",
            body: datos
        })
            .then(response => response.json())
            .then(data => {
                if (data === 0) {
                    setError("Ya tienes registrada una mascota con ese nombre.");
                } else if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    editarCaracteristicas(id_pet);
                }
            });
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
                    if (data === 0) {
                        setError("Ya tienes registrada una mascota con ese nombre.");
                    } else if (data === -1) {
                        setError("Ha ocurrido un error, intente denuevo más tarde.");
                    } else {
                        guardarCaracteristicas(data);
                    }
                });
        }
    }
    const editarCaracteristicas = (id_pet) => {
        const datos = { id_pet: id_pet, car: carMascota };
        fetch('http://localhost:4000/editarCar', {
            method: 'PUT',
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
    const guardarCaracteristicas = (id_pet) => {
        const datos = { id_pet: id_pet, car: carMascota };
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
                    <img className="logo-img" src="/logo-paws.png" alt="PetMatch" />
                    <h2>PetMatch</h2>
                </div>
                <div className="sidebar-menu">
                    <Button text={"Mascotas"} funcion={() => { router.push("/mascotas") }} />
                    <Button text={"Chats"} funcion={() => { router.push("/chats") }} />
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
                        <Popup trigger={<button>Cerrar Sesión</button>} modal>
                            <div className="popup-box">
                                <p>¿Estás seguro de que quieres cerrar sesión?</p>
                                <Button text={"Confirmar"} funcion={cerrarSesion} />
                                {errorCierre && (<p className="error-message">{errorCierre}</p>)}
                            </div>
                        </Popup>
                    )}
                </div>

                <div className="mascotas-list-container">
                    <h2>Mascotas</h2>
                    {mascotas.map(pet => (
                        <div key={pet.id_mascota} className="pet-list-item-card">
                            <img className="pet-list-img" src={`http://localhost:4000${pet.foto}`} alt="Foto mascota" />
                            <div className="pets-list-details">
                                <h3>{pet.nombre}</h3>
                                <div className="pet-species-row-list">
                                    <img alt="" />
                                    <p>{pet.especie} - {pet.raza}</p>
                                </div>
                                <div className="pet-info-stack-list">
                                    <div className="pet-stat-list">
                                        <img alt="" />
                                        <p>{pet.edad} años</p>
                                    </div>
                                    {pet.sexo === "F" ? (
                                        <div className="pet-stat-list">
                                            <img alt="" />
                                            <p>Hembra</p>
                                        </div>
                                    ) : (
                                        <div className="pet-stat-list">
                                            <img alt="" />
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

                                    {listo && (
                                        <Popup trigger={<button className="btn-editar-mascota">Editar</button>} onOpen={() => inicializarCar(pet.id_mascota)} modal>
                                            {close => (
                                                <div className="modal-pet-form">
                                                    <button className="close-modal" onClick={close}>×</button>
                                                    <div className="form-header">
                                                        <h2>Editar mascota</h2>
                                                        <p>Ingrese todos los campos que desea cambiar.</p>
                                                    </div>
                                                    <div className="form-body">
                                                        <Input type={"text"} text={"Nombre"} placeholder={"Ingrese su nombre"} change={setNombre} />
                                                        <Select text={"Especie"} change={setEspecie} options={["Perro", "Gato", "Pajaro", "Conejo"]} />
                                                        <Input type={"text"} text={"Raza"} placeholder={"Ingrese su raza/especie"} change={setRaza} />
                                                        <Input type={"number"} text={"Edad"} placeholder={"Ingrese su edad"} change={setEdad} />
                                                        <Select text={"Sexo"} change={setSexo} options={["F", "M"]} />
                                                        <Input type={"text"} text={"Descripción"} placeholder={"Describa a la mascota"} change={setDescripcion} />
                                                        <Input type={"file"} text={"Foto"} placeholder={"Ingrese una foto de su amiguito"} change={setFoto} />
                                                        <div className="characteristics-form-group">
                                                            <label>Caracteristicas</label>
                                                            <div className="characteristics-checkbox-grid">
                                                                {caracteristicas.map(car => (
                                                                    <div key={car.id_caracteristica} className="form-checkbox-item">
                                                                        <Checkbox text={car.descripcion} change={cambiarCaracteristicas} id={car.id_caracteristica} estaMarcado={carMascota.includes(car.id_caracteristica)} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="form-actions">
                                                            <Button text={"Editar mascota"} funcion={() => editar(pet.id_mascota)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-pet-container">
                    {listo && (
                        <Popup trigger={<button>Nueva mascota</button>} modal>
                            {close => (
                                <div className="modal-pet-form">
                                    <button className="close-modal" onClick={close}>×</button>
                                    <div className="form-header">
                                        <h2>Registrar mascota</h2>
                                        <p>Ingrese todos los campos para registrar a su nueva mascota.</p>
                                    </div>
                                    <div className="form-body">
                                        <Input type={"text"} text={"Nombre"} placeholder={"Ingrese su nombre"} change={setNombre} />
                                        <Select text={"Especie"} change={setEspecie} options={["Perro", "Gato", "Pajaro", "Conejo"]} />
                                        <Input type={"text"} text={"Raza"} placeholder={"Ingrese su raza/especie"} change={setRaza} />
                                        <Input type={"number"} text={"Edad"} placeholder={"Ingrese su edad"} change={setEdad} />
                                        <Select text={"Sexo"} change={setSexo} options={["F", "M"]} />
                                        <Input type={"text"} text={"Descripción"} placeholder={"Describa a la mascota"} change={setDescripcion} />
                                        <Input type={"file"} text={"Foto"} placeholder={"Ingrese una foto de su amiguito"} change={setFoto} />
                                        <div className="characteristics-form-group">
                                            <label>Caracteristicas</label>
                                            <div className="characteristics-checkbox-grid">
                                                {caracteristicas.map(car => (
                                                    <div key={car.id_caracteristica} className="form-checkbox-item">
                                                        <Checkbox text={car.descripcion} change={cambiarCaracteristicas} id={car.id_caracteristica} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <Button text={"Registrar mascota"} funcion={mascotaNueva} />
                                        </div>
                                        {errorRegistro && (<p className="error-message">{errorRegistro}</p>)}
                                    </div>
                                </div>
                            )}
                        </Popup>
                    )}
                </div>
            </div>
        </main>
    )
}
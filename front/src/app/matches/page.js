"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "@/main.css";

export default function MatchesPage() {
    const [mascotas, setMascotas] = useState([]);
    const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
    const [carPorMascota, setCarPorMascota] = useState([]);
    const [mascotaElegida, setMascotaElegida] = useState(null);
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState("");

    const [especie, setEspecie] = useState("");
    const [raza, setRaza] = useState("");
    const [edadMax, setEdadMax] = useState(null);
    const [edadMin, setEdadMin] = useState(null);
    const [sexo, setSexo] = useState("");
    const [carFiltro, setCarFiltro] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([]);

    const [listo, setListo] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id")

    useEffect(() => {
        cargarMascotas();
        cargarCaracteristicas();
        cargarMatches();
        setListo(true);
    }, []);
    const cargarMascotas = () => {
        fetch(`http://localhost:4000/mascotas/${id}/usuario`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
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
            })
    }
    const cargarMatches = () => {
        fetch(`http://localhost:4000/matches/${id}`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setMatches(data);
                }
            })
    }

    const cambiarCaracteristicas = (bool, id_car) => {
        id_car = Number(id_car);
        if (bool) {
            if (!carFiltro.includes(id_car)) {
                setCarFiltro([...carFiltro, id_car]);
            }
        } else {
            if (carFiltro.includes(id_car)) {
                setCarFiltro(carFiltro.filter(id => id !== id_car));
            }
        }
    }
    const guardarMatch = (bool) => {
        let datos = {id_pet: mascotaElegida.id_mascota, match: bool, id_user: id};
        fetch('http://localhost:4000/registerMatch', {
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
                    if (bool === true) {
                        let info = {id_user: id, id_refugio: mascotaElegida.id_refugio, id_pet: mascotaElegida.id_mascota, nom_refugio: mascotaElegida.nombre_refugio, nom_mascota: mascotaElegida.nombre};
                        fetch('http://localhost:4000/newChat', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                            body: JSON.stringify(info)
                        })
                            .then(res => res.json())
                            .then(rta => {
                                if (rta === -1) {
                                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                                }
                            })
                    }
                    cargarMatches();
                }
            });
    }

    useEffect(() => {
        if (mascotasFiltradas.length === 0) {
            setMascotaElegida(null);
        } else if(!mascotasFiltradas.includes(mascotaElegida)) {
            let indice = Math.floor(Math.random() * mascotasFiltradas.length);
            setMascotaElegida(mascotasFiltradas[indice]);
        }
    }, [mascotasFiltradas, mascotaElegida])

    useEffect(() => {
        let filtradas = mascotas.filter(pet => pet.estado === "Disponible")
        if (matches) {
            filtradas = (filtradas.filter(pet => 
                matches.every(match => match.id_mascota !== pet.id_mascota)
            ))
        }
        if (especie) {
            filtradas = filtradas.filter(pet => pet.especie === especie);
        }
        if (raza) {
            filtradas = filtradas.filter(pet => pet.raza === raza);
        }
        if (edadMax) {
            filtradas = filtradas.filter(pet => pet.edad <= Number(edadMax));  
        }
        if (edadMin) {
            filtradas = filtradas.filter(pet => pet.edad >= Number(edadMin));
        }
        if (sexo) {
            filtradas = filtradas.filter(pet => pet.sexo === sexo);
        }
        if (carFiltro) {
            filtradas = filtradas.filter(pet => 
                carFiltro.every((id_car) =>
                    carPorMascota.some((car) => car.id_mascota === pet.id_mascota && car.id_caracteristica === id_car)
                )
            );
        }
        setMascotasFiltradas(filtradas);
    }, [matches, especie, raza, edadMax, edadMin, sexo, carFiltro, mascotas])

    const cerrarSesion = () => {
        router.replace('/');
    }

    return(
        <main className="matches-main">
            <div className="matches-sidebar">
                <div className="sidebar-brand">
                    <img src="\logo-paws.png" className="logo-img"></img>
                    <h2>PetMatch</h2>
                </div>
                <div className="sidebar-menu">
                    <Button text={"Matches"} funcion={() => {router.push(`/matches?id=${id}`)}}></Button>
                    <Button text={"Chats"} funcion={() => {router.push(`/chats?id=${id}&tipo=usuario`)}}></Button>
                </div>
            </div>
            <div className="matches-body">
                {error && (<p className="error-message">{error}</p>)}
                <div className="matches-topbar">
                    <div className="topbar-titles">
                        <h1>Encontrá a tu compañero</h1>
                        <p>Deslizá y likeá para encontrar a tu amigo ideal</p>
                    </div>
                    {listo && (
                        <Popup trigger={<button>Cerrar Sesión</button>}>
                            <div className="popup-box">
                                <p>¿Estás seguro de que quieres cerrar sesión?</p>
                                <Button text={"Confirmar"} funcion={cerrarSesion}></Button>
                            </div>
                        </Popup>
                    )}
                </div>
                <div className="matches-filters">
                    <h4>Filtros</h4>
                    <Select text={"Especie"} change={setEspecie} options={["Perro", "Gato", "Pajaro", "Conejo"]}></Select>
                    <Input type={"text"} text={"Raza"} placeholder={"Ingrese la raza"} change={setRaza}></Input>
                    <Input type={"number"} text={"Edad máxima"} placeholder={"Ingrese la edad máxima"} change={setEdadMax}></Input>
                    <Input type={"number"} text={"Edad mínima"} placeholder={"Ingrese la edad mínima"} change={setEdadMin}></Input>
                    <Select text={"Sexo"} change={setSexo} options={["F", "M"]}></Select>
                    <label>Caracteristicas</label>
                    {listo && (
                        <Popup trigger={<button>Seleccionar...</button>}>
                            {caracteristicas.map(car => (
                                <div key={car.id_caracteristica} className="popup-check-item">
                                    <Checkbox id={car.id_caracteristica} text={car.descripcion} change={cambiarCaracteristicas}></Checkbox>
                                </div>
                            ))}
                        </Popup>
                    )}
                </div>
                <div className="pet-card">
                    {mascotaElegida ? (
                        <> <img src={`http://localhost:4000${mascotaElegida.foto}`} alt="Foto mascota" className="pet-card-img"></img>
                            <div className="pet-card-details">
                                <h3>{mascotaElegida.nombre}</h3>
                                <div className="pet-species-row">
                                    <img></img>
                                    <p>{mascotaElegida.especie} - {mascotaElegida.raza}</p>
                                </div>
                                <div className="pet-info-stack">
                                    <div className="pet-stat">
                                        <img></img>
                                        <p>{mascotaElegida.edad} años</p>
                                    </div>
                                    {mascotaElegida.sexo === "F" ? (
                                        <div className="pet-stat">
                                            <img></img>
                                            <p>Hembra</p>
                                        </div>
                                    ) : (
                                        <div className="pet-stat">
                                            <img></img>
                                            <p>Macho</p>
                                        </div>
                                    )}
                                    <p className="pet-desc">{mascotaElegida.descripcion}</p>
                                    <div className="pet-traits">
                                        <h4>Caracteristicas</h4>
                                        <ul>
                                            {carPorMascota.filter(car => car.id_mascota === mascotaElegida.id_mascota).map(car => (
                                                <li key={car.id_caracteristica}>{car.descripcion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="pet-shelter">{mascotaElegida.nombre_refugio}</p>
                                    <div className="pet-buttons">
                                        <Button text={"Pasar"} funcion={() => guardarMatch(false)}></Button>
                                        <Button text={"Me interesa"} funcion={() => guardarMatch(true)}></Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>No hay ninguna mascota disponible.</p>
                    )}
                </div>
            </div>
        </main>
    )
}
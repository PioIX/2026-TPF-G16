"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function MatchesPage() {
    const [mascotas, setMascotas] = useState([]);
    const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
    const [carPorMascota, setCarPorMascota] = useState([]);
    const [mascotaElegida, setMascotaElegida] = useState(null);
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState("");

    const [errorCierre, setErrorCierre] = useState("");

    const [especie, setEspecie] = useState("");
    const [raza, setRaza] = useState("");
    const [edadMax, setEdadMax] = useState(null);
    const [edadMin, setEdadMin] = useState(null);
    const [sexo, setSexo] = useState("");
    const [carFiltro, setCarFiltro] = useState("");
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [abierto, setAbierto] = useState(false);

    const router = useRouter();

    const cargarMascotas = () => {
        fetch('http://localhost:4000/mascotas')
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setMascotas(data);
                    setMascotasFiltradas(data);
                    cargarCarPorMascota();
                    cargarMascotaRandom();
                }
            })
    }
    const cargarCarPorMascota = () => {
        let datos = {mascotas: mascotas};
        fetch('http://localhost:4000/carPorMascota', {
            method: 'POST',
            body: datos
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
        fetch('http://localhost:4000/caracteristicas')
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
        fetch('http://localhost:4000/matches')
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    setMatches(data);
                }
            })
    }
    useEffect(() => {
        cargarMascotas();
        cargarCaracteristicas();
        cargarMatches();
    }, []);

    const cambiarCaracteristicas = (bool, id_car) => {
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
    const cargarMascotaRandom = () => {
        let indice = Math.floor(Math.random() * mascotasFiltradas.length);
        setMascotaElegida(mascotasFiltradas[indice]);
    }
    const guardarMatch = (bool) => {
        let datos = {id_pet: mascotaElegida.id_mascota, match: bool};
        fetch('http://localhost:4000/registerMatch', {
            method: 'POST',
            body: datos
        })
            .then(response => response.json())
            .then(data => {
                if (data === -1) {
                    setError("Ha ocurrido un error, intente denuevo más tarde.");
                } else {
                    if (bool === true) {
                        let info = {id_refugio: mascotaElegida.id_refugio, id_pet: mascotaElegida.id_mascota};
                        fetch('http://localhost:4000/newChat', {
                            method: 'POST',
                            body: info
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
        setMascotasFiltradas(mascotas.filter(pet => {pet.estado === "Disponible"}));
        if (matches) {
            setMascotasFiltradas(mascotas.filter(pet => {
                matches.every(match => match.id_mascota !== pet.id_mascota);
            }))
        }
        if (especie) {
            setMascotasFiltradas(mascotas.filter(pet => pet.especie === especie));
        }
        if (raza) {
            setMascotasFiltradas(mascotasFiltradas.filter(pet => pet.raza === raza));
        }
        if (edadMax) {
          setMascotasFiltradas(mascotasFiltradas.filter(pet => pet.edad <= Number(edadMax)));  
        }
        if (edadMin) {
            setMascotasFiltradas(mascotasFiltradas.filter(pet => pet.edad >= Number(edadMin)));
        }
        if (sexo) {
            setMascotasFiltradas(mascotasFiltradas.filter(pet => pet.sexo === sexo));
        }
        if (carFiltro) {
            setMascotasFiltradas(mascotasFiltradas.filter(pet => {
                carFiltro.every((id_car) => {
                    carPorMascota.some((car) => car.id_mascota === pet.id_mascota && car.id_caracteristica === id_car);
                })
            }));
        }
        if (!mascotasFiltradas.includes(mascotaElegida)) {
            cargarMascotaRandom();
        };
    }, [matches, especie, raza, edadMax, edadMin, sexo, carFiltro])

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

    return(
        <main>
            <div>
                <div>
                    <img></img>
                    <h2>PetMatch</h2>
                </div>
                <div>
                    <Button text={"Matches"} funcion={() => {router.push("/matches")}}></Button>
                    <Button text={"Chats"} funcion={() => {router.push("/chats")}}></Button>
                </div>
            </div>
            <div>
                <div>
                    <div>
                        <h1>Encontrá a tu compañero</h1>
                        <p>Deslizá y likeá para encontrar a tu amigo ideal</p>
                    </div>
                    <Popup trigger={<Button text={abierto ? "Volver" : "Cerrar Sesión"}></Button>}>
                        <div>
                            <p>¿Estás seguro de que quieres cerrar sesión?</p>
                            <Button text={"Confirmar"} funcion={cerrarSesion}></Button>
                            {errorCierre && (<p>{errorCierre}</p>)}
                        </div>
                    </Popup>
                </div>
                <div>
                    <h4>Filtros</h4>
                    <Select text={"Especie"} change={setEspecie} options={["Perro", "Gato", "Pajaro", "Conejo"]}></Select>
                    <Input type={"text"} text={"Raza"} placeholder={"Ingrese la raza"} change={setRaza}></Input>
                    <Input type={"number"} text={"Edad máxima"} placeholder={"Ingrese la edad máxima"} change={setEdadMax}></Input>
                    <Input type={"number"} text={"Edad mínima"} placeholder={"Ingrese la edad mínima"} change={setEdadMin}></Input>
                    <Select text={"Sexo"} change={setSexo} options={["F", "M"]}></Select>
                    <label>Caracteristicas</label>
                    <Popup trigger={<Button text={abierto ? "Cerrar" : "Seleccionar..."}></Button>} onOpen={() => setAbierto(true)} onClose={() => setAbierto(false)}>
                        {caracteristicas.map(car => (
                            <div>
                                <Checkbox id={car.id_caracteristica} text={car.descripcion} change={cambiarCaracteristicas}></Checkbox>
                            </div>
                        ))}
                    </Popup>
                </div>
                {error && (<p>{error}</p>)}
                <div>
                    <img src={`http://localhost:4000${mascotaElegida.foto}`} alt="Foto mascota"></img>
                    <div>
                        <h3>{mascotaElegida.nombre}</h3>
                        <div>
                            <img></img>
                            <p>{mascotaElegida.especie} - {mascotaElegida.raza}</p>
                        </div>
                        <div>
                            <div>
                                <img></img>
                                <p>{mascotaElegida.edad} años</p>
                            </div>
                            {mascotaElegida.sexo === "F" ? (
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
                            <p>{mascotaElegida.descripcion}</p>
                            <div>
                                <h4>Caracteristicas</h4>
                                <ul>
                                    {carPorMascota.filter(car => car.id_mascota === mascotaElegida.id_mascota).map(car => (
                                        <li key={car.id_caracteristica}>{car.descripcion}</li>
                                    ))}
                                </ul>
                            </div>
                            <p>{mascotaElegida.nombre_refugio}</p>
                            <div>
                                <Button text={"Pasar"} funcion={() => guardarMatch(false)}></Button>
                                <Button text={"Me interesa"} funcion={() => guardarMatch(true)}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
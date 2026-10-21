"use client"

import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import eslintConfig from "../../../eslint.config.mjs";

export default function MatchesPage() {
    const [mascotas, setMascotas] = useState([]);
    const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
    const [carPorMascota, setCarPorMascota] = useState([]);
    const [mascotaElegida, setMascotaElegida] = useState(null);

    const [confirmacion, setConfirmacion] = useState(false);
    const [errorCierre, setErrorCierre] = useState("");

    const [especie, setEspecie] = useState("");
    const [raza, setRaza] = useState("");
    const [edadMax, setEdadMax] = useState(null);
    const [edadMin, setEdadMin] = useState(null);
    const [sexo, setSexo] = useState("");
    const [caracteristica, setCaracteristica] = useState("");

    const router = useRouter();

    const cargarMascotas = () => {
        fetch('http://localhost:4000/mascotas')
            .then(response => response.json())
            .then(data => {
                setMascotas(data);
                setMascotasFiltradas(data);
                cargarCarPorMascota();
                cargarMascotaRandom();
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
    const cargarMascotaRandom = () => {
        let indice = Math.floor(Math.random() * mascotasFiltradas.length);
        setMascotaElegida(mascotasFiltradas[indice]);
    }
    useEffect(() => {
        cargarMascotas();
    }, []);

    useEffect(() => {
        console.log(especie, raza, edadMax, edadMin, sexo, caracteristica)
        if (especie) {
            setMascotasFiltradas(mascotas.filter(pet => pet.especie === especie));
        } else {
            setMascotasFiltradas(mascotas);
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
        if (!mascotasFiltradas.includes(mascotaElegida)) {
            cargarMascotaRandom();
        };
    }, [especie, raza, edadMax, edadMin, sexo, caracteristica])

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
                    <Button text={"Cerrar sesión"} funcion={() => {setConfirmacion(true)}}></Button>
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
                    <h4>Filtros</h4>
                    <Select text={"Especie"} change={setEspecie} options={["Perro", "Gato", "Pajaro", "Conejo"]}></Select>
                    <Input type={"text"} text={"Raza"} placeholder={"Ingrese la raza"} change={setRaza}></Input>
                    <Input type={"number"} text={"Edad máxima"} placeholder={"Ingrese la edad máxima"} change={setEdadMax}></Input>
                    <Input type={"number"} text={"Edad mínima"} placeholder={"Ingrese la edad mínima"} change={setEdadMin}></Input>
                    <Select text={"Sexo"} change={setSexo} options={["F", "M"]}></Select>
                </div>
                <div>
                    <img src={mascotaElegida.foto} alt="Foto mascota"></img>
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
                                <Button text={"Pasar"} funcion={x}></Button>
                                <Button text={"Me interesa"} funcion={x}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
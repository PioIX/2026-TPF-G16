"use client"

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
    const [mascotas, setMascotas] = useState([]);
    const [carPorMascota, setCarPorMascota] = useState([]);
    const [mascotaElegida, setMascotaElegida] = useState(null);

    const [confirmacion, setConfirmacion] = useState(false);
    const [errorCierre, setErrorCierre] = useState("");

    const router = useRouter();

    const cargarMascotas = () => {
        fetch('http://localhost:4000/mascotas')
            .then(response => response.json())
            .then(data => {
                setMascotas(data);
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
        let indice = Math.floor(Math.random() * mascotas.length);
        setMascotaElegida(mascotas[indice]);
    }
    useEffect(() => {
        cargarMascotas();
    }, []);

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
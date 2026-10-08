"use client"

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const usuario = () => {
    router.push("/login?user=usuario");
  }

  const refugio = () => {
    router.push("/login?user=refugio");
  }

  return(
    <main>
      <div>
        <div>
          <img></img>
          <h1>PetMatch</h1>
        </div>
        <p>Encontra una mascota que se adapte a vos</p>
      </div>
      <div>
        <h2>¿Cómo querés ingresar?</h2>
        <div>
          <Button text={"Entrar como usuario"} funcion={usuario}></Button>
          <Button text={"Entrar como refugio"} funcion={refugio}></Button>
        </div>
      </div>
    </main>
  )
}
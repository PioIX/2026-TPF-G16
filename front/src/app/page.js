"use client"

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import "@/main.css";
import "@/inicio.css";
export default function HomePage() {
  const router = useRouter();

  const usuario = () => {
    router.push("/login?user=usuario");
  }

  const refugio = () => {
    router.push("/login?user=refugio");
  }

  return (
    <main className="login-container">
      <div className="landing-header">
        <div className="logo-box">
          <img src="/logo-paws.png" alt="PetMatch Logo" className="logo-img" />
          <h1 className="landing-title">PetMatch</h1>
        </div>
        <p className="landing-subtitle">Encontra una mascota que se adapte a vos</p>
      </div>

      <div className="landing-card">
        <h2 className="select-title">¿Cómo querés ingresar?</h2>
        <div className="button-group">
          <Button text={"Entrar como usuario"} funcion={usuario}></Button>
          <Button text={"Entrar como refugio"} funcion={refugio}></Button>
        </div>
      </div>
    </main>
  );
}
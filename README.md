# 🐾 PetMatch

## 1. Descripción del proyecto

### Nombre de la aplicación

**PetMatch**

### Descripción general

PetMatch es una aplicación para adoptar mascotas. La plataforma permite que personas interesadas en adoptar puedan visualizar diferentes mascotas disponibles, aplicar filtros según sus preferencias y encontrar aquellas que puedan ser compatibles con ellas.

La aplicación tiene una dinámica similar a la de un tinder: el usuario puede visualizar mascotas y decidir si está interesado en adoptar alguna. Al indicar que está interesado en una mascota, se genera automáticamente un chat con el refugio, donde ambas partes pueden comunicarse y avanzar con el proceso de adopción.

Los refugios también cuentan con su propia cuenta dentro de la aplicación, desde la cual pueden administrar las conversaciones y, una vez concretada una adopción, registrarla en el sistema.

### Problemática o necesidad que aborda

Actualmente, la información sobre mascotas que necesitan un hogar puede encontrarse distribuida entre diferentes refugios, redes sociales y publicaciones. Esto puede dificultar que las personas interesadas en adoptar encuentren una mascota que se adapte a sus posibilidades y preferencias.

PetMatch busca centralizar esta información en una plataforma que permita encontrar mascotas de manera sencilla y establecer una comunicación directa entre los posibles adoptantes y los refugios.

### Público objetivo

La aplicación está dirigida principalmente a:

- Personas interesadas en adoptar una mascota.
- Refugios y organizaciones dedicadas al rescate y adopción de animales.
- Personas que buscan conocer mascotas disponibles para adopción de una manera organizada y sencilla.

### Objetivo general

Desarrollar una aplicación web que facilite el contacto entre personas interesadas en adoptar y refugios que tengan mascotas disponibles, permitiendo buscar mascotas y comunicarse mediante un sistema de chat en tiempo real.

---

## 2. Principales funcionalidades

### Usuarios

Los usuarios podrán:

- Registrarse en la aplicación.
- Iniciar sesión.
- Visualizar mascotas disponibles para adopción.
- Filtrar mascotas por:
  - Especie.
  - Raza.
  - Edad.
  - Sexo.
  - Características principales.
- Indicar que están interesados en una mascota.
- Consultar sus matches.
- Acceder a los chats iniciados a partir de sus matches.
- Enviar y recibir mensajes en tiempo real.

### Refugios

Los refugios podrán:

- Registrarse e iniciar sesión.
- Publicar mascotas disponibles para adopción.
- Registrar información de cada mascota.
- Asociar características a las mascotas.
- Recibir conversaciones iniciadas por personas interesadas.
- Responder mensajes en tiempo real.
- Eliminar una conversación cuando corresponda.
- Registrar una adopción cuando el proceso haya finalizado.

### Chats

Los chats permitirán la comunicación entre usuarios y refugios.

Se utilizará **WebSocket** para permitir que los mensajes sean recibidos en tiempo real, evitando la necesidad de recargar la página para visualizar nuevos mensajes.

Cuando el refugio:

- **Elimina la conversación:** el chat dejará de estar disponible.
- **Registra la adopción:** se registrará la adopción y la mascota dejará de estar disponible en el sistema.

---

## 3. Alcance

### Funcionalidades que serán desarrolladas

El proyecto incluirá:

- Registro e inicio de sesión de usuarios.
- Registro e inicio de sesión de refugios.
- Visualización de mascotas disponibles.
- Asociación de características a las mascotas.
- Sistema de filtros.
- Creación automática de chats al indicar interés.
- Sistema de mensajería.
- Comunicación mediante WebSocket.
- Visualización de chats activos.
- Registro de adopciones.

### Principales características esperadas del producto final

Al finalizar el proyecto se espera contar con una aplicación web funcional en la que:

- Un usuario pueda encontrar mascotas según diferentes criterios.
- El usuario pueda indicar interés por una mascota.
- El sistema pueda crear automáticamente una conversación con el refugio correspondiente.
- Los usuarios y refugios puedan comunicarse mediante mensajes en tiempo real.
- Una adopción pueda registrarse desde la cuenta del refugio.
- Una mascota adoptada deje de aparecer entre las mascotas disponibles.
- La información permanezca almacenada en la base de datos.

---

## 4. Diseño inicial

### Página de inicio / inicio de sesión

### Página de Matches

### Página de Chats

### Identidad visual

---

## 5. Modelo de datos

![DER de la aplicacion](./der-g16.drawio.png)

---

## 6. Planificación

| Objetivo | Tareas asociadas | Integrantes responsables | Fecha estimada de finalización | Objetivos parciales |
|---|---|---|---|---|
| Implementación de la base de datos | Crear las tablas y relaciones en MySQL | Carolina Casalderrey | 8/10 | |
| Registro e inicio de sesión | Implementar el registro e inicio de sesión de usuarios y refugios, junto a su cierre de sesión | Carolina Casalderrey | 14/10 | |
| Gestión de mascotas | Permitir que los refugios registren y administren las mascotas disponibles para adopción | Carolina Casalderrey | 14/10 | |
| Características de mascotas | Implementar la carga y asociación de características a las mascotas | Carolina Casalderrey | 15/10 | Primero |
| Página de Matches | Diseñar e implementar la visualización de mascotas disponibles | Delfina Ibañez | 21/10 | |
| Sistema de filtros | Implementar filtros por especie, raza, edad, sexo y características | Catalina Lazzati | 23/10 | |
| Sistema de Likes | Registrar respuesta del usuario y pasar a la siguiente mascota | Delfina Ibañez | 23/10 | |
| Creación de Chats | Crear automáticamente un chat entre el usuario y el refugio cuando se realiza un match | Delfina Ibañez | 26/10 | Segundo |
| Página de Chats | Diseñar e implementar la lista de conversaciones y la vista individual de cada chat | Catalina Lazzati | 29/10 | |
| WebSocket | Implementar la conexión en tiempo real y el envío y recepción de mensajes | Catalina Lazzati | 4/11 | |
| Mensajes | Mostrar los mensajes y distinguir si fueron enviados por el usuario o por el refugio | Catalina Lazzati | 6/11 | |
| Gestión de conversaciones | Permitir que el refugio elimine una conversación o avance con el proceso de adopción | Rosario Flores | 12/11 | |
| Actualización de mascotas | Eliminar a las mascotas del sistema si fueron adoptadas, y manejar la eliminación del chat si no | Rosario Flores | 16/11 | Tercero |
| Estilos | Ponerle los estilos a toda la pagina | Rosario Flores | 19/11 | |
| Pruebas | Probar registro, filtros, matches, chats, mensajes y adopciones | Catalina Lazzati, Carolina Casalderrey, Delfina Ibañez y Rosario Flores | 16/11 | |
| Corrección de errores | Solucionar errores encontrados durante las pruebas | Catalina Lazzati, Carolina Casalderrey, Delfina Ibañez y Rosario Flores | 19/11 | |
| Documentación | Completar README, DER, planificación y documentación del proyecto | Delfina Ibañez | 19/11 | |
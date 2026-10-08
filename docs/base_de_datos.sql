CREATE TABLE IF NOT EXISTS Usuarios(
id_usuario int auto_increment unique not null,
nombre varchar(255),
apellido varchar(255),
mail varchar(255),
contraseña varchar(255),
foto varchar(300),
PRIMARY KEY (id_usuario)
);

CREATE TABLE IF NOT EXISTS Refugios(
id_refugio int auto_increment unique not null,
nombre varchar(255),
mail varchar(255),
contraseña varchar(255),
foto varchar(300),
direccion varchar(255),
telefono int,
PRIMARY KEY (id_refugio)
);

CREATE TABLE IF NOT EXISTS Mascotas(
id_mascota int auto_increment unique not null,
nombre varchar(255),
especie varchar(255),
raza varchar(255),
edad int,
sexo varchar(1),
descripcion varchar(255),
foto varchar(300),
id_refugio int,
PRIMARY KEY (id_mascota),
FOREIGN KEY (id_refugio) REFERENCES Refugios(id_refugio)
);

CREATE TABLE IF NOT EXISTS Caracteristicas(
id_caracteristica int auto_increment unique not null,
descripcion varchar(255),
PRIMARY KEY (id_caracteristica)
);

CREATE TABLE IF NOT EXISTS MascotasxCaracteristicas(
id_mascota int,
id_caracteristica int,
FOREIGN KEY (id_mascota) REFERENCES Mascotas(id_mascota),
FOREIGN KEY (id_caracteristica) REFERENCES Caracteristicas(id_caracteristica)
);

CREATE TABLE IF NOT EXISTS Chats(
id_chat int auto_increment unique not null,
id_usuario int,
id_refugio int,
id_mascota int,
fecha_creacion date,
PRIMARY KEY (id_chat),
FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
FOREIGN KEY (id_refugio) REFERENCES Refugios(id_refugio),
FOREIGN KEY (id_mascota) REFERENCES Mascotas(id_mascota)
);

CREATE TABLE IF NOT EXISTS Mensajes(
id_mensaje int auto_increment unique not null,
id_chat int,
id_usuario int,
id_refugio int,
texto varchar(255),
fecha_envio datetime,
PRIMARY KEY (id_mensaje),
FOREIGN KEY (id_chat) REFERENCES Chats(id_chat),
FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
FOREIGN KEY (id_refugio) REFERENCES Refugios(id_refugio)
);
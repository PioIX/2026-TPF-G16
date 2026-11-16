const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io')
const { realizarQuery } = require('./modulos/mysql');
const session = require("express-session");

const app = express();
const server = http.createServer(app);

var port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));

const sessionMiddleware = session({
    secret: "porfaaprobanos",
    resave: false,
    saveUninitialized: false,
});
app.use(sessionMiddleware);

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});


// INICIO DE SESION
// login
app.post('/login', async function(req, res) {
    try {
        console.log(req.body);
        if (req.body.user === "usuario") {
            let id = await realizarQuery(`SELECT id_usuario FROM Usuarios WHERE mail = "${req.body.mail}" AND contraseña = "${req.body.password}"`);
            if (id.length === 0) {
                res.json(0);
            } else {
                req.session.user = id[0];
                req.session.tipo = "usuario";
                res.json(id[0]);
            }
        } else {
            let id = await realizarQuery(`SELECT id_refugio FROM Refugios WHERE mail = "${req.body.mail}" AND contraseña = "${req.body.password}"`);
            if (id.length === 0) {
                res.json(0)
            } else {
                req.session.user = id[0];
                req.session.tipo = "refugio";
                res.json(id[0]);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
//registro usuario
app.post('/registerUser', async function(req, res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Usuarios WHERE mail = "${req.body.mail}"`) ;
        if (existe.length > 0) {
            res.json(0);
        } else {
            await realizarQuery(`
                INSERT INTO Usuarios (nombre, apellido, mail, contraseña, foto) VALUES
                ("${req.body.nombre}","${req.body.apellido}","${req.body.mail}","${req.body.password}","${req.body.foto}");
            `);
            let id = await realizarQuery(`SELECT LAST_INSERT_ID()`);
            req.session.user = id[0];
            req.session.tipo = "usuario";
            res.json(id[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// registro refugio
app.post('/registerRef', async function(req, res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Refugios WHERE mail = "${req.body.mail}"`) ;
        if (existe.length > 0) {
            res.json(0);
        } else {
            await realizarQuery(`
                INSERT INTO Refugios (nombre, mail, contraseña, foto, direccion, telefono) VALUES
                ("${req.body.nombre}","${req.body.mail}","${req.body.password}","${req.body.foto}", "${req.body.direccion}", ${req.body.telefono});
            `);
            let id = await realizarQuery(`SELECT LAST_INSERT_ID()`);
            req.session.user = id[0];
            req.session.tipo = "refugio";
            res.json(id[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// cerrar sesion
app.get('/cierreSesion', async function(req, res) {
    try {
        console.log(req.body) ;
        delete req.session.user;
        delete req.session.tipo;
        res.json(0);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})

// MASCOTAS
// cargar mascotas
app.get('/mascotas', async function(req, res) {
    try {
        let respuesta;
        if (req.session.tipo === "refugio") {
            respuesta = await realizarQuery(`SELECT * FROM Mascotas WHERE id_refugio = ${req.session.user.id_refugio}`);
        } else {
            respuesta = await realizarQuery(`SELECT id_mascota, Mascotas.nombre, especie, raza, edad, sexo, descripcion, foto, estado, Refugios.nombre AS nombre_refugio, id_refugio FROM Mascotas INNER JOIN Refugios ON Mascotas.id_refugio = Refugios.id_refugio`);
        }
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// registro mascota
app.post('/registerPet', async function(req, res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Mascotas WHERE nombre = "${req.body.nombre}" AND id_refugio = ${req.session.user}`) ;
        if (existe.length > 0) {
            res.json(0);
        } else {
            await realizarQuery(`
                INSERT INTO Mascotas (nombre, especie, raza, edad, sexo, descripcion, foto, estado, id_refugio) VALUES
                ("${req.body.nombre}", "${req.body.especie}", "${req.body.raza}", ${req.body.edad}, "${req.body.sexo}", "${req.body.desc}", "${req.body.foto}", "Disponible", ${req.session.user});
            `);
            let id = await realizarQuery(`SELECT LAST_INSERT_ID()`);
            res.json(id[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// adoptar
app.put('/adoptar', async function(req, res) {
    try {
        console.log(req.body);
        const chats = await realizarQuery(`SELECT id_chat FROM Chats WHERE id_mascota = ${req.body.id_pet} AND id_usuario <> ${req.session.user}`);
        if (chats.length > 0) {
            for (let i = 0; i < chats.length; i++) {
                await realizarQuery(`INSERT INTO Mensajes (id_chat, id_refugio, texto, fecha_envio) VALUES
                    (${chats[i].id_chat}, ${req.session.id_refugio}, "${req.body.pet} ya ha sido adoptad@ por otra persona, te invitamos a buscar otra mascota por la que estes interesado", NOW())
                `);
            }
        }
        await realizarQuery(`INSERT INTO Mensajes (id_chat, id_refugio, texto, fecha_envio) VALUES
            (${req.body.id_chat}, ${req.session.id_refugio}, "Felicidades, hemos decidido aceptar tu adopción, ojalá disfrutes tu vida con ${req.body.pet}", NOW())
        `);
        await realizarQuery(`UPDATE Mascotas SET estado = "Adoptado" WHERE id_mascota = ${req.body.id_pet}`);
        res.json(0);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// eliminar chat
app.delete('/eliminarChat', async function(req, res) {
    try {
        console.log(req.body);
        await realizarQuery(`DELETE FROM Mensajes WHERE id_chat = ${req.body.id_chat}`);
        await realizarQuery(`DELETE FROM Chats WHERE id_chat = ${req.body.id_chat}`);
        res.json(0);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})

// CARACTERISTICAS
// cargar caracteristicas
app.get('/caracteristicas', async function(req, res) {
    try {
        let respuesta = await realizarQuery(`SELECT * FROM Caracteristicas`);
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// cargar caracteristicas por mascota
app.post('/carPorMascota', async function(req, res) {
    try {
        console.log(req.body);
        let respuesta = [];
        let pets = req.body.mascotas;
        for (let i = 0; i < pets.length; i++) {
            let rta = await realizarQuery(`SELECT MascotasxCaracteristicas.id_mascota, MascotasxCaracteristicas.id_caracteristica, Caracteristicas.descripcion FROM Caracteristicas INNER JOIN MascotasxCaracteristicas ON Caracteristicas.id_caracteristica = MascotasxCaracteristicas.id_caracteristica WHERE MascotasxCaracteristicas.id_mascota = ${pets[i].id_mascota}`);
            rta.forEach(registro => {
                respuesta.push(registro);
            })
        }
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// registro caracteristicas
app.post('/registerCar', async function(req, res) {
    try {
        console.log(req.body) ;
        const caracteristicas = req.body.car;
        for (const caracteristica of caracteristicas) {
            await realizarQuery(`
                INSERT INTO MascotasxCaracteristicas (id_mascota, id_caracteristica) VALUES
                (${req.body.id_pet}, ${caracteristica});
            `);
        }
        res.json(0);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})

// MATCHES
// cargar matches
app.get('/matches', async function(req, res) {
    try {
        let respuesta = await realizarQuery(`SELECT * FROM Matches WHERE id_usuario = ${req.session.user.id_usuario}`);
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// registro matche
app.post('/registerMatch', async function(req, res) {
    try {
        console.log(req.body) ;
        await realizarQuery(`
            INSERT INTO Matches (id_usuario, id_mascota, es_match) VALUES
            (${req.session.user.id_usuario}, ${req.body.id_pet}, ${req.body.match});
        `);
        res.json(0);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})

// CHATS
// cargar chats
app.get('/chats', async function(req, res) {
    try {
        let chats;
        if (req.session.tipo === "usuario") {
            chats = await realizarQuery(`SELECT Chats.id_chat, Chats.id_mascota, Mascotas.nombre AS nombrePrincipal, Mascotas.foto, Refugios.nombre AS nombreSecundario, MAX(Mensajes.fecha_envio) AS ultimoMsj FROM Chats INNER JOIN Mascotas ON Chats.id_mascota = Mascotas.id_mascota INNER JOIN Refugios ON Chats.id_refugio = Refugios.id_refugio INNNER JOIN Mensajes ON Chats.id_chat = Mensajes.id_chat WHERE id_usuario = ${req.session.user.id_usuario} GROUP BY Chats.id_chat ORDER BY MAX(Mensajes.fecha_envio) DESC`);
        } else {
            chats = await realizarQuery(`SELECT Chats.id_chat, Chats.id_mascota, Chats.id_usuario, Usuarios.nombre AS nombrePrincipal, Usuarios.foto, Mascotas.nombre AS nombreSecundario, MAX(Mensajes.fecha_envio) AS ultimoMsj FROM Chats INNER JOIN Usuarios ON Chats.id_usuario = Usuarios.id_usuario INNER JOIN Mascotas ON Chats.id_mascota = Mascotas.id_mascota INNER JOIN Mensajes ON Chats.id_chat = Mensajes.id_chat WHERE id_refugio = ${req.session.user.id_refugio} GROUP BY Chats.id_chat ORDER BY MAX(Mensajes.fecha_envio) DESC`);
        }
        let ultimoMsj;
        for (let i = 0; i < chats.length; i++) {
            ultimoMsj = await realizarQuery(`SELECT texto FROM Mensajes WHERE id_chat = ${chats[i].id_chat} ORDER BY fecha_envio DESC LIMIT 1`);
            chats[i].ultimoMsj = ultimoMsj[0];
        }
        res.json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})
// crear nuevo chat
app.post('/newChat', async function(req, res) {
    try {
        console.log(req.body) ;
        await realizarQuery(`
            INSERT INTO Chats (id_usuario, id_refugio, id_mascota, fecha_creacion) VALUES
            (${req.session.user.id_usuario}, ${req.body.user.id_refugio}, ${req.body.id_pet}, CURDATE());
        `);
        res.json(0);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})

// Mensajes
app.get('/mensajes/:id_chat', async function(req, res) {
    try {
        const id_chat = req.params.id_chat;
        let respuesta = await realizarQuery(`SELECT * FROM Mensajes WHERE id_chat = ${id_chat} ORDER BY fecha_envio ASC`);
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(500).json(-1);
    }
})



// WEB SOCKET
io.on('connection', function(socket){
    const req = socket.request;

    socket.on("joinRoom", (data) => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room);
        if (socket.data.room) {
            socket.leave(socket.data.room);
        };
        socket.data.room = data.room;
        socket.join(socket.data.room);
        socket.emit("userData", {
            user: req.session.user,
            type: req.session.tipo,
        });
    });

    socket.on("sendMessage", async (data) => {
        try {
            if (req.session.tipo === "usuario") {
                await realizarQuery(`INSERT INTO Mensajes (id_usuario, id_chat, texto, fecha_envio) VALUES (${req.session.user.id_usuario}, ${req.session.room}, "${data}", NOW())`);
            } else {
                await realizarQuery(`INSERT INTO Mensajes (id_refugio, id_chat, texto, fecha_envio) VALUES (${req.session.user.id_refugio}, ${req.session.room}, "${data}", NOW())`);
            }

            io.to(socket.data.room).emit("newMessage", {message: data});
        } catch (error) {
            console.log(error);
            res.status(500).json(-1);
        }
    });

    socket.on("disconnect", () => {
        console.log("Disconnect");
    });
})
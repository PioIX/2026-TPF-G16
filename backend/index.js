const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');
const session = require("express-session");

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});
const sessionMiddleware = session({
    secret: "porfaaprobanos",
    resave: false,
    saveUninitialized: false,
});
app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

var app = express();
var port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});


// INICIO DE SESION
// login
app.post('/login', async function(req, res) {
    try {
        console.log(req.body);
        if (tipoUser === "usuario") {
            let id = await realizarQuery(`SELECT id_usuario FROM Usuarios WHERE mail = "${req.body.mail}" AND contraseña = "${req.body.password}"`);
            if (id.length === 0) {
                res.send(0)
            } else {
                req.session.user = id[0];
                req.session.tipo = "usuario";
                res.json(id[0]);
            }
        } else {
            let id = await realizarQuery(`SELECT id_refugio FROM Refugios WHERE mail = "${req.body.mail}" AND contraseña = "${req.body.password}"`);
            if (id.length === 0) {
                res.send(0)
            } else {
                req.session.user = id[0];
                req.session.tipo = "refugio";
                res.json(id[0]);
            }
        }
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
//registro usuario
app.post('/registerUser', async function(req, res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Usuarios WHERE mail = "${req.body.mail}"`) ;
        if (existe.length > 0) {
            res.send(0);
        } else {
            realizarQuery(`
                INSERT INTO Usuarios (nombre, apellido, mail, contraseña, foto) VALUES
                ("${req.body.nombre}","${req.body.apellido}","${req.body.mail}","${req.body.password}","${req.body.foto}");
            `);
            let id = await realizarQuery(`SELECT LAST_INSERT_ID()`);
            req.session.user = id[0];
            req.session.tipo = "usuario";
            res.json(id[0]);
        }
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
// registro refugio
app.post('/registerRef', async function(req, res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Refugios WHERE mail = "${req.body.mail}"`) ;
        if (existe.length > 0) {
            res.send(0);
        } else {
            realizarQuery(`
                INSERT INTO Refugios (nombre, mail, contraseña, foto, direccion, telefono) VALUES
                ("${req.body.nombre}","${req.body.mail}","${req.body.password}","${req.body.foto}", "${req.body.direccion}", ${req.body.telefono});
            `);
            let id = await realizarQuery(`SELECT LAST_INSERT_ID()`);
            req.session.user = id[0];
            req.session.tipo = "refugio";
            res.json(id[0]);
        }
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
// cerrar sesion
app.get('/cierreSesion', async function(req, res) {
    try {
        console.log(req.body) ;
        delete req.session.user;
        delete req.session.tipo;
        res.send(0);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})

// MASCOTAS
// cargar mascotas
app.get('/mascotas', async function(req, res) {
    try {
        let respuesta;
        if (req.session.user.id_refugio) {
            respuesta = await realizarQuery(`SELECT * FROM Mascotas WHERE id_refugio = ${req.session.user.id_refugio}`);
        } else {
            respuesta = await realizarQuery(`SELECT id_mascota, Mascotas.nombre, especie, raza, edad, sexo, descripcion, foto, Refugios.nombre AS nombre_refugio, id_refugio FROM Mascotas INNER JOIN Refugios ON Mascotas.id_refugio = Refugios.id_refugio`);
        }
        res.json(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
// registro mascota
app.post('/registerPet', async function(req, res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Mascotas WHERE nombre = "${req.body.nombre}" AND id_refugio = ${req.session.user.id_refugio}`) ;
        if (existe.length > 0) {
            res.send(0);
        } else {
            await realizarQuery(`
                INSERT INTO Mascotas (nombre, especie, raza, edad, sexo, desc, foto) VALUES
                ("${req.body.nombre}", "${req.body.especie}", "${req.body.raza}", ${req.body.edad}, "${req.body.sexo}", "${req.body.desc}", "${req.body.foto}");
            `);
            let id = await realizarQuery(`SELECT LAST_INSERT_ID()`);
            res.json(id[0]);
        }
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})

// CARACTERISTICAS
// cargar caracteristicas
app.get('/caracteristicas', async function(req, res) {
    try {
        let respuesta = await realizarQuery(`SELECT * FROM Caracteristicas`);
        res.json(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
// cargar caracteristicas por mascota
app.post('/carPorMascota', async function(req, res) {
    try {
        console.log(req.body);
        let respuesta = [];
        let pets = req.body.mascotas;
        pets.forEach (async pet => {
            let rta = await realizarQuery(`SELECT id_mascota, id_caracteristica, Caracteristicas.descripcion FROM Caracteristicas INNER JOIN MascotasxCaracteristicas ON Caracteristicas.id_caracteristica = Mascotas.id_caracteristica WHERE id_mascota = ${pet.id_mascota}`);
            rta.forEach(registro => {
                respuesta.push(registro);
            })
        })
        res.json(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
// registro caracteristicas
app.post('/registerCar', async function(req, res) {
    try {
        console.log(req.body) ;
        const caracteristicas = req.body.car;
        for (const caracteristica of caracteristicas) {
            realizarQuery(`
                INSERT INTO MascotasxCaracteristicas (id_mascota, id_caracteristica) VALUES
                (${req.body.id_pet}, ${caracteristica});
            `);
        }
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})

// MATCHES
// cargar matches
app.get('/matches', async function(req, res) {
    try {
        let respuesta = await realizarQuery(`SELECT * FROM Matches WHERE id_usuario = ${req.session.user.id_usuario}`);
        res.json(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
// registro matche
app.post('/registerMatch', async function(req, res) {
    try {
        console.log(req.body) ;
        realizarQuery(`
            INSERT INTO Matches (id_usuario, id_mascota, es_match) VALUES
            (${req.session.user.id_usuario}, ${req.body.id_pet}, ${req.body.match});
        `);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
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
            chats = await realizarQuery(`SELECT Chats.id_chat, Chats.id_mascota, Usuarios.nombre AS nombrePrincipal, Usuarios.foto, Mascotas.nombre AS nombreSecundario, MAX(Mensajes.fecha_envio) AS ultimoMsj FROM Chats INNER JOIN Usuarios ON Chats.id_usuario = Usuarios.id_usuario INNER JOIN Mascotas ON Chats.id_mascota = Mascotas.id_mascota INNNER JOIN Mensajes ON Chats.id_chat = Mensajes.id_chat WHERE id_refugio = ${req.session.user.id_refugio} GROUP BY Chats.id_chat ORDER BY MAX(Mensajes.fecha_envio) DESC`);
        }
        let ultimoMsj;
        for (let i = 0; i < chats.length; i++) {
            ultimoMsj = await realizarQuery(`SELECT texto FROM Mensajes WHERE id_chat = ${chats[i].id_chat} ORDER BY fecha_envio DESC LIMIT 1`);
            chats[i].ultimoMsj = ultimoMsj[0];
        }
        res.json(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
// crear nuevo chat
app.post('/newChat', async function(req, res) {
    try {
        console.log(req.body) ;
        realizarQuery(`
            INSERT INTO Chats (id_usuario, id_refugio, id_mascota, fecha_creacion) VALUES
            (${req.session.user.id_usuario}, ${req.body.user.id_refugio}, ${req.body.id_pet}, CURDATE());
        `);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})

// Mensajes
app.get('/mensajes', async function(req, res) {
    try {
        let respuesta = await realizarQuery(`SELECT * FROM Mensajes WHERE id_chat = ${req.params.id_chat} ORDER BY fecha_envio ASC`);
        res.json(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})



// WEB SOCKET
io.on('connection', function(socket){
    const req = socket.request;

    socket.on("joinRoom", (data) => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room);
        if (req.session.room != undefined && req.session.room.length > 0) {
            socket.leave(req.session.room);
            req.session.room = data.room;
            socket.join(req.session.room);
        };
        io.emit("userData", {
            user: req.session.user,
            type: req.session.tipo,
        });
    });

    socket.on("sendMessage", async (data) => {
        try {
            if (req.session.tipo = "usuario") {
                await realizarQuery(`INSERT INTO Mensajes (id_usuario, id_chat, texto, fecha_envio) VALUES (${req.session.user.id_usuario}, ${req.session.room}, "${data}", NOW())`);
            } else {
                await realizarQuery(`INSERT INTO Mensajes (id_refugio, id_chat, texto, fecha_envio) VALUES (${req.session.user.id_refugio}, ${req.session.room}, "${data}", NOW())`);
            }

            io.to(req.session.room).emit("newMessage", {message: data});
        } catch (error) {
            res.status(500).send('Ha ocurrido un error, intentar más tarde');
            res.send(-1);
        }
    });

    socket.on("disconnect", () => {
        console.log("Disconnect");
    });
})
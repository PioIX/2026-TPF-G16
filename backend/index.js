var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');
const session = require("express-session");

const sessionMiddleware = session({
    secret: "aprobanosporfa",
    resave: false,
    saveUninitialized: false,
});
app.use(sessionMiddleware);

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
                req.session.id_usuario = id[0];
                req.session.tipo = "usuario";
                res.json(id[0]);
            }
        } else {
            let id = await realizarQuery(`SELECT id_refugio FROM Refugios WHERE mail = "${req.body.mail}" AND contraseña = "${req.body.password}"`);
            if (id.length === 0) {
                res.send(0)
            } else {
                req.session.id_refugio = id[0];
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
            req.session.id_usuario = id[0];
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
            req.session.id_refugio = id[0];
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
        if (req.session.tipo === "usuario") {
            delete req.session.id_usuario;
        } else {
            delete req.session.id_refugio;
        }
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
        if (req.session.id_refugio) {
            respuesta = await realizarQuery(`SELECT * FROM Mascotas WHERE id_refugio = ${req.session.id_refugio}`);
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
        let existe = await realizarQuery(`SELECT * FROM Mascotas WHERE nombre = "${req.body.nombre}" AND id_refugio = ${req.session.id_refugio}`) ;
        if (existe.length > 0) {
            res.send(0);
        } else {
            realizarQuery(`
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
        let respuesta = await realizarQuery(`SELECT * FROM Matches WHERE id_usuario = ${req.session.id_usuario}`);
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
            (${req.session.id_usuario}, ${req.body.id_pet}, ${req.body.match});
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
        let respuesta;
        if (req.session.tipo === "usuario") {
            respuesta = await realizarQuery(`SELECT Chats.id_chat, Chats.id_mascota, Mascotas.nombre AS nombre_pet, Mascotas.foto FROM Chats INNER JOIN Mascotas ON Chats.id_mascota = Mascotas.id_mascota INNNER JOIN Mensajes ON Chats.id_chat = Mensajes.id_chat WHERE id_usuario = ${req.session.id_usuario} GROUP BY Chats.id_chat ORDER BY MAX(Mensajes.fecha_envio) DESC`);
        } else {
            respuesta = await realizarQuery(`SELECT Chats.id_chat, Chats.id_mascota, Usuarios.nombre, Usuarios.foto FROM Chats INNER JOIN Usuarios ON Chats.id_usuario = Usuarios.id_usuario INNNER JOIN Mensajes ON Chats.id_chat = Mensajes.id_chat WHERE id_refugio = ${req.session.id_refugio} GROUP BY Chats.id_chat ORDER BY MAX(Mensajes.fecha_envio) DESC`);
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
            (${req.session.id_usuario}, ${req.body.id_refugio}, ${req.body.id_pet}, CURDATE());
        `);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        res.send(-1);
    }
})
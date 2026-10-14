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

// cargar caracteristicas

// registro caracteristicas
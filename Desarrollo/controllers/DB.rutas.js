const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Estudiante = require('./Models/estudiante');
const Buzon = require('./Models/buzon');
const Chat = require('./Models/chat');
const crypto = require("crypto");


// Estudiantes
router.post('/database/estudiantes', async (req, res) => {
    try {
        const { Nombre, Apellidos, Matricula,Tutor, Correo, Carrera, Grupo, Password } = req.body;
        let regexPass = /^[a-zA-Z0-9!#$%&\/?\\¿¡+*~{[^`},;.:-_-]+$/;
        let regexUser = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        let regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexUser.test(Nombre) || !regexUser.test(Apellidos)) {
            return res.status(400).json({ message: 'Nombre o Apellidos contienen caracteres no permitidos' });
        }
        if (!regexCorreo.test(Correo)) {
            return res.status(400).json({ message: 'El correo electrónico no es válido' });
        }
        if (!regexPass.test(Password)) {
            return res.status(400).json({ message: 'La contraseña contiene caracteres no permitidos' });
        }
        let hash = crypto.createHash('sha1');
        let data = hash.update(Password, 'utf-8');
        let gen_hash = data.digest('hex');
        const estudiante = new Estudiante({
            nombre: Nombre,
            apellidos: Apellidos,
            matricula: Matricula,
            grupo: Grupo,
            tutor: Tutor,
            correo: Correo,
            carrera: Carrera,
            matricula: Matricula,
            password: gen_hash,           
            resetPasswordExpires: undefined,
            resetPasswordToken: undefined
        });
        const nuevoEstudiante = await estudiante.save();
        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        if (error.code === 11000) {
            const campoDuplicado = Object.keys(error.keyPattern)[0];
            res.status(400).json({ message: `El campo ${campoDuplicado} ya está registrado` });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

router.post('/database/login', async (req, res) => {
    try {
        const { Correo, Password } = req.body;
        let regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexCorreo.test(Correo)) {
            return res.status(400).json({ message: 'El correo electrónico no es válido' });
        }
        const estudiante = await Estudiante.findOne({ correo: Correo });
        if (!estudiante) {
            return res.status(404).json({ message: 'Correo electrónico no encontrado' });
        }
        let hash = crypto.createHash('sha1');
        let data = hash.update(Password, 'utf-8');
        let gen_hash = data.digest('hex');
        if (gen_hash !== estudiante.password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        //res.status(200).json( estudiante );
        return res.render("Perfil",estudiante)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/database/buzon', async (req, res) => {
    try {
        const { Nombre, Correo, Asunto, Mensaje } = req.body;
        const buzon = new Buzon({
            nombre: Nombre,
            correo: Correo,
            asunto: Asunto,
            mensaje: Mensaje,
        });
        const nuevoBuzon = await buzon.save();
        res.status(201).json(nuevoBuzon);
    } catch (error) {
        if (error.code === 11000) {
            const campoDuplicado = Object.keys(error.keyPattern)[0];
            res.status(400).json({ message: `El campo ${campoDuplicado} ya está registrado` });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

router.post('/database/chat', async (req, res) => {
    try {
        const { Usuario,Mensaje } = req.body;
        const chat = new Chat({
            usuario: Usuario,
            mensaje: Mensaje,
        });
        const nuevoChat = await chat.save();
        res.status(201).json(nuevoChat);
        return res.render("Chat",chat)
    } catch (error) {
        if (error.code === 11000) {
            const campoDuplicado = Object.keys(error.keyPattern)[0];
            res.status(400).json({ message: `El campo ${campoDuplicado} ya está registrado` });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});


router.get('/database/chatgrupals', async (req, res) => {
    try {
        const collection = db.collection('chatgrupals');
        const datos = await collection.find({}).toArray();
        res.status(200).json(datos);
    } catch (err) {
        res.status(500).json({ error: 'Ocurrió un error al obtener los datos' });
    }
});
module.exports = router;
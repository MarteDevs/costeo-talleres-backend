import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Función para REGISTRAR un usuario ---
export const register = async (req, res) => {
    try {
        const { nombre_usuario, email, contrasena } = req.body;

        // Validar que los datos llegaron
        if (!nombre_usuario || !email || !contrasena) {
            return res.status(400).json({ message: 'Por favor, ingrese todos los campos.' });
        }

        // Verificar si el usuario ya existe
        const [userExists] = await pool.query('SELECT * FROM Usuarios WHERE nombre_usuario = ? OR email = ?', [nombre_usuario, email]);

        if (userExists.length > 0) {
            return res.status(409).json({ message: 'El nombre de usuario o el email ya están registrados.' });
        }

        // Hashear (encriptar) la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // Guardar el nuevo usuario en la base de datos
        await pool.query('INSERT INTO Usuarios (nombre_usuario, email, contrasena) VALUES (?, ?, ?)', [nombre_usuario, email, hashedPassword]);

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};


// --- Función para INICIAR SESIÓN (LOGIN) ---
export const login = async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;

        // Validar que los datos llegaron
        if (!nombre_usuario || !contrasena) {
            return res.status(400).json({ message: 'Por favor, ingrese todos los campos.' });
        }

        // Buscar al usuario en la base de datos
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' }); // Mensaje genérico por seguridad
        }

        // Comparar la contraseña enviada con la hasheada en la BD
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        // Si las credenciales son correctas, crear el Token JWT
        const payload = {
            id_usuario: user.id_usuario,
            nombre_usuario: user.nombre_usuario
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' // El token expirará en 1 hora
        });

        res.json({
            message: 'Inicio de sesión exitoso.',
            token: token
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};
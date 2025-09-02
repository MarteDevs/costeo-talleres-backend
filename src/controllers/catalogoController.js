import pool from '../config/database.js';

// --- Obtener todas las Zonas de Trabajo ---
export const getZonas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Zonas_Trabajo ORDER BY nombre_zona ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener zonas de trabajo:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// --- Obtener todos los Equipos ---
export const getEquipos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Equipos ORDER BY nombre_equipo ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// --- Obtener todos los Talleres ---
export const getTalleres = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Talleres ORDER BY nombre_taller ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener talleres:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};
import pool from '../config/database.js';

// --- Función para CREAR un nuevo costeo ---
export const createCosteo = async (req, res) => {
    try {
        const {
            fecha, nombre_trabajo, dias_trabajados, cantidad,
            fk_id_taller, fk_id_zona, fk_id_equipo,
            costo_planilla, costo_local, costo_vigilancia, costo_energia, costo_herramientas_fijo,
            costo_material, costo_epp, costo_petroleo, costo_gasolina, costo_topezo, costo_equipo_otros_variable,
            margen_ganancia // El margen viene del frontend
        } = req.body;

        const fk_id_usuario = req.user.id_usuario; // Obtenido del token

        // --- Cálculos en el Backend (¡Muy importante!) ---
        const total_costo_fijo = parseFloat(costo_planilla || 0) + parseFloat(costo_local || 0) + parseFloat(costo_vigilancia || 0) + parseFloat(costo_energia || 0) + parseFloat(costo_herramientas_fijo || 0);
        const total_costo_variable = parseFloat(costo_material || 0) + parseFloat(costo_epp || 0) + parseFloat(costo_petroleo || 0) + parseFloat(costo_gasolina || 0) + parseFloat(costo_topezo || 0) + parseFloat(costo_equipo_otros_variable || 0);
        const total_costo_directo = total_costo_fijo + total_costo_variable;
        const total_costo_servicio = total_costo_directo * (1 + parseFloat(margen_ganancia || 0) / 100);
        const costo_unitario = cantidad > 0 ? total_costo_servicio / cantidad : 0;
        const punto_equilibrio = total_costo_fijo / (1 - (total_costo_variable / total_costo_servicio || 1));

        const newCosteo = {
            fecha, nombre_trabajo, dias_trabajados, cantidad,
            fk_id_taller, fk_id_zona, fk_id_equipo, fk_id_usuario,
            costo_planilla, costo_local, costo_vigilancia, costo_energia, costo_herramientas_fijo,
            costo_material, costo_epp, costo_petroleo, costo_gasolina, costo_topezo, costo_equipo_otros_variable,
            total_costo_fijo, total_costo_variable, total_costo_directo, total_costo_servicio,
            costo_unitario, margen_ganancia, punto_equilibrio
        };

        const [result] = await pool.query('INSERT INTO Costeos SET ?', [newCosteo]);

        res.status(201).json({ message: 'Costeo creado exitosamente.', id: result.insertId });

    } catch (error) {
        console.error('Error al crear costeo:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// --- Función para LEER todos los costeos (con filtros) ---
export const getCosteos = async (req, res) => {
    try {
        const { taller, equipo, zona } = req.query;
        let query = `
            SELECT c.*, z.nombre_zona, e.nombre_equipo, t.nombre_taller
            FROM Costeos c
            LEFT JOIN Zonas_Trabajo z ON c.fk_id_zona = z.id_zona
            LEFT JOIN Equipos e ON c.fk_id_equipo = e.id_equipo
            LEFT JOIN Talleres t ON c.fk_id_taller = t.id_taller
        `;
        const params = [];
        let conditions = [];

        if (taller) {
            conditions.push('c.fk_id_taller = ?');
            params.push(taller);
        }
        if (equipo) {
            conditions.push('c.fk_id_equipo = ?');
            params.push(equipo);
        }
        if (zona) {
            conditions.push('c.fk_id_zona = ?');
            params.push(zona);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY c.fecha DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);

    } catch (error) {
        console.error('Error al obtener costeos:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// --- Función para LEER un costeo por ID ---
export const getCosteoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Costeos WHERE id_costeo = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Costeo no encontrado.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener costeo por ID:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// --- Función para ACTUALIZAR un costeo ---
export const updateCosteo = async (req, res) => {
    try {
        const { id } = req.params;
        // Reutilizamos la misma lógica de cálculo que en la creación
        const {
            fecha, nombre_trabajo, dias_trabajados, cantidad,
            fk_id_taller, fk_id_zona, fk_id_equipo,
            costo_planilla, costo_local, costo_vigilancia, costo_energia, costo_herramientas_fijo,
            costo_material, costo_epp, costo_petroleo, costo_gasolina, costo_topezo, costo_equipo_otros_variable,
            margen_ganancia
        } = req.body;
        
        const total_costo_fijo = parseFloat(costo_planilla || 0) + parseFloat(costo_local || 0) + parseFloat(costo_vigilancia || 0) + parseFloat(costo_energia || 0) + parseFloat(costo_herramientas_fijo || 0);
        const total_costo_variable = parseFloat(costo_material || 0) + parseFloat(costo_epp || 0) + parseFloat(costo_petroleo || 0) + parseFloat(costo_gasolina || 0) + parseFloat(costo_topezo || 0) + parseFloat(costo_equipo_otros_variable || 0);
        const total_costo_directo = total_costo_fijo + total_costo_variable;
        const total_costo_servicio = total_costo_directo * (1 + parseFloat(margen_ganancia || 0) / 100);
        const costo_unitario = cantidad > 0 ? total_costo_servicio / cantidad : 0;
        const punto_equilibrio = total_costo_fijo / (1 - (total_costo_variable / total_costo_servicio || 1));

        const updatedCosteo = {
            fecha, nombre_trabajo, dias_trabajados, cantidad,
            fk_id_taller, fk_id_zona, fk_id_equipo,
            costo_planilla, costo_local, costo_vigilancia, costo_energia, costo_herramientas_fijo,
            costo_material, costo_epp, costo_petroleo, costo_gasolina, costo_topezo, costo_equipo_otros_variable,
            total_costo_fijo, total_costo_variable, total_costo_directo, total_costo_servicio,
            costo_unitario, margen_ganancia, punto_equilibrio
        };

        const [result] = await pool.query('UPDATE Costeos SET ? WHERE id_costeo = ?', [updatedCosteo, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Costeo no encontrado.' });
        }
        res.json({ message: 'Costeo actualizado exitosamente.' });

    } catch (error) {
        console.error('Error al actualizar costeo:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// --- Función para BORRAR un costeo ---
export const deleteCosteo = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Costeos WHERE id_costeo = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Costeo no encontrado.' });
        }
        res.json({ message: 'Costeo eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar costeo:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};
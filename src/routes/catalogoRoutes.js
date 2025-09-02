import { Router } from 'express';
import { getZonas, getEquipos, getTalleres } from '../controllers/catalogoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Aplicamos el middleware de autenticación a todas las rutas de este archivo
router.use(authMiddleware);

// Ruta para obtener todas las zonas de trabajo
// GET /api/catalogos/zonas
router.get('/zonas', getZonas);

// Ruta para obtener todos los equipos
// GET /api/catalogos/equipos
router.get('/equipos', getEquipos);

// Ruta para obtener todos los talleres
// GET /api/catalogos/talleres
router.get('/talleres', getTalleres);

export default router;
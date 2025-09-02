import { Router } from 'express';
import {
    createCosteo,
    getCosteos,
    getCosteoById,
    updateCosteo,
    deleteCosteo
} from '../controllers/costeoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Aplicamos el middleware a todas las rutas de este archivo
router.use(authMiddleware);

// --- Definición de las rutas del CRUD ---

// CREAR un nuevo costeo
// POST /api/costeos
router.post('/', createCosteo);

// LEER todos los costeos (con filtros opcionales)
// GET /api/costeos
router.get('/', getCosteos);

// LEER un costeo específico por su ID
// GET /api/costeos/:id
router.get('/:id', getCosteoById);

// ACTUALIZAR un costeo existente
// PUT /api/costeos/:id
router.put('/:id', updateCosteo);

// BORRAR un costeo
// DELETE /api/costeos/:id
router.delete('/:id', deleteCosteo);

export default router;
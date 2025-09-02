import express from 'express';
import cors from 'cors';

// Importar las rutas
import authRoutes from './routes/authRoutes.js';
import catalogoRoutes from './routes/catalogoRoutes.js';
import costeoRoutes from './routes/costeoRoutes.js';
const app = express();

// Middlewares
app.use(cors()); // Permite la comunicación entre el frontend y el backend
app.use(express.json()); // Permite al servidor entender JSON que se envía en las solicitudes

// Ruta de bienvenida para probar que el servidor funciona
app.get('/', (req, res) => {
    res.send('✅ API de Costeos funcionando!');
});

// Usar las rutas (las activaremos más adelante)
 app.use('/api/auth', authRoutes);
 app.use('/api/catalogos', catalogoRoutes);
 app.use('/api/costeos', costeoRoutes);

export default app;
import app from './app.js';
import pool from './config/database.js'; // Importamos el pool para asegurar que la verificación se ejecute

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
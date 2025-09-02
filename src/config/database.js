import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables de entorno del archivo .env
dotenv.config();

// Configurar el pool de conexiones usando las variables de entorno
const pool = createPool({
    host: process.env.MYSQLHOST, // Usa el nombre de la variable de Railway
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para verificar la conexión
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a la base de datos exitosa.');
        connection.release(); // Liberar la conexión
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
    }
}

// Llama a la función para verificar al iniciar
checkConnection();

export default pool;

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Buscar el token en los headers de la solicitud
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Añadir los datos del usuario decodificados a la solicitud
        req.user = decoded; 
        
        // Permitir que la solicitud continúe hacia el controlador
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token no válido o expirado.' });
    }
};

export default authMiddleware;
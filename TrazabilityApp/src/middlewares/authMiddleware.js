import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(403).json({ message: 'Token no válido' });
  }
};

export default authenticate;

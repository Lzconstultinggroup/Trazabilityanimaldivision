import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { fullName, email, dni, phoneNumber, username, password, role } = req.body;
    const photo = req.file?.filename;

    const newUser = new User({ fullName, email, dni, phoneNumber, username, password, role, photo });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        dni: user.dni,
        phoneNumber: user.phoneNumber,
        photo: user.photo,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

export default {
  register,
  login
};

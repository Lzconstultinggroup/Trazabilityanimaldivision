import User from '../models/User.js';

const createWorker = async (req, res) => {
  try {
    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden crear trabajadores' });
    }

    const {
      fullName,
      email,
      dni,
      phoneNumber,
      username,
      password,
      confirmPassword,
      role,
    } = req.body;

    if (!['professional', 'operator', 'thermal_operator'].includes(role)) {
      return res.status(400).json({ message: 'El rol debe ser professional, operator o thermal_operator' });
    }
    

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const photo = req.file ? req.file.path : '';

    const newUser = new User({
      fullName,
      email,
      dni,
      phoneNumber,
      photo,
      username,
      password,
      role,
      adminId: admin._id
    });

    await newUser.save();

    res.status(201).json({
      message: 'Trabajador creado correctamente',
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        dni: newUser.dni,
        phoneNumber: newUser.phoneNumber,
        username: newUser.username,
        role: newUser.role,
        photo: newUser.photo,
        adminId: newUser.adminId
      }
    });
  } catch (error) {
    console.error('Error al crear trabajador:', error);
    res.status(500).json({ message: 'Error en la creación del trabajador' });
  }
};

const getMyWorkers = async (req, res) => {
  try {
    const adminId = req.user._id;

    const workers = await User.find({ adminId }).select('-password');

    res.status(200).json(workers);
  } catch (err) {
    console.error('Error al obtener trabajadores:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export default {
  createWorker,
  getMyWorkers
};

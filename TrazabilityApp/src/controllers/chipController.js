import Chip from '../models/Chip.js';
import Lote from '../models/Lote.js';

const registerChip = async (req, res) => {
  try {
    const { uid, loteId } = req.body;
    const userId = req.user.id;

    if (!uid || !loteId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar existencia de lote
    const lote = await Lote.findById(loteId);
    if (!lote) return res.status(404).json({ error: 'Lote no encontrado' });
    if (lote.status === 'completo') return res.status(400).json({ error: 'Este lote ya está completo' });

    // Verificar si el chip ya existe
    const existing = await Chip.findOne({ uid });
    if (existing) return res.status(409).json({ error: 'Este chip ya está registrado' });

    // Contar cuántos chips tiene ese lote
    const count = await Chip.countDocuments({ loteId });

    const nombre = `vaca ${String(count + 1).padStart(2, '0')}`;

    const newChip = await Chip.create({
      uid,
      name: nombre,
      loteId,
      adminId: lote.adminId, // quien creó el lote
      fechaRegistro: new Date()
    });

    // Si se llenó el lote, marcarlo como completo
    if (count + 1 >= lote.maxVacas) {
      lote.status = 'completo';
      await lote.save();
      // (Opcional) Enviar notificación al admin aquí
    }

    res.status(201).json(newChip);
  } catch (error) {
    console.error('Error al registrar chip:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



const getMyChips = async (req, res) => {
  try {
    const chips = await Chip.find({ owner: req.user._id });
    res.status(200).json(chips);
  } catch (err) {
    console.error('Error al obtener chips del usuario:', err);
    res.status(500).json({ message: 'Error al obtener los chips' });
  }
};

const getUserChips = async (req, res) => {
  try {
    const chips = await Chip.find();
    res.status(200).json(chips);
  } catch (err) {
    console.error('Error al obtener todos los chips:', err);
    res.status(500).json({ message: 'Error al obtener los chips' });
  }
};

const validateChip = async (req, res) => {
  const { uid } = req.body;

  try {
    const chip = await Chip.findOne({ uid });
    if (!chip) return res.status(404).json({ message: 'Chip no registrado' });
    res.status(200).json({ message: 'Chip registrado', chip });
  } catch (err) {
    console.error('Error al validar chip:', err);
    res.status(500).json({ message: 'Error en la validación del chip' });
  }
};

export default {
  registerChip,
  getMyChips,
  getUserChips,
  validateChip
};

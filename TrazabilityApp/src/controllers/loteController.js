import Lote from '../models/Lote.js';

const createLote = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { maxVacas, mesDespacho } = req.body;

    if (!maxVacas || !mesDespacho) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Contar lotes del admin para generar el nombre automático
    const count = await Lote.countDocuments({ adminId });
    const loteNumber = String(count + 1).padStart(2, '0');
    const name = `Lote ${loteNumber}`;

    const newLote = await Lote.create({
      name,
      adminId,
      maxVacas,
      mesDespacho
    });

    res.status(201).json(newLote);
  } catch (error) {
    console.error('Error al crear lote:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getMyLotes = async (req, res) => {
  try {
    const adminId = req.user.id;
    const lotes = await Lote.find({ adminId }).sort({ createdAt: -1 });
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lotes' });
  }
};

const getLotesAbiertos = async (req, res) => {
    try {
      const adminId = req.user.id;
      const lotes = await Lote.find({ adminId, status: 'abierto' }).sort({ createdAt: -1 });
      res.json(lotes);
    } catch (error) {
      console.error('Error al obtener lotes abiertos:', error);
      res.status(500).json({ error: 'Error al obtener lotes abiertos' });
    }
  };
  

  export default {
    createLote,
    getMyLotes,
    getLotesAbiertos
  };
  

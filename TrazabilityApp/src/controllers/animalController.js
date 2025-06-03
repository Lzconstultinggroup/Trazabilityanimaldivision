import Animal from '../models/Animal.js';

export const getAnimalHistory = async (req, res) => {
  try {
    const { uid } = req.params;
    const animal = await Animal.findOne({ uid });
    if (!animal) return res.status(404).json({ message: 'Animal no encontrado' });
    res.json({ animal });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial', error: error.message });
  }
};

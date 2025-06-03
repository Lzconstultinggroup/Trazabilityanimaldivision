export const scanChip = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: 'UID no proporcionado' });
  }

  try {
    res.status(200).json({ message: 'Chip leído correctamente', uid });
  } catch (error) {
    console.error('Error al escanear chip:', error);
    res.status(500).json({ message: 'Error interno al escanear el chip' });
  }
};

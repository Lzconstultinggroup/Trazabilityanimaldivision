import Camera from '../models/Camera.js';

const registerCamera = async (req, res) => {
  try {
    const { ip, user, pass, name, location, streamKey, isThermal } = req.body;


    const userId = req.user.id;

    if (!name || !ip || !streamKey) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const exists = await Camera.findOne({ ip, assignedTo: userId });
    if (exists) {
      return res.status(409).json({ error: 'Esta cámara ya está registrada para este usuario' });
    }

    const newCam = new Camera({
      name,
      ip,
      streamKey,
      location,
      isThermal,
      assignedTo: userId
    });

    await newCam.save();
    res.json({ status: 'ok', camera: newCam });
  } catch (err) {
    console.error('Error al registrar cámara:', err);
    res.status(500).json({ error: 'Error interno al registrar la cámara' });
  }
};

const getUserCameras = async (req, res) => {
  try {
    const cams = await Camera.find({ assignedTo: req.user.id });
    res.json(cams);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cámaras' });
  }
};

const deleteCamera = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Camera.deleteOne({ _id: id, assignedTo: req.user.id });

    res.json({ deleted: result.deletedCount > 0 });
  } catch (err) {
    console.error('Error al eliminar cámara:', err);
    res.status(500).json({ error: 'No se pudo eliminar la cámara' });
  }
};

export default {
  registerCamera,
  getUserCameras,
  deleteCamera
};

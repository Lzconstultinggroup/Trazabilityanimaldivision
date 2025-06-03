import ActionNFT from '../models/ActionNFT.js';
import Chip from '../models/Chip.js';

export const mintNFT = async (req, res) => {
  const { uid, eventType, description } = req.body;

  if (!uid || !eventType) {
    return res.status(400).json({ message: 'UID y tipo de evento son requeridos' });
  }

  try {
    const chipExists = await Chip.findOne({ uid });
    if (!chipExists) {
      return res.status(400).json({ message: `El chip con UID ${uid} no está registrado.` });
    }

    const newNFT = new ActionNFT({
      uid,
      eventType,
      description,
      createdBy: req.user._id,
      role: req.user.role,
      timestamp: new Date()
    });

    await newNFT.save();

    res.status(201).json({
      message: 'Evento registrado exitosamente',
      nft: newNFT
    });
  } catch (error) {
    console.error('Error al mintear NFT:', error);
    res.status(500).json({ message: 'Error al registrar evento' });
  }
};

export const mintBatchNFT = async (req, res) => {
  const { uids, eventType, description } = req.body;

  if (!uids || !Array.isArray(uids) || uids.length === 0) {
    return res.status(400).json({ message: 'Debes proporcionar un array de UIDs' });
  }

  if (!eventType) {
    return res.status(400).json({ message: 'El tipo de evento es obligatorio' });
  }

  try {
    const registeredChips = await Chip.find({ uid: { $in: uids } });
    const registeredUIDs = registeredChips.map((chip) => chip.uid);
    const unregisteredUIDs = uids.filter(uid => !registeredUIDs.includes(uid));

    if (unregisteredUIDs.length > 0) {
      return res.status(400).json({
        message: 'Algunos chips no están registrados',
        unregistered: unregisteredUIDs
      });
    }

    const results = await Promise.all(
      uids.map(async (uid) => {
        const nft = new ActionNFT({
          uid,
          eventType,
          description,
          createdBy: req.user._id,
          role: req.user.role,
          timestamp: new Date()
        });
        await nft.save();
        return nft;
      })
    );

    res.status(201).json({
      message: 'Eventos registrados exitosamente',
      count: results.length,
      events: results
    });
  } catch (error) {
    console.error('Error al registrar eventos en lote:', error);
    res.status(500).json({ message: 'Error al registrar eventos en lote' });
  }
};

export const getNFTData = async (req, res) => {
  const { tokenId } = req.params;

  try {
    const nft = await ActionNFT.findById(tokenId);
    if (!nft) {
      return res.status(404).json({ message: 'NFT no encontrado' });
    }
    res.status(200).json(nft);
  } catch (error) {
    console.error('Error al obtener NFT:', error);
    res.status(500).json({ message: 'Error al obtener NFT' });
  }
};

export const getHistoryByUID = async (req, res) => {
  const { uid } = req.params;

  try {
    const events = await ActionNFT.find({ uid })
      .sort({ timestamp: -1 })
      .populate('createdBy', 'fullName role');

    const formatted = events.map(e => ({
      eventType: e.eventType,
      description: e.description,
      role: e.createdBy?.role || 'Desconocido',
      user: e.createdBy?.fullName || 'Usuario desconocido',
      timestamp: e.timestamp,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error al obtener historial por UID:', error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
};

import mongoose from 'mongoose';

const loteSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Se genera automáticamente
  adminId: { type: String, required: true },
  maxVacas: { type: Number, required: true },
  mesDespacho: { type: String, required: true }, // ej: "Agosto"
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['abierto', 'completo'], default: 'abierto' }
});

export default mongoose.model('Lote', loteSchema);

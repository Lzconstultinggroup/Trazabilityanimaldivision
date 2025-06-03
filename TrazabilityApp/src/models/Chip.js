import mongoose from 'mongoose';

const chipSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lote' },
  adminId: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});


const Chip = mongoose.model('Chip', chipSchema);
export default Chip;




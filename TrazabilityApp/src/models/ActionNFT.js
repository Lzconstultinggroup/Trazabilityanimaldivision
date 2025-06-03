import mongoose from 'mongoose';

const ActionNFTSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  eventType: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ActionNFT = mongoose.model('ActionNFT', ActionNFTSchema);
export default ActionNFT;

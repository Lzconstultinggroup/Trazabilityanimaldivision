import mongoose from 'mongoose';

const cameraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  streamKey: { type: String, required: true, unique: true },
  location: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  isThermal: {
    type: Boolean,
    default: false
  }
  
});

export default mongoose.model('Camera', cameraSchema);


import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  eventData: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
  nftId: { type: Number }
});

const AnimalSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  history: [EventSchema]
});

const Animal = mongoose.model('Animal', AnimalSchema);
export default Animal;

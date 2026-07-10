import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name:   { type: String, required: [true, 'Name is required'], trim: true },
  email:  { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  source: { type: String, default: 'popup' },
  ip:     { type: String, default: '' },
}, { timestamps: true });

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
export default Subscriber;

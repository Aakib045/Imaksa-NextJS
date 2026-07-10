import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Name is required'], trim: true },
  email:    { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  phone:    { type: String, default: '' },
  interest: { type: String, default: '' },
  budget:   { type: String, default: '' },
  message:  { type: String, default: '' },
  source:   { type: String, default: 'website' }, // where they came from
  read:     { type: Boolean, default: false },
  replied:  { type: Boolean, default: false },
  notes:    { type: String, default: '' }, // admin internal notes
  ip:       { type: String, default: '' },
}, { timestamps: true });

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export default Enquiry;

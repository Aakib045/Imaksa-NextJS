// Stores site-wide settings (contact info, social links, company info).
// Only ONE document should ever exist in this collection — the whole
// site reads from it, and the admin panel writes to it.

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  phone:   { type: String, default: '' },
  email:   { type: String, default: '' },
  wa:      { type: String, default: '' },   // WhatsApp number, digits only e.g. 971501234567
  addr:    { type: String, default: '' },
  hrs:     { type: String, default: '' },
  maps:    { type: String, default: '' },
  li:      { type: String, default: '' },   // LinkedIn
  ig:      { type: String, default: '' },   // Instagram
  fb:      { type: String, default: '' },   // Facebook
  co:      { type: String, default: 'IMAKSA Real Estate LLC' },
  rera:    { type: String, default: '' },
  year:    { type: String, default: '2012' },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export default Settings;

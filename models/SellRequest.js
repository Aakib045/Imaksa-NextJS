// Stores submissions from people who want to sell their property through IMAKSA.
// This is SEPARATE from Property (live listings shown to buyers) — a sell
// request is just a lead/submission that an admin reviews manually before
// (optionally) creating a real Property listing from it.

import mongoose from 'mongoose';

const sellRequestSchema = new mongoose.Schema({
  name:         { type: String, required: [true, 'Name is required'], trim: true },
  email:        { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  phone:        { type: String, default: '' },
  propertyType: { type: String, default: '' },   // villa, apartment, etc.
  location:     { type: String, default: '' },   // property address/area
  size:         { type: String, default: '' },   // approx sq ft
  askingPrice:  { type: String, default: '' },   // optional, seller may not want to disclose
  notes:        { type: String, default: '' },   // message from seller
  read:         { type: Boolean, default: false },
  contacted:    { type: Boolean, default: false },
  adminNotes:   { type: String, default: '' },   // internal notes, admin-only
  ip:           { type: String, default: '' },
}, { timestamps: true });

const SellRequest = mongoose.models.SellRequest || mongoose.model('SellRequest', sellRequestSchema);
export default SellRequest;

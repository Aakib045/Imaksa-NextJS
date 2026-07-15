import mongoose from 'mongoose'
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, default: '' },
  type: { type: String, default: 'Full-time' },
  location: { type: String, default: 'Dubai, UAE' },
  salary: { type: String, default: '' },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema)
export default Job

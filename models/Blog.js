import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title:    { type: String, required: [true, 'Title is required'], trim: true },
  desc:     { type: String, required: [true, 'Description is required'] },
  content:  { type: String, default: '' },
  cat:      { type: String, default: 'Market Update' },
  status:   { type: String, enum: ['Published', 'Draft'], default: 'Published' },
  img:      { type: String, default: '' },
  readTime: { type: String, default: '5 min read' },
  author:   { type: String, default: 'IMAKSA Team' },
  views:    { type: Number, default: 0 },
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;

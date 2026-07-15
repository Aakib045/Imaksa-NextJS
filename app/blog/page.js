import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import BlogContent from '@/components/BlogContent'

export const metadata = {
  title: 'Blog | IMAKSA Real Estate',
  description: 'Expert insights on Dubai real estate market trends, investment opportunities, and property guides from IMAKSA Real Estate LLC.',
}

export default async function BlogPage() {
  let blogs = []
  try {
    await connectDB()
    const raw = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 }).lean()
    blogs = JSON.parse(JSON.stringify(raw))
  } catch {
    blogs = []
  }
  return <BlogContent blogs={blogs} />
}

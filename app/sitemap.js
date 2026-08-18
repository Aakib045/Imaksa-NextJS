import { connectDB } from '@/lib/mongodb'
import Property from '@/models/Property'
import Blog from '@/models/Blog'

export default async function sitemap() {
  const baseUrl = 'https://imaksa.ae'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/properties?type=buy`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/properties?type=rent`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/properties?type=offplan`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let propertyPages = []
  try {
    await connectDB()
    const properties = await Property.find({ status: 'active' }).select('_id updatedAt').lean()
    propertyPages = properties.map(p => ({
      url: `${baseUrl}/properties/${p._id}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (e) {
    console.error('Sitemap property fetch failed:', e)
  }

  let blogPages = []
  try {
    const blogs = await Blog.find({ status: 'Published' }).select('_id updatedAt').lean()
    blogPages = blogs.map(b => ({
      url: `${baseUrl}/blog/${b._id}`,
      lastModified: b.updatedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch (e) {
    console.error('Sitemap blog fetch failed:', e)
  }

  return [...staticPages, ...propertyPages, ...blogPages]
}

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    sitemap: 'https://imaksa.ae/sitemap.xml',
    host: 'https://imaksa.ae',
  }
}

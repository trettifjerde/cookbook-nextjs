/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      }
    ]
  },
  async redirects() {
      return [
        {
          source: '/',
          destination: '/recipes',
          permanent: true,
        },
        {
          source: '/auth',
          destination: '/auth/login',
          permanent: true
        }
      ]
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'x-clacks-overhead',
            value: 'GNU Terry Pratchett'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig

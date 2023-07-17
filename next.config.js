/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.jamieoliver.com',
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
        ]
    }
}

module.exports = nextConfig

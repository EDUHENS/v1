/** @type {import('next').NextConfig} */

const nextConfig = {
  allowedDevOrigins: ['localhost', '192.168.100.45'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_LOGIN_ROUTE: process.env.NEXT_PUBLIC_LOGIN_ROUTE || '/api/auth/login',
    NEXT_PUBLIC_PROFILE_ROUTE: process.env.NEXT_PUBLIC_PROFILE_ROUTE || '/api/auth/me',
    NEXT_PUBLIC_ACCESS_TOKEN_ROUTE: process.env.NEXT_PUBLIC_ACCESS_TOKEN_ROUTE || '/api/auth/access-token',
  },
}

module.exports = nextConfig

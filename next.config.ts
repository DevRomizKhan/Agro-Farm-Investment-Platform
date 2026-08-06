import type { NextConfig } from 'next'

const appOrigin = process.env.NEXT_PUBLIC_APP_URL
  ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
  : undefined

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahnlwgrldwrbvkrxlhrv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', appOrigin].filter(Boolean) as string[],
      // Camera captures are commonly much larger than gallery images. The
      // client compresses them, but keep enough headroom for four KYC files.
      bodySizeLimit: '30mb',
    },
  },
}

export default nextConfig

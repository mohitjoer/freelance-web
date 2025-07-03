/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false
,
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'img.clerk.com',
      port: '',
      pathname: '/**',
    },
    
  ],
},
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress:true,
    swcMinify:true,
    compiler:{
    removeConsole: false
    },
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
  }

module.exports = nextConfig

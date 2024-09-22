/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
      },
      api: {
        bodyParser: false,
      },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    config.externals.push({
      'onnxruntime-node': 'onnxruntime-web',
    });

    return config;
  },
};

export default nextConfig;
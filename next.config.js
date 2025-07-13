/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    // Exclude problematic modules
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push('undici');
    }

    // Handle ES modules properly
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  transpilePackages: ['firebase', '@firebase/auth'],
}

module.exports = nextConfig
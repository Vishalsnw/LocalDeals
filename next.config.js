/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that shouldn't run in browser
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
        zlib: false,
        net: false,
        fs: false,
        tls: false,
        child_process: false,
        'node:crypto': false,
        'node:stream': false,
        'node:util': false,
      };
    }

    // Fix ES module issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Ignore undici in all contexts
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push('undici');
    }

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
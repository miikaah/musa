const CracoEsbuildPlugin = require("craco-esbuild");

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        esbuildMinimizerOptions: {
          target: "es2020",
          css: true,
        },
      },
    },
  ],
  webpack: {
    plugins: {},
    configure: {
      resolve: {
        fallback: {
          fs: false,
          tls: false,
          net: false,
          path: false,
          zlib: false,
          http: false,
          https: false,
          stream: false,
          crypto: false,
          buffer: false,
          os: false,
          assert: false,
        },
      },
    },
  },
};

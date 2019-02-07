module.exports = {
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,

  css: {
    sourceMap: true
  },

  pwa: {
    name: 'Nursry.APP',
    themeColor: '#FFFFFF',
    msTileColor: '#ea80fc',
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: /graphql/,
          handler: 'networkFirst',
          options: {
            cacheName: 'graphql',
            backgroundSync: {
              name: 'graphql-queue'
            }
          }
        },
        {
          urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'images'
          }
        }],
      skipWaiting: true,
      clientsClaim: true
    }
  }
}

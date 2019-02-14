module.exports = {
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,

  pwa: {
    name: 'Nursry',
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
  },

  publicPath: undefined
}

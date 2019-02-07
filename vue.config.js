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
      runtimeCaching: [{
        urlPattern: /\.(?:js|css)$/,
        handler: 'cacheFirst',
        options: {
          cacheName: 'js-and-css',
          expiration: {
            maxEntries: 25
          }
        }
      },
      {
        urlPattern: /\.html$/,
        handler: 'networkFirst',
        options: {
          networkTimeoutSeconds: 10,
          cacheName: 'html',
          expiration: {
            maxEntries: 2,
            purgeOnQuotaError: true
          }
        }
      },
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
          cacheName: 'images',
          expiration: {
            maxEntries: 10,
            purgeOnQuotaError: true
          }
        }
      },
      {
        urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
        handler: 'cacheFirst',
        options: {
          cacheName: 'fonts',
          expiration: {
            maxEntries: 8
          }
        }
      }]
    }
  }
}

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
    msTileColor: '#CE93D8'
  },

  transpileDependencies: [/node_modules[/\\\\]vuetify[/\\\\]/]
}

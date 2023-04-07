'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

// const GenerateAssetPlugin = require("generate-asset-webpack-plugin");
// const serverconfig = require("./serverconfig.json");
// const createServerConfig = function () {
//   return JSON.stringify(serverconfig);
// };

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Element Admin' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 8086 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  // configureWebpack: {
  //   plugins: [
  //     new GenerateAssetPlugin({
  //       filename: "serverconfig.json",

  //       fn: (compilation, cb) => {
  //         cb(null, createServerConfig(compilation));
  //       },

  //       extraFiles: [],
  //     }),
  //   ],
  // },

  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // publicPath: process.env.NODE_ENV === 'development' ?  "/" : '/top.plan',
  publicPath: './',
  outputDir: 'static',
  assetsDir: 'static',
  lintOnSave: true, // process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true, // 内网穿透
    proxy: {
      // 资料
      '/api1': {
        // target: "http://11.6.1.129:8901/device/api/",
        target: 'http://11.6.1.124:8901/muc',
        // target: 'https://27c1-240e-467-f88-25e3-f174-151f-6212-10b0.jp.ngrok.io',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/api1': ''
        }
      },
      // 设备
      '': {
        // target:
        // 'https://821d-240e-467-f70-8b5-6570-3262-a4af-77ba.jp.ngrok.io/api',
        target: 'http://11.6.1.124:8901/device/api',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
    //   before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
    // plugins: [
    //   new GenerateAssetPlugin({
    //     filename: "serverconfig.json",

    //     fn: (compilation, cb) => {
    //       cb(null, createServerConfig(compilation));
    //     },

    //     extraFiles: [],
    //   }),
    // ],
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}

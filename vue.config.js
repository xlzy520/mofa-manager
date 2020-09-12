const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'font-size-sm': '13px',
          'font-size-md': '15px',
          'font-size-lg': '17px',
          'goods-action-button-danger-color': '#7232dd',
          'goods-action-button-warning-color': '#3eaf7c'
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
};

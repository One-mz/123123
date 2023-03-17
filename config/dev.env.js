var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  VUE_APP_ID: '"20210820-fssc"',

  VUE_APP_BASE_API: '"/fssc"',

})

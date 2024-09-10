/** @type {import('postcss-load-config').Config} */
  module.exports = (ctx) => ({
    syntax:'postcss-scss',
    map: ctx.options.map,
    parser: 'postcss-scss',
    plugins: [
      require('autoprefixer'),
      require('postcss-nested'),
      require('postcss-initial'),
      require('postcss-sorting'),
      require('postcss-utilities'),
      require('postcss-font-magician'),
    ]

})
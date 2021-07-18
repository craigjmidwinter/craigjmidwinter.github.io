// next.config.js
const optimizedImages = require('next-optimized-images')
const reactSvg = require('next-react-svg')
const withPlugins = require('next-compose-plugins')
const path = require('path')

module.exports = withPlugins([
  [
    optimizedImages,
    {
      optimizeImagesInDev: false,
    },
  ],
  [
    reactSvg,
    {
      include: path.resolve(__dirname, 'public/assets/svg'),
    },
  ],
])

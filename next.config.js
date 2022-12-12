// next.config.js
const optimizedImages = require('next-optimized-images')
const reactSvg = require('next-react-svg')
const withPlugins = require('next-compose-plugins')
const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
}
module.exports = withPlugins(
  [
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
  ],
  nextConfig
)

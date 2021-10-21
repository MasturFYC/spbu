const path = require('path');
const withTM = require('next-transpile-modules')([
  '@adobe/react-spectrum',
  '@react-spectrum/actiongroup',
  '@react-spectrum/breadcrumbs',
  '@react-spectrum/button',
  '@react-spectrum/buttongroup',
  '@react-spectrum/checkbox',
  '@react-spectrum/combobox',
  '@react-spectrum/dialog',
  '@react-spectrum/divider',
  '@react-spectrum/form',
  '@react-spectrum/icon',
  '@react-spectrum/illustratedmessage',
  '@react-spectrum/image',
  '@react-spectrum/label',
  '@react-spectrum/layout',
  '@react-spectrum/link',
  '@react-spectrum/listbox',
  '@react-spectrum/menu',
  '@react-spectrum/meter',
  '@react-spectrum/numberfield',
  '@react-spectrum/overlays',
  '@react-spectrum/picker',
  '@react-spectrum/progress',
  '@react-spectrum/provider',
  '@react-spectrum/radio',
  '@react-spectrum/slider',
  '@react-spectrum/searchfield',
  '@react-spectrum/statuslight',
  '@react-spectrum/switch',
  '@react-spectrum/tabs',
  '@react-spectrum/text',
  '@react-spectrum/textfield',
  '@react-spectrum/theme-dark',
  '@react-spectrum/theme-default',
  '@react-spectrum/theme-light',
  '@react-spectrum/tooltip',
  '@react-spectrum/view',
  '@react-spectrum/well',
  '@spectrum-icons/ui',
  '@spectrum-icons/workflow',
  '@react-spectrum/table',
]);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    domains: ['imagekit.io', 'ik.imagekit.io'],
    path: 'https://ik.imagekit.io/spbu/',
  },
  async headers() {
    return [
      {
        // This works, and returns appropriate Response headers:
        source: '/(.*).(jpg|png|svg|jpeg)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=60, s-maxage=60, stale-while-revalidate=60, immutable',
          },
        ],
      },
      {
        // This doesn't work for 'Cache-Control' key (works for others though):
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            // Instead of this value:
            value:
              'public, max-age=180, s-maxage=180, stale-while-revalidate=180, immutable',
            // Cache-Control response header is `public, max-age=60` in production
            // and `public, max-age=0, must-revalidate` in development
          },
        ],
      },
    ];
  },
});

console.log('next.config.js', JSON.stringify(module.exports, null, 2))

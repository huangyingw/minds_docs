/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Minds.com',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: '/img/bulb.svg',
    infoLink: 'https://www.minds.com',
    pinned: true
  }
];

const siteConfig = {
  title: 'Minds Docs', // Title for your website.
  tagline: 'The Minds Stack',
  url: 'https://developers.minds.com', // Your website URL
  baseUrl: '/', // Base URL for your project */

  // Used for publishing and more
  projectName: 'Minds Docs',
  organizationName: 'Minds',
  editUrl: 'https://gitlab.com/minds/docs/edit/master/docs/',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'getting-started/introduction', label: 'Docs' },
    //{doc: 'doc4', label: 'API'},
    {
      label: 'Code',
      href: 'https://gitlab.com/minds'
    },
    {
      label: 'Bounties',
      href: 'https://gitcoin.co/minds/'
    },
    {
      label: 'Minds.com',
      href: 'https://minds.com/'
    }
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/bulb.svg',
  footerIcon: 'img/bulb.svg',
  favicon: 'img/bulb.png',

  /* Colors for website */
  colors: {
    primaryColor: '#FFF',
    secondaryColor: '#FFF'
  },

  /* Custom fonts for website */

  // fonts: {
  //   myFont: ['Roboto', 'Sans-Serif']
  //   myOtherFont: [
  //     "-apple-system",
  //     "system-ui"
  //   ]
  // },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Minds Inc.`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default'
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js'
  ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/canyon-hero.jpg',
  twitterImage: 'img/canyon-hero.jpg',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',

  customDocsPath: './docs',
  algolia: {
    apiKey: '6e560f4f51933177f40205eac88af5a4',
    indexName: 'minds',
    algoliaOptions: {} // Optional, if provided by Algolia
  }
};

module.exports = siteConfig;

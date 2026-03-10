import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WebWidgetTool Docs',
  tagline: 'Embeddable widgets for any website — self-hostable & open source',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://vianmora.github.io',
  baseUrl: '/web-widget-tool-docs/',

  organizationName: 'vianmora',
  projectName: 'web-widget-tool-docs',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/vianmora/web-widget-tool-docs/tree/main/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WebWidgetTool',
      logo: {
        alt: 'WebWidgetTool Logo',
        src: 'img/logo.png',
        srcDark: 'img/logo-white.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'selfHostingSidebar',
          position: 'left',
          label: 'Self-Hosting',
        },
        {
          type: 'docSidebar',
          sidebarId: 'contributingSidebar',
          position: 'left',
          label: 'Contributing',
        },
        {
          href: 'https://github.com/vianmora/web-widget-tool',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Self-Hosting', to: '/'},
            {label: 'Contributing', to: '/contributing/introduction'},
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/vianmora/web-widget-tool',
            },
            {
              label: 'webwidgettool.com',
              href: 'https://webwidgettool.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WebWidgetTool. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'nginx', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

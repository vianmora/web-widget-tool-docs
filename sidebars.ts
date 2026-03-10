import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  selfHostingSidebar: [
    {
      type: 'category',
      label: 'Self-Hosting',
      collapsible: false,
      items: [
        'self-hosting/introduction',
        'self-hosting/requirements',
        'self-hosting/quick-start',
        'self-hosting/configuration',
        {
          type: 'category',
          label: 'Deployment',
          items: [
            'self-hosting/deployment/docker',
            'self-hosting/deployment/coolify',
            'self-hosting/deployment/reverse-proxy',
            'self-hosting/deployment/vps-manual',
          ],
        },
        'self-hosting/upgrades',
        'self-hosting/troubleshooting',
      ],
    },
  ],

  contributingSidebar: [
    {
      type: 'category',
      label: 'Contributing',
      collapsible: false,
      items: [
        'contributing/introduction',
        'contributing/architecture',
        'contributing/local-setup',
        'contributing/pr-guidelines',
        {
          type: 'category',
          label: 'Backend',
          items: [
            'contributing/backend/overview',
            'contributing/backend/routes',
            'contributing/backend/database',
          ],
        },
        {
          type: 'category',
          label: 'Frontend',
          items: [
            'contributing/frontend/overview',
            'contributing/frontend/widget-catalog',
          ],
        },
        {
          type: 'category',
          label: 'Widget.js',
          items: [
            'contributing/widget-js/overview',
            'contributing/widget-js/add-renderer',
          ],
        },
        'contributing/saas-mode',
      ],
    },
  ],
};

export default sidebars;

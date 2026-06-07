// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'RolePlay Cauldron',
			favicon: '/favicon.png',
			logo: { src: './src/assets/RPCauldron.png' },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/roleplay-cauldron' }],
			components: {
				Sidebar: './src/components/ModuleIsolatingSidebar.astro',
			},
			sidebar: [
				{
					label: 'Brotkrumen',
					collapsed: true,
					items: [{ autogenerate: { directory: 'brotkrumen' } }],
				},
				{
					label: 'Spellbook',
					collapsed: true,
					items: [{ autogenerate: { directory: 'spellbook' } }],
				},
			],
		}),
	],
});

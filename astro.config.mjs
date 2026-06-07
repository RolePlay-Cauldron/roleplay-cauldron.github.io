// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'RolePlay Cauldron',
			favicon: '/favicon.png',
			logo: { src: './src/assets/RPCauldron.png' },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/roleplay-cauldron' }],
			plugins: [
				starlightSidebarTopics([
					{
						label: 'Brotkrumen',
						link: '/brotkrumen/',
						icon: 'random',
						items: [{ autogenerate: { directory: 'brotkrumen' } }],
					},
					{
						label: 'Spellbook',
						link: '/spellbook/',
						icon: 'open-book',
						items: [{ autogenerate: { directory: 'spellbook' } }],
					},
				]),
			],
		}),
	],
});

import { access } from '@/payload/access'
import { linkGroup } from '@/payload/fields/link'
import { revalidateLayout } from '@/payload/hooks/revalidateLayout'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
import { type GlobalConfig } from 'payload'
import { socialOptions } from './socialOptions'

export const Navigation: GlobalConfig = {
	slug: 'navigation',
	admin: {
		group: adminMenuGroups.settings,
	},
	access: {
		read: access(),
		update: access(),
	},
	hooks: {
		afterChange: [revalidateLayout],
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Header',
					name: 'header',
					fields: [linkGroup({ appearances: false })],
				},
				{
					label: 'Footer',
					name: 'footer',
					fields: [
						linkGroup({ appearances: false }),
						{
							name: 'socialLinks',
							type: 'array',
							admin: {
								components: {
									RowLabel: '/globals/settings/Navigation/ui/FooterSocialLabel',
								},
							},
							fields: [
								{
									name: 'site',
									type: 'select',
									options: socialOptions,
								},
								{
									name: 'url',
									type: 'text',
									required: true,
								},
							],
						},
					],
				},
			],
		},
	],
}

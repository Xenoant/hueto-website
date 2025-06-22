import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
import { seoFields } from '@/payload/fields/seoFields'
import { GlobalConfig } from 'payload'

export const SEO: GlobalConfig = {
	slug: 'seo',
	typescript: {
		interface: 'SEOSettingsType',
	},
	admin: {
		group: adminMenuGroups.settings,
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Default',
					name: 'default',
					admin: {
						description:
							'These fallback values are used in the event that an entity does not have any SEO properties configured.',
					},
					fields: seoFields({
						pathPrefix: 'default',
						includeNoIndex: false,
						hasGenerateTitleFn: false,
						hasGenerateDescriptionFn: false,
					}),
				},
			],
		},
	],
}

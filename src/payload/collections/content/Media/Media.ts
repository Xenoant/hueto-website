import type { CollectionConfig } from 'payload'
import { access } from '@/payload/access'
import { generateThumbhash } from './hooks/generateThumbhash'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'

export const Media: CollectionConfig = {
	slug: 'media',
	admin: {
		group: adminMenuGroups.content,
	},
	access: {
		read: access({ type: 'public' }),
		create: access({ roles: { editor: true } }),
		update: access({ roles: { editor: true } }),
		delete: access(),
	},
	hooks: {
		beforeChange: [generateThumbhash],
	},
	upload: {
		imageSizes: [
			{
				name: 'og',
				width: 1200,
				height: 630,
				crop: 'center',
			},
		],
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			required: true,
		},
		{
			name: 'thumbhash',
			type: 'json',
			admin: {
				hidden: true,
				disableBulkEdit: true,
				disableListColumn: true,
			},
		},
	],
}

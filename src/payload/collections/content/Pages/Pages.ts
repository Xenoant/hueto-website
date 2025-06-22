import { slug } from '@/payload/fields/slug'
import { syncPathname } from '@/payload/hooks/syncPathname'
import { CollectionConfig } from 'payload'
import { access } from '@/payload/access'
import { generatePreviewPath } from '@/utils/generatePreviewPath'
import { createParentField } from '@payloadcms/plugin-nested-docs'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
import { seoFields } from '@/payload/fields/seoFields'

export const Pages: CollectionConfig = {
	slug: 'pages',
	admin: {
		useAsTitle: 'title',
		group: adminMenuGroups.content,
		defaultColumns: ['title', 'pathname', '_status', 'updatedAt'],
		livePreview: {
			url: ({ data }) =>
				generatePreviewPath({
					pathname: typeof data?.pathname === 'string' ? data.pathname : '',
				}),
		},
		preview: (data) =>
			generatePreviewPath({
				pathname: typeof data?.pathname === 'string' ? data.pathname : '',
			}),
	},
	access: {
		read: access({ roles: { editor: true }, type: 'published' }),
		create: access({ roles: { editor: true } }),
		update: access({ roles: { editor: true } }),
		delete: access(),
	},
	versions: {
		drafts: {
			autosave: {
				interval: 100,
			},
		},
		maxPerDoc: 50,
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		slug(undefined, { index: false, unique: false }),
		{
			name: 'pathname',
			type: 'text',
			unique: true,
			index: true,
			admin: {
				readOnly: true,
				position: 'sidebar',
			},
			access: {
				read: ({ req }) => req.context.lod === 1000,
			},
			hooks: {
				beforeChange: [syncPathname],
				beforeValidate: [syncPathname],
			},
		},
		createParentField('pages'),
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Content',
					fields: [
						{
							name: 'blocks',
							type: 'blocks',
							blocks: [],
							blockReferences: ['archive', 'richText'],
						},
					],
				},
				{
					name: 'meta',
					label: 'SEO',
					fields: seoFields({ hasGenerateDescriptionFn: false }),
				},
			],
		},
	],
}

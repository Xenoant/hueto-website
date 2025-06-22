import { blocksEditor } from '@/payload/lexical/blocksEditor'
import { slug } from '@/payload/fields/slug'
import { generatePreviewPath } from '@/utils/generatePreviewPath'
import { CollectionConfig } from 'payload'
import { access } from '@/payload/access'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
import { seoFields } from '@/payload/fields/seoFields'

export const Posts: CollectionConfig = {
	slug: 'posts',
	admin: {
		useAsTitle: 'title',
		group: adminMenuGroups.content,
		defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
		livePreview: {
			url: ({ data }) =>
				generatePreviewPath({
					pathname: typeof data?.slug === 'string' ? `/post/${data?.slug}` : '',
				}),
		},
		preview: (data) =>
			generatePreviewPath({
				pathname: typeof data?.slug === 'string' ? `/post/${data?.slug}` : '',
			}),
	},
	versions: {
		drafts: {
			autosave: {
				interval: 100,
			},
		},
		maxPerDoc: 50,
	},
	access: {
		read: access({ roles: { editor: true }, type: 'published' }),
		create: access({ roles: { editor: true } }),
		update: access({ roles: { editor: true } }),
		delete: access(),
	},
	fields: [
		slug(),
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Main',
					fields: [
						{
							name: 'title',
							type: 'text',
							required: true,
						},
						{
							name: 'cover',
							type: 'upload',
							relationTo: 'media',
						},
					],
				},
				{
					label: 'Content',
					fields: [
						{
							name: 'article',
							label: 'Article',
							type: 'richText',
							editor: blocksEditor(),
						},
					],
				},
				{
					name: 'meta',
					label: 'SEO',
					fields: seoFields(),
				},
			],
		},
	],
}

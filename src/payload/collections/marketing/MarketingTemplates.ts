import { slug } from '@/payload/fields/slug'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
import { CollectionConfig } from 'payload'
import { RichTextEmailBlock } from './blocks/email/RichTextEmailBlock.config'
import { generatePreviewPath } from '@/utils/generatePreviewPath'

/**
 * Add attachments to the template
 */
export const MarketingTemplates: CollectionConfig = {
	slug: 'marketing-templates',
	labels: {
		singular: 'Template',
		plural: 'Templates',
	},
	admin: {
		useAsTitle: 'name',
		group: adminMenuGroups.marketing,
		livePreview: {
			url: ({ data }) =>
				generatePreviewPath({
					collection: 'marketing-templates',
					pathname: `/preview/template/${data.id}`,
					id: data.id,
				}),
		},
	},
	versions: {
		drafts: {
			autosave: {
				interval: 100,
			},
		},
		maxPerDoc: 10,
	},
	fields: [
		slug('name'),
		// TODO: Make it so that when changing type, it will verify that no campaign is using it.
		{
			name: 'type',
			type: 'select',
			required: true,
			defaultValue: 'email',
			admin: {
				position: 'sidebar',
				isClearable: false,
			},
			options: [
				{
					label: 'Email',
					value: 'email',
				},
				{
					label: 'SMS',
					value: 'sms',
				},
				{
					label: 'Direct Mail',
					value: 'directMail',
				},
			],
		},
		{
			name: 'blueprint',
			type: 'select',
			defaultValue: 'default',
			admin: {
				position: 'sidebar',
				isClearable: false,
			},
			options: [
				{
					label: 'Default',
					value: 'default',
				},
			],
		},
		{
			name: 'name',
			type: 'text',
			required: true,
		},
		{
			type: 'group',
			name: 'email',
			admin: {
				condition: (data, siblingData) => siblingData?.type === 'email',
			},
			fields: [
				{
					type: 'row',
					fields: [
						{
							name: 'fromName',
							type: 'text',
							admin: {
								width: '50%',
							},
						},
						{
							name: 'fromAddress',
							type: 'text',
							admin: {
								width: '50%',
							},
						},
					],
				},
				{
					type: 'row',
					fields: [
						{
							name: 'subject',
							type: 'text',
							admin: {
								width: '50%',
							},
						},
						{
							name: 'replyTo',
							type: 'text',
							admin: {
								width: '50%',
							},
						},
					],
				},
				{
					name: 'previewText',
					type: 'textarea',
				},
				{
					name: 'blocks',
					type: 'blocks',
					blocks: [RichTextEmailBlock],
				},
			],
		},
	],
}

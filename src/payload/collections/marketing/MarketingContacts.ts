import { access } from '@/payload/access'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
import { CollectionConfig } from 'payload'

export const MarketingContacts: CollectionConfig = {
	slug: 'marketing-contacts',
	labels: {
		singular: 'Contact',
		plural: 'Contacts',
	},
	admin: {
		useAsTitle: 'email',
		group: adminMenuGroups.marketing,
		defaultColumns: ['email', 'name', 'subscribed', 'subscribedAt'],
		listSearchableFields: ['email', 'name'],
		//including this filter means that it is not possible to see unsubscribed contacts except via joins
		// baseListFilter: () => {
		// 	return {
		// 		and: [
		// 			{
		// 				subscribed: {
		// 					equals: true,
		// 				},
		// 			},
		// 		],
		// 	}
		// },
	},
	disableDuplicate: true,
	access: {
		create: access({ type: 'public' }),
		read: access(),
		update: access(),
		delete: access(),
	},
	fields: [
		{
			name: 'email',
			type: 'text',
			required: true,
		},
		{
			name: 'name',
			type: 'text',
		},
		{
			name: 'subscribed',
			type: 'checkbox',
			defaultValue: true,
			admin: {
				position: 'sidebar',
			},
		},
		{
			name: 'subscribedAt',
			type: 'date',
			defaultValue: new Date().toISOString(),
			admin: {
				position: 'sidebar',
				condition: (_, siblingData) => siblingData?.subscribed,
			},
			hooks: {
				beforeChange: [],
			},
		},
		{
			name: 'unsubscribedAt',
			type: 'date',
			admin: {
				position: 'sidebar',
				condition: (_, siblingData) => !siblingData?.subscribed,
			},
		},
		{
			name: 'marketingLists',
			type: 'relationship',
			relationTo: 'marketing-lists',
			hasMany: true,
		},
	],
}

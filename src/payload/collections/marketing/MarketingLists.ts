import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
import { CollectionConfig } from 'payload'

export const MarketingLists: CollectionConfig = {
	slug: 'marketing-lists',
	labels: {
		singular: 'List',
		plural: 'Lists',
	},
	admin: {
		useAsTitle: 'name',
		group: adminMenuGroups.marketing,
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
		},
		{
			name: 'description',
			type: 'textarea',
		},
		{
			name: 'subscribers',
			type: 'join',
			collection: 'marketing-contacts',
			on: 'marketingLists',
			where: {
				subscribed: {
					equals: true,
				},
			},
			admin: {
				components: {
					Cell: '/collections/marketing/ui/ListSubscribersCell',
				},
			},
		},
	],
}

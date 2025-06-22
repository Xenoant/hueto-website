import { access } from '@/payload/access'
import { CollectionConfig } from 'payload'

export const MarketingEmails: CollectionConfig = {
	slug: 'marketing-emails',
	admin: {
		hidden: true,
	},
	access: {
		read: access(),
		update: () => false,
		create: () => false,
		delete: () => false,
	},
	fields: [
		{
			name: 'campaign',
			type: 'relationship',
			relationTo: 'marketing-campaigns',
			required: true,
		},
		{
			name: 'recipient',
			type: 'relationship',
			relationTo: 'marketing-contacts',
			required: true,
		},
		{
			name: 'status',
			type: 'select',
			options: ['pending', 'sent', 'failed'],
			defaultValue: 'pending',
			required: true,
		},
	],
}

import { CollectionConfig } from 'payload'
import { handleApproveCampaign } from './hooks/handleApproveCampaign'
import { handleCancelCampaign } from './hooks/handleCancelCampaign'
import { validateCampaignsScheduledDate } from './validations/validateCampaignsScheduledDate'
import { validateCampaignsTargetLists } from './validations/validateCampaignsTargetLists'
import { validateCampaignsStatus } from './validations/validateCampaignsStatus'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'
// import { previewCampaignEmail } from './endpoints/previewCampaignEmail'
import { queueCampaign } from './hooks/queueCampaign'

export const MarketingCampaigns: CollectionConfig = {
	slug: 'marketing-campaigns',
	labels: {
		singular: 'Campaign',
		plural: 'Campaigns',
	},
	admin: {
		useAsTitle: 'name',
		group: adminMenuGroups.marketing,
		preview: () => '',
		components: {
			edit: {
				PreviewButton: '/collections/marketing/ui/CampaignTestButton',
			},
		},
	},
	// endpoints: [previewCampaignEmail],
	hooks: {
		afterChange: [queueCampaign],
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
		},
		{
			name: 'targetLists',
			type: 'relationship',
			relationTo: 'marketing-lists',
			hasMany: true,
			required: true,
			validate: validateCampaignsTargetLists,
			admin: {
				allowCreate: false,
				allowEdit: false,
				components: {
					Field: '/collections/marketing/ui/CampaignTargetListsField',
				},
			},
		},
		{
			name: 'template',
			type: 'relationship',
			relationTo: 'marketing-templates',
			filterOptions: ({ data }) => {
				const currentMethod = data?.method
				return {
					type: {
						equals: currentMethod,
					},
				}
			},
			admin: {
				components: {
					Field: '/collections/marketing/ui/CampaignTemplateField',
				},
				allowCreate: false,
				allowEdit: false,
			},
		},
		{
			name: 'emails',
			type: 'join',
			collection: 'marketing-emails',
			on: 'campaign',
			admin: {
				condition: (_, siblingData) =>
					(siblingData?.status === 'sending' || siblingData?.status === 'completed') &&
					siblingData?.method === 'email',
			},
		},
		{
			name: 'totalEmails',
			type: 'number',
			admin: {
				hidden: true,
			},
		},
		{
			name: 'status',
			type: 'select',
			admin: {
				position: 'sidebar',
				isClearable: false,
				components: {
					Field: '/collections/marketing/ui/CampaignStatusField',
				},
			},
			defaultValue: 'draft',
			validate: validateCampaignsStatus,
			hooks: {
				beforeChange: [handleApproveCampaign, handleCancelCampaign],
			},
			options: [
				{
					label: 'Draft',
					value: 'draft',
				},
				{
					label: 'Approve',
					value: 'approve',
				},
				{
					label: 'Scheduled',
					value: 'scheduled',
				},
				{
					label: 'Sending',
					value: 'sending',
				},
				{
					label: 'Completed',
					value: 'completed',
				},
				{
					label: 'Cancel',
					value: 'cancel',
				},
			],
		},
		{
			name: 'method',
			type: 'select',
			defaultValue: 'email',
			required: true,
			admin: {
				position: 'sidebar',
				isClearable: false,
				components: {
					Field: '/collections/marketing/ui/CampaignMethodField',
				},
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
			name: 'type',
			type: 'select',
			defaultValue: 'scheduled',
			admin: {
				position: 'sidebar',
				isClearable: false,
				components: {
					Field: '/collections/marketing/ui/CampaignTypeField',
				},
			},
			options: [
				{
					label: 'Send Now',
					value: 'sendNow',
				},
				{
					label: 'Scheduled',
					value: 'scheduled',
				},
			],
		},
		{
			name: 'scheduledDate',
			label: 'Scheduled Date',
			type: 'date',
			validate: validateCampaignsScheduledDate,
			admin: {
				position: 'sidebar',
				condition: (_, siblingData) => siblingData?.type === 'scheduled',
				date: {
					pickerAppearance: 'dayAndTime',
					minDate: new Date(),
					timeIntervals: 1,
				},
				components: {
					Field: '/collections/marketing/ui/CampaignScheduledDateField',
				},
			},
		},
	],
}

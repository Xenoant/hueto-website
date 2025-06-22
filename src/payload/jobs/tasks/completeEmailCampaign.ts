import { TaskCompleteEmailCampaign } from '@/payload/payload-types'
import { APIError, type TaskConfig } from 'payload'

export const completeEmailCampaign: TaskConfig<TaskCompleteEmailCampaign> = {
	slug: 'completeEmailCampaign',
	retries: 1000,
	inputSchema: [
		{
			name: 'campaign',
			type: 'relationship',
			relationTo: 'marketing-campaigns',
			maxDepth: 0,
			required: true,
		},
	],
	outputSchema: [
		{
			name: 'success',
			type: 'checkbox',
		},
	],
	handler: async ({ req, input }) => {
		const { campaign: campaignId } = input

		const campaign = await req.payload.findByID({
			collection: 'marketing-campaigns',
			id: typeof campaignId === 'string' ? campaignId : campaignId.id,
		})

		const { totalDocs: emailCount } = await req.payload.count({
			collection: 'marketing-emails',
			where: {
				and: [
					{
						campaign: {
							equals: campaign.id,
						},
					},
					{
						status: {
							not_equals: 'pending',
						},
					},
				],
			},
		})

		if (emailCount >= Number(campaign.totalEmails)) {
			console.log('Campaign is completed...')
			await req.payload.update({
				collection: 'marketing-campaigns',
				id: campaign.id,
				data: {
					status: 'completed',
				},
			})
		} else {
			console.log('Campaign is not yet completed...')
			throw new APIError('Emails have not completed sending.')
		}

		return {
			output: {
				success: true,
			},
		}
	},
}

import { TaskCampaignOrchestrator } from '@/payload/payload-types'
import { APIError, TaskConfig } from 'payload'

export const campaignOrchestrator: TaskConfig<TaskCampaignOrchestrator> = {
	retries: 3,
	slug: 'campaignOrchestrator',
	label: 'Campaign Orchestrator',
	inputSchema: [
		{
			name: 'campaign',
			type: 'relationship',
			relationTo: 'marketing-campaigns',
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
		console.log('Campaign Orchestrator started...')
		const { campaign: campaignInput } = input

		const campaignId = typeof campaignInput === 'object' ? campaignInput.id : campaignInput

		const campaign = await req.payload.findByID({
			collection: 'marketing-campaigns',
			select: {
				method: true,
				template: true,
				targetLists: true,
			},
			id: campaignId,
		})

		if (!campaign) {
			throw new APIError('Campaign not found', 404)
		}

		if (!campaign.template) {
			throw new APIError('Campaign template is missing', 400)
		}

		await req.payload.update({
			collection: 'marketing-campaigns',
			id: campaignId,
			data: {
				status: 'sending',
			},
		})

		const { docs: recipients, totalDocs: totalRecipients } = await req.payload.find({
			collection: 'marketing-contacts',
			limit: 0,
			where: {
				and: [
					{
						marketingLists: {
							contains: campaign.targetLists,
						},
					},
					{
						subscribed: {
							equals: true,
						},
					},
				],
			},
		})

		console.log(`Found ${totalRecipients} recipients for campaign ${campaignId}`)

		switch (campaign.method) {
			case 'email':
				console.log('Campaign method is email')
				await req.payload.update({
					collection: 'marketing-campaigns',
					id: campaignId,
					data: {
						totalEmails: totalRecipients,
					},
				})
				for (const recipient of recipients) {
					const email = await req.payload.create({
						collection: 'marketing-emails',
						data: {
							campaign: campaignId,
							recipient: recipient.id,
							status: 'pending',
						},
					})

					await req.payload.jobs.queue({
						task: 'sendEmail',
						queue: 'email',
						input: {
							template: campaign.template,
							email: email.id,
							emailTo: recipient.email,
							data: JSON.stringify(recipient),
						},
					})
				}
				await req.payload.jobs.queue({
					task: 'completeEmailCampaign',
					queue: 'campaignCleanup',
					input: {
						campaign: campaignId,
					},
				})
				break

			default:
				throw new APIError(`Unsupported campaign method: ${campaign.method}`)
		}

		console.log('Campaign Orchestrator completed successfully.')

		return {
			output: {
				success: true,
			},
			state: 'succeeded',
		}
	},
}

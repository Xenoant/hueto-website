import { CollectionAfterChangeHook } from 'payload'

export const queueCampaign: CollectionAfterChangeHook = async ({ previousDoc, doc, req }) => {
	if (
		previousDoc?.status === 'draft' &&
		(doc?.status === 'sendNow' || doc?.status === 'scheduled')
	) {
		await req.payload.jobs.queue({
			task: 'campaignOrchestrator',
			queue: 'batch',
			input: {
				campaign: doc.id,
			},
			waitUntil: doc?.status === 'scheduled' ? new Date(doc.scheduledDate) : undefined,
		})
	}

	if (previousDoc?.status === 'scheduled' && doc?.status === 'draft') {
		await req.payload.delete({
			collection: 'payload-jobs',
			where: {
				'input.campaign': {
					equals: doc.id,
				},
			},
		})
	}

	return
}

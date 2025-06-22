import { generateEmailFromTemplate } from '@/payload/collections/marketing/utils/generateEmailFromTemplate'
import { MarketingTemplate, TaskSendEmail } from '@/payload/payload-types'
import { TaskConfig } from 'payload'

export const sendEmail: TaskConfig<TaskSendEmail> = {
	retries: 3,
	slug: 'sendEmail',
	label: 'Send Email',
	inputSchema: [
		{
			name: 'template',
			type: 'relationship',
			relationTo: 'marketing-templates',
			required: true,
		},
		{
			name: 'email',
			type: 'relationship',
			relationTo: 'marketing-emails',
			required: true,
		},
		{
			name: 'emailTo',
			type: 'email',
			required: true,
		},
		{
			name: 'data',
			type: 'json',
		},
	],
	outputSchema: [
		{
			name: 'success',
			type: 'checkbox',
		},
	],
	handler: async ({ req, input }) => {
		const { template: templateInput, email, emailTo, data } = input

		const template = templateInput as MarketingTemplate

		/**
		 * generateEmailFromTemplate temporarily disabled
		 * Currently, we are just using the root lexical editor.
		 * This means that the blocks it generates are added to the payload config, which contains
		 * React elements. This is not supported by Payload anymore and thus, we should re-implement
		 * this in a manner that does not add the React elements to the payload config in order to
		 * avoid generate:type/importmap issues.
		 */

		// const { text, html } = await generateEmailFromTemplate({
		// 	template: template,
		// 	data: data as Record<string, unknown>,
		// })

		try {
			await req.payload.sendEmail({
				from: template?.email?.fromAddress || undefined,
				to: emailTo,
				// html,
				// text,
			})
		} catch {
			await req.payload.update({
				collection: 'marketing-emails',
				id: typeof email === 'string' ? email : email.id,
				data: {
					status: 'failed',
				},
			})
		} finally {
			await req.payload.update({
				collection: 'marketing-emails',
				id: typeof email === 'string' ? email : email.id,
				data: {
					status: 'sent',
				},
			})
		}

		return {
			output: {
				success: true,
			},
		}
	},
}

import { Endpoint, addDataAndFileToRequest } from 'payload'
import { generateEmailFromTemplate } from '../utils/generateEmailFromTemplate'

export const previewCampaignEmail: Endpoint = {
	method: 'post',
	path: '/preview-email',
	handler: async (req) => {
		try {
			await addDataAndFileToRequest(req)
			const { emailTo, templateId } = req.data || {}

			if (!emailTo || !templateId) {
				return Response.json(
					{
						success: false,
						message: 'Email and template ID are required',
					},
					{ status: 400 }
				)
			}

			const payload = req.payload

			const template = await payload.findByID({
				collection: 'marketing-templates',
				id: templateId,
				depth: 2, // Ensure we get all nested data
			})

			if (!template) {
				return Response.json(
					{
						success: false,
						message: 'Template not found',
					},
					{ status: 404 }
				)
			}

			const { docs } = await payload.find({
				collection: 'marketing-contacts',
				limit: 1,
				where: {
					subscribed: {
						equals: true,
					},
				},
			})

			const contact = docs[0]

			if (!contact) {
				return Response.json(
					{
						success: false,
						message: 'No test contact found',
					},
					{ status: 404 }
				)
			}

			// Convert contact to a plain object to avoid hook-related issues
			const contactData = JSON.parse(JSON.stringify(contact))

			const { html, text } = await generateEmailFromTemplate({
				template: template,
				data: contactData,
			})

			await payload.sendEmail({
				to: emailTo,
				from: process.env.EMAIL_FROM || 'noreply@example.com',
				subject: template.name || 'Test Email',
				html,
				text,
			})

			return Response.json({
				success: true,
				message: 'Test email sent successfully',
			})
		} catch (error) {
			console.error('Preview email error:', error)
			return Response.json(
				{
					success: false,
					message: error instanceof Error ? error.message : 'Failed to send test email',
				},
				{ status: 500 }
			)
		}
	},
}

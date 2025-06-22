import { MarketingTemplate } from '@/payload/payload-types'
import DefaultBlueprint from '@/emails/blueprints/Default'
import { render } from '@react-email/render'
import React from 'react'

type EmailData = Record<string, unknown>

interface GenerateEmailOptions<T extends EmailData> {
	template: MarketingTemplate
	data: T
	/**
	 * Optional function to generate text version of the email
	 * If not provided, a basic text version will be created
	 */
	generateTextVersion?: (template: MarketingTemplate['email'], data: T) => string
}

export const generateEmailFromTemplate = async <T extends EmailData>({
	template,
	data,
	generateTextVersion,
}: GenerateEmailOptions<T>): Promise<{ html: string; text: string }> => {
	if (!template.email) {
		throw new Error('Template is not an email template')
	}

	// Render the email component to HTML
	const html = await render(
		React.createElement(DefaultBlueprint, {
			template: template.email,
			data,
			isPreview: false,
		})
	)

	// Generate text version
	const text = generateTextVersion
		? generateTextVersion(template.email, data)
		: `${template.email.previewText || ''}\n\nThis is a text-only version of the email.`

	return {
		html,
		text,
	}
}

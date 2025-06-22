import { MarketingTemplate } from '@/payload/payload-types'
import DefaultBlueprint from '@/emails/blueprints/Default'
import React from 'react'
import { Tailwind } from '@react-email/components'

interface Props {
	template: MarketingTemplate
}

const sampleData = {
	name: 'John Smith',
	email: 'john.smith@example.com',
	company: 'Acme Corp',
	role: 'CEO',
	phone: '+1 (555) 123-4567',
}

export const RenderTemplatePreview = ({ template }: Props) => {
	if (!template.email) return null

	return (
		<Tailwind>
			<DefaultBlueprint template={template.email} data={sampleData} isPreview={true} />
			<div className="max-w-3xl mx-auto font-sans">
				<div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<h3 className="text-blue-800 font-medium mb-2">Preview Mode</h3>
					<p className="text-blue-700 text-sm">
						This is a preview using sample data. Template variables will be replaced with the
						following values:
					</p>
					<pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
						{JSON.stringify(sampleData, null, 2)}
					</pre>
				</div>
			</div>
		</Tailwind>
	)
}

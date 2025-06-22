import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { RenderTemplatePreview } from '@/modules/marketing/RenderTemplatePreview'
import { headers } from 'next/headers'

interface Props {
	params: Promise<{ id: string }>
}

const TemplatePreviewPage = async ({ params }: Props) => {
	const { id } = await params
	const payload = await getPayload({ config })
	const nextHeaders = await headers()
	const { user } = await payload.auth({ headers: nextHeaders })

	const template = await payload.findByID({
		collection: 'marketing-templates',
		id,
		draft: true,
		overrideAccess: false,
		user,
	})

	return <RenderTemplatePreview template={template} />
}

export default TemplatePreviewPage

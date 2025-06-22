import { RichTextEmailBlockType } from '@/payload/payload-types'
import { RichText } from '@/modules/richText'
import React from 'react'
import { processContent } from '@/payload/collections/marketing/utils/templateHelpers'

type EmailData = Record<string, unknown>

interface Props<T extends EmailData> extends RichTextEmailBlockType {
	data?: T
}

export const RichTextEmailBlock = <T extends EmailData>({ content, data }: Props<T>) => {
	// Process content with template variables
	const processedContent = processContent(content, data)

	if (!content || !processedContent) return null

	return (
		<div className="richText">
			<RichText data={processedContent} container={false} typography={false} />
		</div>
	)
}

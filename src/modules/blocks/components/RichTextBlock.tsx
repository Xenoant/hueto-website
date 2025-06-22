import { RichText } from '@/modules/richText'
import { RichTextBlockType } from '@/payload/payload-types'
import React from 'react'

export const RichTextBlock = (props: RichTextBlockType) => {
	const { data, settings } = props || {}
	return (
		<RichText
			data={data}
			tag={settings?.htmlTag}
			container={settings?.containerType ?? 'default'}
			space={{ y: { size: settings?.spacing, type: settings?.spacingType } }}
		/>
	)
}

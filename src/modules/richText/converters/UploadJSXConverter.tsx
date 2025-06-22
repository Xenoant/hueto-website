import { AspectRatio } from '@/components/layout/AspectRatio'
import { Image } from '@/components/display/Media'
import { isImage } from '@/components/display/Media/utils'
import { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import type { FileData, TypeWithID } from 'payload'

export const UploadJSXConverter: JSXConverters<SerializedUploadNode> = {
	upload: ({ node }) => {
		const uploadDocument: {
			value?: FileData & TypeWithID & { alt?: string | undefined; thumbhash?: any }
		} = node as any

		const url = uploadDocument?.value?.url

		if (isImage(uploadDocument?.value?.mimeType) && typeof url === 'string') {
			return (
				<div className="not-prose w-full rounded-sm overflow-hidden">
					<AspectRatio ratio={16 / 9}>
						<Image
							src={url}
							fill={true}
							alt={uploadDocument?.value?.alt || uploadDocument?.value?.filename || ''}
							className="object-contain"
							thumbhash={uploadDocument?.value?.thumbhash}
						/>
					</AspectRatio>
				</div>
			)
		}

		return (
			<a href={url} rel="noopener noreferrer">
				{uploadDocument?.value?.filename}
			</a>
		)
	},
}

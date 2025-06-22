'use client'

import type { MediaProps, MediaData } from './types'
import { isImage, isVideo } from './utils'
import { Video } from './Video'
import { Image } from './Image'
import { cn } from '@/utils/cn'

export const Media = <T extends MediaData>({
	data,
	preferredVariants = [],
	imageProps = {},
	videoProps = {},
	supports = ['image'],
	className,
	fallback = null,
}: MediaProps<T>) => {
	// Return fallback for invalid media data
	if (!data || typeof data === 'string' || !('mimeType' in data)) {
		return fallback
	}

	// Ensure URL exists and is string
	const baseUrl = typeof data.url === 'string' ? data.url : undefined
	if (!baseUrl) return fallback

	if (isVideo(data.mimeType) && supports.includes('video')) {
		return <Video src={baseUrl} className={className} {...videoProps} />
	}

	if (isImage(data.mimeType) && supports.includes('image')) {
		// Priority: Payload data alt > prop alt > default of 'Media'
		const alt: string = ('alt' in data && data.alt) || ('alt' in imageProps && imageProps.alt) || 'Media'

		const thumbhash = 'thumbhash' in data ? data.thumbhash : undefined

		let finalUrl = baseUrl

		if ('sizes' in data && data.sizes) {
			for (const variant of preferredVariants) {
				const size = (data.sizes as Record<string, { url?: string }>)[variant as string]
				if (size?.url) {
					finalUrl = size.url
					break
				}
			}
		}

		return (
			<Image
				{...imageProps} // Spread first so src/alt/className can override
				src={finalUrl}
				alt={alt}
				thumbhash={thumbhash}
				className={cn(className, imageProps.className)}
			/>
		)
	}

	return fallback
}
Media.displayName = 'Media'

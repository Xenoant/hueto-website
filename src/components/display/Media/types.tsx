import { Media } from '@/payload-types'
import { type ImageProps as NextImageProps } from 'next/image'
import type { ReactNode, ComponentPropsWithRef } from 'react'

type Thumbhash =
	| {
			[k: string]: unknown
	  }
	| unknown[]
	| string
	| number
	| boolean
	| null
	| undefined

export type MediaData =
	| (Media & { thumbhash?: Thumbhash })
	// add more types of supported uploads here, just like Media
	| string
	| null
	| undefined

export type SupportedMedia = 'image' | 'video'

export type ImageProps = Omit<NextImageProps, 'placeholder'> & {
	disablePlaceholder?: boolean
	thumbhash?: Thumbhash
	blurMs?: number
}

export type VideoProps = ComponentPropsWithRef<'video'> & {
	src: string
}

export type MediaProps<T extends MediaData = MediaData> = {
	data: T
	preferredVariants?: ExtractSizesFromData<T>[]
	imageProps?: Partial<Omit<ImageProps, 'src'>>
	videoProps?: Omit<VideoProps, 'src'>
	supports?: Array<SupportedMedia>
	className?: string
	fallback?: ReactNode
}

/** Start of block that should not be edited */
// Helper type that extracts all possible size keys
type ExtractSizes<T> = T extends { sizes?: infer S } ? keyof S : never

// Create a more specific discriminated union type that only includes types with sizes
type MediaWithSizes = Extract<MediaData, { sizes?: any }>

// Get all possible size keys from media types that have sizes
export type ValidMediaSizes = ExtractSizes<MediaWithSizes>

// Helper type to extract sizes from a specific media type
type ExtractSizesFromData<T> = T extends any // Check if T is any
	? ValidMediaSizes // If it is any, show all possible sizes
	: T extends { sizes?: infer S }
		? keyof S
		: never // Otherwise, extract specific sizes
/** End of block that should not be edited */

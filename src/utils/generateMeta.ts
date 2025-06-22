import type { Metadata, ResolvedMetadata } from 'next'

import type { Media, Config } from '@/payload-types'

import { mergeOpenGraph } from '@/utils/mergeOpenGraph'
import { getServerSideURL } from './getURL'

type PayloadMetadata =
	| {
			title?: string | null
			description?: string | null
			image?: Media | string | null | undefined
			noIndex?: boolean | null | undefined
	  }
	| string
	| undefined

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
	const serverUrl = getServerSideURL()

	let url

	if (image && typeof image === 'object' && 'url' in image) {
		const ogUrl = image?.sizes?.og?.url

		// Ensure image URL is properly joined with base URL
		const imagePath = (ogUrl || image?.url || '').startsWith('/')
			? ogUrl || image?.url || ''
			: `/${ogUrl || image?.url || ''}`

		url = `${serverUrl}${imagePath}`
	}

	return url
}

export const generateMeta = async (args: {
	meta: PayloadMetadata
	fallback?: ResolvedMetadata
	pathname?: string
}): Promise<Metadata> => {
	const { meta: data, fallback, pathname } = args
	const seo = typeof data === 'object' ? data : undefined
	const isProd = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'

	const ogImage = getImageURL(seo?.image)

	const title = seo?.title
		? seo?.title
		: fallback?.title
			? fallback?.title
			: process.env.NEXT_PUBLIC_APP_NAME || ''
	const description = seo?.description
		? seo?.description
		: fallback?.description
			? fallback?.description
			: ''

	// Get base URL with guaranteed protocol
	const baseUrl = getServerSideURL()

	// Ensure pathname is properly formatted
	const formattedPathname = pathname ? (pathname.startsWith('/') ? pathname : `/${pathname}`) : ''

	return {
		title,
		description,
		openGraph: mergeOpenGraph({
			title,
			description,
			images: ogImage ? [{ url: ogImage }] : fallback?.openGraph?.images,
			url: formattedPathname ? `${baseUrl}${formattedPathname}` : baseUrl,
		}),
		robots:
			seo?.noIndex || !isProd
				? {
						index: false,
						follow: false,
						nocache: true,
						googleBot: {
							index: false,
							follow: false,
							noimageindex: true,
						},
					}
				: undefined,
		// TODO: optimize webmanifest and favicon standards
		// If needed, you can use this for an example for now.
		// manifest: '/site.webmanifest',
		// icons: {
		//   icon: [
		//     { rel: 'icon', url: '/favicon.ico' },
		//     { rel: 'icon', url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
		//     { rel: 'icon', url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
		//   ],
		//   apple: [{ rel: 'apple-touch-icon', url: '/apple-touch-icon.png' }],
		//   other: [
		//     { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
		//     { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
		//   ],
		// },
	}
}

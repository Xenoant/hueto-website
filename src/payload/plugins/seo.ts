import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateDescription, GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utils/getURL'
import { extractPlainText } from '../lexical/utils/extractPlainText'
import { truncateText } from '@/utils/truncateText'

const formatMetaTitle = (title?: string) => {
	return title
		? `${title}${process.env.NEXT_PUBLIC_APP_NAME && ' | ' + process.env.NEXT_PUBLIC_APP_NAME}`
		: ''
}

const generateTitle: GenerateTitle<Page | Post> = ({ doc, collectionSlug }) => {
	switch (collectionSlug) {
		case 'pages':
			return formatMetaTitle(doc?.title)
		case 'posts':
			return formatMetaTitle(doc?.title)
		default:
			return `Missing generate title function for: ${collectionSlug}`
	}
}

const generateDescription: GenerateDescription<Page | Post> = async ({ doc, collectionSlug }) => {
	if (!doc) return ''

	let plainText = ''

	switch (collectionSlug) {
		case 'pages':
			if ('content' in doc) {
				plainText = extractPlainText(doc.content)
			}
			break

		case 'posts':
			if ('article' in doc) {
				plainText = extractPlainText(doc.article)
			}
			break

		default:
			console.error(`Unsupported collection slug: ${collectionSlug}`)
			return ''
	}

	const truncatedText = truncateText(plainText, 147)

	return truncatedText
}

const generateURL: GenerateURL<Page> = ({ doc, collectionSlug }) => {
	switch (collectionSlug) {
		case 'pages':
			return `${getServerSideURL()}${doc?.pathname === '/' ? '' : doc?.pathname}`.replace(
				/^\/+/,
				'/'
			)
		case 'posts':
			return `${getServerSideURL()}/post/${doc?.slug}`
		default:
			return getServerSideURL()
	}
}

export const seo = seoPlugin({
	generateURL,
	generateTitle,
	generateDescription,
})

import { cache } from '@/utils/cache'
import { getServerSideURL } from '@/utils/getURL'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * TODO:
 * Add more context, explanations, flexibility, etc.
 * Perhaps we should include more fields in the "SEO" fields to specify update frequencies, etc.
 */

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency']

const collectionSettings = {
	pages: {
		priority: 0.8,
		changeFrequency: 'monthly' as ChangeFrequency,
	},
	posts: {
		priority: 0.7,
		changeFrequency: 'weekly' as ChangeFrequency,
	},
}

const getPages = cache(
	async () => {
		const payload = await getPayload({ config })
		const { docs: pages } = await payload.find({
			collection: 'pages',
			draft: false,
			overrideAccess: false,
			select: {
				updatedAt: true,
				pathname: true,
			},
			where: {
				'meta.noIndex': {
					equals: false,
				},
			},
		})
		return pages
	},
	{ revalidate: 3600, tags: ['pages'] },
	['sitemap-pages']
)

const getPosts = cache(
	async () => {
		const payload = await getPayload({ config })
		const { docs: posts } = await payload.find({
			collection: 'posts',
			draft: false,
			overrideAccess: false,
			select: {
				updatedAt: true,
				slug: true,
			},
			where: {
				'meta.noIndex': {
					equals: false,
				},
			},
		})
		return posts
	},
	{ revalidate: 3600, tags: ['posts'] },
	['sitemap-posts']
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getServerSideURL()

	// Fetch all content
	const [pages, posts] = await Promise.all([getPages(), getPosts()])

	const homepage = pages.find((page) => page.pathname === '/')

	const staticRoutes: MetadataRoute.Sitemap = [
		// this is for if you have a hardcoded page
		// this changes every time a blog post is made
		// {
		//   url: `${baseUrl}/blog`,
		//   priority: 0.8,
		//   changeFrequency: 'daily' as ChangeFrequency,
		//   lastModified:
		//     posts.length > 0
		//       ? new Date(Math.max(...posts.map((p) => new Date(p.updatedAt).getTime()))).toISOString()
		//       : new Date().toISOString(),
		// },
	]

	// Transform pages, handling homepage separately
	const pageRoutes = pages
		.filter((page) => page.pathname !== '/')
		.map((page) => ({
			url: `${baseUrl}${page.pathname}`,
			lastModified: new Date(page.updatedAt).toISOString(),
			...collectionSettings.pages,
		}))

	// Add homepage with highest priority
	if (homepage) {
		pageRoutes.unshift({
			url: baseUrl,
			lastModified: new Date(homepage.updatedAt).toISOString(),
			priority: 1.0,
			changeFrequency: 'daily' as const,
		})
	}

	// Transform posts
	const postRoutes = posts.map((post) => ({
		url: `${baseUrl}/post/${post.slug}`,
		lastModified: new Date(post.updatedAt).toISOString(),
		...collectionSettings.posts,
	}))

	return [...pageRoutes, ...staticRoutes, ...postRoutes]
}

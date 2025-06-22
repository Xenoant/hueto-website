import { cache } from '@/utils/cache'
import { getServerSideURL } from '@/utils/getURL'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency']

const collectionSettings = {
	page: {
		priority: 0.8,
		changeFrequency: 'monthly' as ChangeFrequency,
	},
	// post: {
	// 	priority: 0.7,
	// 	changeFrequency: 'weekly' as ChangeFrequency,
	// },
}

const getPages = async () => {
	const payload = await getPayload({ config })
	const { docs: pages } = await payload.find({
		collection: 'page',
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
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = getServerSideURL()

	// Fetch all content
	const [pages] = await Promise.all([getPages()])

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
			...collectionSettings.page,
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

	// Example: transform posts (blog posts, or other content types, team members with individual pages, etc.)
	// const postRoutes = posts.map((post) => ({
	// 	url: `${baseUrl}/post/${post.slug}`,
	// 	lastModified: new Date(post.updatedAt).toISOString(),
	// 	...collectionSettings.post,
	// }))

	return [...pageRoutes, ...staticRoutes /* ...postRoutes */]
}

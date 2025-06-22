import { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utils/getURL'

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getServerSideURL()
	const isProd = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'

	return {
		rules: isProd
			? {
					userAgent: '*',
					allow: '/',
					disallow: ['/admin', '/admin/', '/api', '/api/'],
				}
			: {
					userAgent: '*',
					disallow: '/',
				},
		sitemap: `${baseUrl}/sitemap.xml`,
	}
}

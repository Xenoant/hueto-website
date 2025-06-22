import { cache } from '@/utils/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'

interface GetPaginatedPostsArgs {
	page: number
	limit: number
}

const getPaginatedPostsData = async ({
	page,
	limit,
	draft,
}: GetPaginatedPostsArgs & { draft?: boolean }) => {
	const payload = await getPayload({ config })
	const result = await payload.find({
		collection: 'posts',
		limit,
		page,
		draft,
		overrideAccess: draft,
		disableErrors: true,
	})

	return result
}

const getCachedPaginatedPostsData = cache(
	async ({ page, limit }: GetPaginatedPostsArgs) => {
		return getPaginatedPostsData({ page, limit, draft: false })
	},
	{ tags: ['posts'] }
)

export const getPaginatedPosts = async ({ page, limit }: GetPaginatedPostsArgs) => {
	const { isEnabled: draft } = await draftMode()

	if (draft) {
		return getPaginatedPostsData({ page, limit, draft: true })
	}

	return getCachedPaginatedPostsData({ page, limit })
}

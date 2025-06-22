import { ArchiveBlockType, Post, Config } from '@/payload/payload-types'
import { isExpanded } from '@/utils/isExpanded'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Block } from '../Block'

type ArchiveData = Post[]

type TargetConfig = {
	collection: keyof Config['collections']
	type: 'posts'
}

const TARGET_CONFIGS: Record<string, TargetConfig> = {
	posts: {
		collection: 'posts',
		type: 'posts',
	},
}

// Separate data fetching logic
async function fetchArchiveData(props: ArchiveBlockType): Promise<ArchiveData> {
	const { type, target, posts, query } = props
	const payload = await getPayload({ config })

	try {
		switch (type) {
			case 'query': {
				if (!target) return []
				const config = TARGET_CONFIGS[target]
				if (!config) return []

				const response = await payload.find({
					collection: config.collection,
					limit: query?.limit ?? undefined,
				})

				return response.docs as ArchiveData
			}

			case 'static': {
				if (!target) return []
				const config = TARGET_CONFIGS[target]
				if (!config) return []

				switch (config.type) {
					case 'posts':
						return posts?.filter((post): post is Post => isExpanded<Post>(post)) ?? []
					default:
						return []
				}
			}

			default:
				return []
		}
	} catch (error) {
		console.error('Error fetching archive data:', error)
		return []
	}
}

export const ArchiveBlock = async (props: ArchiveBlockType) => {
	const { prefix, settings, target } = props
	const data = await fetchArchiveData(props)
	return (
		<Block settings={settings} prefix={prefix}>
			{target === 'posts' && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{(data as Post[]).map((article) => (
						<div key={article.id}>{article.title}</div>
					))}
				</div>
			)}
		</Block>
	)
}

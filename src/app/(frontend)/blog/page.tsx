import { BlogPagination } from '@/modules/blog/BlogPagination'
import { blogSearchParams } from '@/modules/blog/blogSearchParams'
import { getPaginatedPosts } from '@/modules/blog/data'
import { SearchParams } from 'nuqs/server'
import React from 'react'

interface BlogPageProps {
	searchParams: Promise<SearchParams>
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
	const { page, limit } = await blogSearchParams.parse(searchParams)
	const posts = await getPaginatedPosts({ page, limit })

	return (
		<div>
			{posts?.docs?.map((post) => <div key={post.id}>{post.title}</div>)}
			<BlogPagination totalPages={posts?.totalPages ?? 0} />
		</div>
	)
}

export default BlogPage

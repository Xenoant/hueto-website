import { findOneBySlug } from '@/modules/common/data'
import { RichText } from '@/modules/richText'
import { isObject } from '@/utils/isObject'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
	params: Promise<{
		slug: string
	}>
}

export const PostPage = async ({ params }: Props) => {
	const { slug } = await params
	const post = await findOneBySlug({ collection: 'posts', slug })

	if (!post || !isObject(post)) notFound()

	return (
		<>
			<h1 className="container-post">{post?.title}</h1>
			<RichText data={post.article} container={'post'} />
		</>
	)
}

export default PostPage

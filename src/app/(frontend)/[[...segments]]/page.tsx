import { BlocksRenderer } from '@/modules/blocks/BlocksRenderer'
import { getAllPagePathnameSegments, getPageByPathname } from '@/modules/common/data'
import { generateMeta } from '@/utils/generateMeta'
import { resolvePathname } from '@/utils/resolvePathname'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
	params: Promise<{
		segments: string[]
	}>
}

const Pages = async ({ params }: Props) => {
	const { segments } = await params
	const pathname = resolvePathname(segments)
	const page = await getPageByPathname(pathname)

	if (!page) notFound()

	return (
		<>
			<BlocksRenderer blocks={page?.blocks} />
		</>
	)
}

export const generateStaticParams = async () => {
	return await getAllPagePathnameSegments()
}

export const generateMetadata = async (
	{ params }: Props,
	parentPromise: ResolvingMetadata
): Promise<Metadata> => {
	const { segments } = await params
	const pathname = resolvePathname(segments)
	const page = await getPageByPathname(pathname)

	const fallback = await parentPromise

	return await generateMeta({ meta: page?.meta, fallback, pathname })
}

export default Pages

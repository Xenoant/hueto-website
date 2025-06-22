import { RichTextEmailBlockType } from '@/payload/payload-types'
import { RichTextEmailBlock } from './email/RichTextEmailBlock.component'

type Block = RichTextEmailBlockType
type EmailData = Record<string, unknown>

interface Props<T extends EmailData> {
	blocks?: Array<Block> | null | undefined
	data?: T
}

export const RenderEmailBlocks = <T extends EmailData>({ blocks, data }: Props<T>) => {
	if (!blocks?.length) return null

	return blocks.map((block) => {
		switch (block.blockType) {
			case 'richTextEmail':
				return <RichTextEmailBlock key={block.id} {...block} data={data} />
			default:
				return (
					<div className="text-red-700 font-semibold">Unsupported blockType: {block.blockType}</div>
				)
		}
	})
}

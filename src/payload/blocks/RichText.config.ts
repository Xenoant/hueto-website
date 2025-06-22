import { Block } from 'payload'
import { blocksEditor } from '../lexical/blocksEditor'
import { blockTabs } from '../fields/blockTabs/blockTabs'

export const RichText: Block = {
	slug: 'richText',
	interfaceName: 'RichTextBlockType',
	fields: [
		blockTabs({
			prefix: false,
			fields: [
				{
					name: 'data',
					label: 'Content',
					type: 'richText',
					editor: blocksEditor(),
				},
			],
		}),
	],
}

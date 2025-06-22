import { textEditor } from '@/payload/lexical/textEditor'
import { Block } from 'payload'

export const RichTextEmailBlock: Block = {
	slug: 'richTextEmail',
	interfaceName: 'RichTextEmailBlockType',
	labels: {
		singular: 'Rich Text',
		plural: 'Rich Text',
	},
	fields: [
		{
			name: 'content',
			type: 'richText',
			editor: textEditor(),
		},
	],
}

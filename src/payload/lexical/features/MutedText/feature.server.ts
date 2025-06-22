import { createNode, createServerFeature } from '@payloadcms/richtext-lexical'
import { MutedTextNode } from './feature.node'

export const MutedTextFeature = createServerFeature({
	feature: {
		ClientFeature: './lexical/features/MutedText/feature.client#MutedTextClientFeature',
		nodes: [
			createNode({
				node: MutedTextNode,
				converters: {
					html: {
						converter: ({ node }) => {
							return `<span>${node.text}</span>`
						},
						nodeTypes: [MutedTextNode.getType()],
					},
				},
			}),
		],
	},
	key: 'textMuted',
})

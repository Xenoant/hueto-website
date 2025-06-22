import { SerializedMutedTextNode } from '@/payload/lexical/features/MutedText/feature.node'
import { DefaultNodeTypes, SerializedBlockNode, SerializedInlineBlockNode } from '@payloadcms/richtext-lexical'
import { JSXConverter, JSXConverters, SerializedLexicalNodeWithParent } from '@payloadcms/richtext-lexical/react'

type ExpectedConverterTypes = DefaultNodeTypes | SerializedBlockNode<any> | SerializedInlineBlockNode<any>

type ConverterArgs = {
	childIndex: number
	converters: JSXConverters<ExpectedConverterTypes>
	node: SerializedMutedTextNode
	nodesToJSX: (args: { nodes: any[] }) => React.ReactNode[]
	parent: SerializedLexicalNodeWithParent
}

export const MutedTextJSXConverter: { mutedText: JSXConverter<SerializedMutedTextNode> } = {
	mutedText: (args: ConverterArgs) => {
		const { node, childIndex } = args
		let className = 'text-muted-foreground'

		if (node.format & 1) className += ' font-bold'
		if (node.format & 2) className += ' italic'
		if (node.format & 4) className += ' underline'
		if (node.format & 8) className += ' line-through'
		if (node.format & 16) className += ' font-mono'

		return (
			<span key={childIndex} className={className}>
				{node.text}
			</span>
		)
	},
}

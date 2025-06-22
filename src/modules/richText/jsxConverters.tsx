import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { LinkJSXConverter } from './converters/LinkJSXConverter'
import { internalDocToHref } from '@/utils/internalDocToHref'
import { ButtonBlockType } from '@/payload-types'

import { ButtonBlock } from '@/modules/richText/blocks/ButtonBlock'
import { UploadJSXConverter } from './converters/UploadJSXConverter'
import { SerializedMutedTextNode } from '@/payload/lexical/features/MutedText/feature.node'
import { MutedTextJSXConverter } from './converters/MutedTextJSXConverter'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<ButtonBlockType> | SerializedMutedTextNode

export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
	...defaultConverters,
	...LinkJSXConverter({ internalDocToHref }),
	...UploadJSXConverter,
	...MutedTextJSXConverter,
	blocks: {
		button: ({ node }) => <ButtonBlock {...node.fields} />,
	},
})

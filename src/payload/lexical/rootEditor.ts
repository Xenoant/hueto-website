import {
	AlignFeature,
	BlockquoteFeature,
	BoldFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	IndentFeature,
	InlineCodeFeature,
	InlineToolbarFeature,
	ItalicFeature,
	lexicalEditor,
	LinkFeature,
	OrderedListFeature,
	ParagraphFeature,
	StrikethroughFeature,
	TreeViewFeature,
	UnderlineFeature,
	UnorderedListFeature,
	UploadFeature,
} from '@payloadcms/richtext-lexical'
import { MutedTextFeature } from './features/MutedText/feature.server'

/**
 * Features supported in all editor types, minus blocks, to prevent circular dependencies
 */
export const rootEditor = lexicalEditor({
	features: () => {
		const coreFeatures = [
			MutedTextFeature(),
			BoldFeature(),
			ItalicFeature(),
			UnderlineFeature(),
			StrikethroughFeature(),
			InlineCodeFeature(),
			ParagraphFeature(),
			HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
			AlignFeature(),
			IndentFeature(),
			UnorderedListFeature(),
			OrderedListFeature(),
			BlockquoteFeature(),
			HorizontalRuleFeature(),
			InlineToolbarFeature(),
			LinkFeature(),
			UploadFeature({
				collections: {
					media: { fields: [] },
				},
			}),
		]

		if (process.env.LEXICAL_TREE_VIEW) {
			coreFeatures.push(TreeViewFeature())
		}

		return coreFeatures
	},
})

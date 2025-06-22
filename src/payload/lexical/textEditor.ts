import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { LexicalEditorProps } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

type Options = {
	admin?: LexicalEditorProps['admin']
	headings?: boolean | Array<'h1' | 'h2' | 'h3'>
	align?: boolean
	blocks?: Block[]
}

/**
 * Basically used to filter out features that may not be supported within a particular context.
 * Allows users to provide rich text in areas where you may only opt to allow "text",
 * but perhaps wish to still enable them to add a link, or use simple richtext elements.
 */
export const textEditor = ({ admin, headings = true, align = true, blocks = [] }: Options = {}) => {
	return lexicalEditor({
		admin,
		features({ rootFeatures }) {
			const filteredFeatures = rootFeatures.filter((feature) => {
				const featureName = feature?.key
				const featuresToRemove = [
					'unorderedList',
					'orderedList',
					'blockquote',
					'indent',
					'horizontalRule',
				]

				if (headings === false && featureName === 'heading') {
					return false
				}

				if (align === false && featureName === 'align') {
					return false
				}

				return !featuresToRemove.includes(featureName)
			})

			const customizedFeatures = filteredFeatures.map((feature) => {
				const featureName = feature?.key

				if (featureName === 'heading' && Array.isArray(headings)) {
					return HeadingFeature({
						enabledHeadingSizes: headings,
					})
				}

				return feature
			})

			if (blocks && Array.isArray(blocks) && blocks?.length > 0) {
				customizedFeatures.push(BlocksFeature({ blocks }))
			}

			return customizedFeatures
		},
	})
}

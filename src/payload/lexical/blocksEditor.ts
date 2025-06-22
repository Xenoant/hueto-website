import { BlocksFeature, HeadingFeature, lexicalEditor, type LexicalEditorProps } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { Blocks } from './blocks'

type Options = {
	admin?: LexicalEditorProps['admin']
	headings?: boolean | Array<'h1' | 'h2' | 'h3' | 'h4'>
	align?: boolean
	blocks?: Block[]
}

export const blocksEditor = ({ admin, headings = ['h1', 'h2', 'h3'], align = true, blocks = [] }: Options = {}) => {
	return lexicalEditor({
		admin,
		features({ rootFeatures }) {
			const filteredFeatures = rootFeatures.filter((feature) => {
				const featureName = feature?.key
				// const featuresToRemove = []

				if (headings === false && featureName === 'heading') {
					return false
				}

				if (align === false && featureName === 'align') {
					return false
				}

				// return !featuresToRemove.includes(featureName)
				return true
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

			return [
				BlocksFeature({
					blocks: blocks?.length > 0 ? blocks : [...Object.values(Blocks)],
				}),
				...customizedFeatures,
			]
		},
	})
}

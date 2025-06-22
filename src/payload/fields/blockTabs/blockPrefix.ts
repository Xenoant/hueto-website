import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import { RichTextField } from 'payload'
import { textEditor } from '../../lexical/textEditor'

type BlockPrefix = (options?: { overrides?: DeepPartial<RichTextField> }) => RichTextField

export const blockPrefix: BlockPrefix = ({ overrides = {} } = {}) => {
	const field: RichTextField = {
		name: 'prefix',
		type: 'richText',
		editor: textEditor({ headings: ['h2', 'h3'] }),
		admin: {
			condition: (_, siblingData) => siblingData?.settings?.withPrefix,
		},
	}

	return deepMerge(field, overrides)
}

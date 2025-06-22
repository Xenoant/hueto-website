import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import type { LabelFunction, SelectField, StaticLabel } from 'payload'

type TagVariant = 'div' | 'section' | 'article'

const tagOptions: Record<
	TagVariant,
	{
		label: LabelFunction | StaticLabel
		value: string
	}
> = {
	div: {
		label: 'div',
		value: 'div',
	},
	section: {
		label: 'section',
		value: 'section',
	},
	article: {
		label: 'article',
		value: 'article',
	},
}

type HTMLFieldType = (options?: {
	tags?: TagVariant[]
	overrides?: DeepPartial<SelectField>
}) => SelectField

export const htmlTag: HTMLFieldType = ({ tags, overrides = {} } = {}) => {
	const field: SelectField = {
		name: 'htmlTag',
		label: {
			en: 'HTML Tag',
			de: '...',
		},
		type: 'select',
		admin: {
			isClearable: false,
			width: '50%',
		},
		options: [],
	}

	let optionsToUse = [tagOptions.div, tagOptions.section, tagOptions.article]

	if (tags) {
		optionsToUse = tags.map((tag) => tagOptions[tag])

		if (!tags.includes('div') && !overrides.defaultValue) {
			field.defaultValue = tags[0]
		}
	} else {
		if (!overrides.defaultValue) {
			field.defaultValue = 'div'
		}
	}

	field.options = optionsToUse

	return deepMerge(field, overrides)
}

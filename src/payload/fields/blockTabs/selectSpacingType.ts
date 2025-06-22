import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import { LabelFunction, SelectField, StaticLabel } from 'payload'

export type SpacingVariants = 'padding' | 'margin'

export const spacingOptions: Record<
	SpacingVariants,
	{ label: LabelFunction | StaticLabel; value: string }
> = {
	padding: {
		label: 'Padding',
		value: 'padding',
	},
	margin: {
		label: 'Margin',
		value: 'margin',
	},
}
type SpacingType = (options?: {
	variants?: SpacingVariants[]
	overrides?: DeepPartial<SelectField>
}) => SelectField

export const selectSpacingType: SpacingType = ({ variants, overrides = {} } = {}) => {
	const spacingResult: SelectField = {
		name: 'spacingType',
		type: 'select',
		admin: { isClearable: false },
		options: [],
	}

	let variantsToUse = [spacingOptions.margin, spacingOptions.padding]

	if (variants) {
		variantsToUse = variants.map((variant) => spacingOptions[variant])

		if (!variants.includes('margin') && !overrides.defaultValue) {
			spacingResult.defaultValue = variants[0]
		}
	} else {
		if (!overrides.defaultValue) {
			spacingResult.defaultValue = 'margin'
		}
	}

	variantsToUse.map((option) => spacingResult.options.push(option))

	return deepMerge(spacingResult, overrides)
}

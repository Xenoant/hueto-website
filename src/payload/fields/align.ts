import { deepMerge, type DeepPartial } from '@/utils/deepMerge'
import { LabelFunction, SelectField, StaticLabel } from 'payload'

export type AlignVariants = 'none' | 'left' | 'center' | 'right' | 'fullWidth'

export const variantOptions: Record<
	AlignVariants,
	{ label: LabelFunction | StaticLabel; value: string }
> = {
	none: {
		label: 'None',
		value: 'none',
	},
	left: {
		label: 'Left',
		value: 'left',
	},
	center: {
		label: 'Center',
		value: 'center',
	},
	right: {
		label: 'Right',
		value: 'right',
	},
	fullWidth: {
		label: 'Full Width',
		value: 'fullWidth',
	},
}

type AlignType = (options?: {
	variants?: AlignVariants[]
	overrides?: DeepPartial<SelectField>
}) => SelectField

export const align: AlignType = ({ variants, overrides = {} } = {}) => {
	const field: SelectField = {
		name: 'align',
		type: 'select',
		admin: {
			isClearable: false,
			width: '33.333%',
		},
		options: [],
	}

	let variantsToUse = [
		variantOptions.none,
		variantOptions.left,
		variantOptions.center,
		variantOptions.right,
		variantOptions.fullWidth,
	]

	if (variants) {
		variantsToUse = variants.map((variant) => variantOptions[variant])

		if (!variants?.includes('left') && !overrides.defaultValue) {
			field.defaultValue = variants[0]
		}
	} else {
		if (!overrides.defaultValue) {
			field.defaultValue = 'left'
		}
	}

	variantsToUse.map((option) => field.options.push(option))

	return deepMerge(field, overrides)
}

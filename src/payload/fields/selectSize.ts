import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import type { LabelFunction, SelectField, StaticLabel } from 'payload'

export type SizeVariants = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const variantOptions: Record<
	SizeVariants,
	{ label: LabelFunction | StaticLabel; value: string }
> = {
	none: {
		label: 'None',
		value: 'none',
	},
	xs: {
		label: 'XS',
		value: 'xs',
	},
	sm: {
		label: 'SM',
		value: 'sm',
	},
	md: {
		label: 'MD',
		value: 'md',
	},
	lg: {
		label: 'LG',
		value: 'lg',
	},
	xl: {
		label: 'XL',
		value: 'xl',
	},
}

type SizeType = (options?: {
	variants?: SizeVariants[]
	overrides?: DeepPartial<SelectField>
}) => SelectField

export const selectSize: SizeType = ({ variants, overrides = {} } = {}) => {
	const sizeResult: SelectField = {
		name: 'size',
		type: 'select',
		admin: { isClearable: false },
		options: [],
	}

	let variantsToUse = [
		variantOptions.none,
		variantOptions.xs,
		variantOptions.sm,
		variantOptions.md,
		variantOptions.lg,
		variantOptions.xl,
	]

	if (variants) {
		variantsToUse = variants.map((variant) => variantOptions[variant])

		if (!variants.includes('md') && !overrides.defaultValue) {
			sizeResult.defaultValue = variants[0]
		}
	} else {
		if (!overrides.defaultValue) {
			sizeResult.defaultValue = 'md'
		}
	}

	variantsToUse.map((option) => sizeResult.options.push(option))

	return deepMerge(sizeResult, overrides)
}

import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import { SelectField } from 'payload'

export type ColumnVariants = 1 | 2 | 3 | 4 | 6 | 12

export const variantOptions: Record<ColumnVariants, { label: string; value: string }> = {
	1: {
		label: '1',
		value: '1',
	},
	2: {
		label: '2',
		value: '2',
	},
	3: {
		label: '3',
		value: '3',
	},
	4: {
		label: '4',
		value: '4',
	},
	6: {
		label: '6',
		value: '6',
	},
	12: {
		label: '12',
		value: '12',
	},
}

type ColumnsType = (options?: {
	variants?: ColumnVariants[]
	overrides?: DeepPartial<SelectField>
}) => SelectField

export const selectColumns: ColumnsType = ({ variants, overrides = {} } = {}) => {
	const sizeResult: SelectField = {
		name: 'size',
		type: 'select',
		admin: { isClearable: false },
		options: [],
	}

	let variantsToUse = [
		variantOptions[1],
		variantOptions[2],
		variantOptions[3],
		variantOptions[4],
		variantOptions[6],
		variantOptions[12],
	]

	if (variants) {
		variantsToUse = variants.map((variant) => variantOptions[variant])

		if (!variants.includes(3) && !overrides.defaultValue) {
			sizeResult.defaultValue = variants[0]
		}
	} else {
		if (!overrides.defaultValue) {
			sizeResult.defaultValue = '3'
		}
	}

	variantsToUse.map((option) => sizeResult.options.push(option))

	return deepMerge(sizeResult, overrides)
}

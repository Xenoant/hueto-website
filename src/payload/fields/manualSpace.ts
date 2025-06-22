import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import { NumberField } from 'payload'

type ManualSpaceType = (options?: { overrides?: DeepPartial<NumberField> }) => NumberField

export const manualSpace: ManualSpaceType = ({ overrides = {} } = {}) => {
	const field: NumberField = {
		name: 'space',
		type: 'number',
		defaultValue: false,
		admin: {
			width: '33.333%',
		},
	}

	return deepMerge(field, overrides)
}

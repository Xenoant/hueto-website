import { ContainerVariantProps } from '@/styles/variants/containerVariants'
import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import { LabelFunction, SelectField, StaticLabel } from 'payload'

type ContainerTypeVariant = NonNullable<ContainerVariantProps['type']>

export const containerOptions: Record<
	ContainerTypeVariant,
	{ label: LabelFunction | StaticLabel; value: string }
> = {
	none: {
		label: 'None',
		value: 'none',
	},
	default: {
		label: 'Default',
		value: 'default',
	},
	post: {
		label: 'Post',
		value: 'post',
	},
}

type ContainerField = (options?: {
	types?: ContainerTypeVariant[]
	overrides?: DeepPartial<SelectField>
}) => SelectField

export const containerType: ContainerField = ({ types, overrides = {} } = {}) => {
	const field: SelectField = {
		name: 'containerType',
		type: 'select',
		admin: {
			isClearable: false,
			width: '50%',
		},
		options: [],
	}

	let typesToUse = [containerOptions.none, containerOptions.default, containerOptions.post]

	if (types) {
		typesToUse = types.map((type) => containerOptions[type])

		if (!types.includes('default') && !overrides.defaultValue) {
			field.defaultValue = types[0]
		}
	} else {
		if (!overrides.defaultValue) {
			field.defaultValue = 'default'
		}
	}

	field.options = typesToUse

	return deepMerge(field, overrides)
}

import { deepMerge } from '@/utils/deepMerge'
import type { Field, Tab, TabsField, RichTextField } from 'payload'
import { blockPrefix } from './blockPrefix'
import { selectSize } from '../selectSize'
import { htmlTag } from './htmlTag'
import { containerType } from './containerType'
import { selectSpacingType } from './selectSpacingType'

type BlockTabsOptions = {
	fields?: Field[]
	settings?: Field[]
	beforeSettings?: Tab[]
	afterSettings?: Tab[]
	prefix?: boolean | RichTextField
	overrides?: Partial<TabsField>
}

export const blockTabs = ({
	fields = [],
	prefix = true,
	settings,
	beforeSettings = [],
	afterSettings = [],
	overrides = {},
}: BlockTabsOptions = {}) => {
	const baseField: TabsField = {
		type: 'tabs',
		tabs: [
			{
				label: 'General',
				fields: [
					...(typeof prefix === 'boolean' ? (prefix ? [blockPrefix()] : []) : [prefix]),
					...fields,
				],
			},
			...beforeSettings,
			{
				label: 'Settings',
				name: 'settings',
				fields: [
					{
						name: 'id',
						type: 'text',
						admin: {
							description:
								'Unique ID field, applied to the HTML component wrapping this block. Useful for links to be able to navigate to this particular block on a page.',
						},
					},
					...(settings || [
						{
							type: 'row',
							fields: [htmlTag(), containerType()],
						},
						{
							type: 'row',
							fields: [
								selectSize({ overrides: { name: 'spacing', admin: { width: '50%' } } }),
								selectSpacingType({
									overrides: { admin: { width: '50%' }, defaultValue: 'padding' },
								}),
							],
						},
					]),
					...(prefix !== false
						? [
								{
									name: 'withPrefix',
									type: 'checkbox',
									defaultValue: true,
								} as Field,
							]
						: []),
				],
			},
			...afterSettings,
		],
	}

	return deepMerge(baseField, overrides)
}

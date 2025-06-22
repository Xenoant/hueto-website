import type { Field, LabelFunction, StaticLabel } from 'payload'
import { deepMerge } from '@/utils/deepMerge'
import { selectSize } from '../selectSize'

export type LinkAppearances = 'default' | 'secondary' | 'outline' | 'ghost' | 'link'

export const appearanceOptions: Record<
	LinkAppearances,
	{ label: LabelFunction | StaticLabel; value: string }
> = {
	default: {
		label: 'Primary',
		value: 'default',
	},
	secondary: {
		label: 'Secondary',
		value: 'secondary',
	},
	outline: {
		label: 'Outline',
		value: 'outline',
	},
	ghost: {
		label: 'Ghost',
		value: 'ghost',
	},
	link: {
		label: 'Anchor',
		value: 'link',
	},
}

type LinkType = (options?: {
	appearances?: LinkAppearances[] | false
	disableLabel?: boolean
	overrides?: Record<string, unknown>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
	const linkResult: Field = {
		name: 'link',
		type: 'group',
		interfaceName: 'LinkProps',
		admin: {
			hideGutter: true,
		},
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'type',
						type: 'radio',
						admin: {
							layout: 'horizontal',
							width: '50%',
						},
						defaultValue: 'reference',
						options: [
							{
								label: 'Internal Link',
								value: 'reference',
							},
							{
								label: 'Custom URL',
								value: 'custom',
							},
						],
					},
					{
						name: 'newTab',
						type: 'checkbox',
						admin: {
							style: {
								alignSelf: 'flex-end',
							},
							width: '50%',
						},
						label: 'Open in new tab',
					},
				],
			},
		],
	}

	const linkTypes: Field[] = [
		{
			name: 'reference',
			type: 'relationship',
			admin: {
				condition: (_, siblingData) => siblingData?.type === 'reference',
				width: '50%',
			},
			label: 'Document to link to',
			relationTo: ['pages'],
			required: true,
		},
		{
			name: 'url',
			type: 'text',
			admin: {
				condition: (_, siblingData) => siblingData?.type === 'custom',
				width: '50%',
			},
			label: 'Custom URL',
			required: true,
		},
	]

	if (!disableLabel) {
		linkTypes.map((linkType) => ({
			...linkType,
			admin: {
				...linkType.admin,
				width: '50%',
			},
		}))

		linkResult.fields.push({
			type: 'row',
			fields: [
				...linkTypes,
				{
					name: 'label',
					type: 'text',
					admin: {
						width: '50%',
					},
					required: true,
				},
			],
		})
	} else {
		linkResult.fields = [...linkResult.fields, ...linkTypes]
	}

	if (appearances !== false) {
		let appearanceOptionsToUse = [
			appearanceOptions.default,
			appearanceOptions.secondary,
			appearanceOptions.outline,
			appearanceOptions.ghost,
			appearanceOptions.link,
		]

		if (appearances) {
			appearanceOptionsToUse = appearances.map((option) => appearanceOptions[option])
		}

		linkResult.fields.push({
			type: 'row',
			fields: [
				{
					name: 'appearance',
					type: 'select',
					admin: {
						width: '33.333%',
						description: 'Choose how the link should be rendered',
					},
					defaultValue: 'default',
					options: appearanceOptionsToUse,
				},
				selectSize({
					variants: ['sm', 'md', 'lg', 'xl'],
					overrides: {
						defaultValue: 'md',
					},
				}),
				{
					name: 'icon',
					type: 'select',
					admin: {
						width: '33.333%',
					},
					defaultValue: 'none',
					options: [
						{
							label: 'None',
							value: 'none',
						},
						{
							label: 'Arrow Right',
							value: 'arrowRight',
						},
						{
							label: 'Arrow Left',
							value: 'arrowLeft',
						},
					],
				},
			],
		})
	}
	return deepMerge(linkResult, overrides)
}

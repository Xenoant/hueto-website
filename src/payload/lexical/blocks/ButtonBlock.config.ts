import { linkGroup } from '@/payload/fields/link/linkGroup'
import { align } from '@/payload/fields/align'
import { manualSpace } from '@/payload/fields/manualSpace'
import { Block } from 'payload'

export const ButtonBlock: Block = {
	slug: 'button',
	interfaceName: 'ButtonBlockType',
	fields: [
		linkGroup({
			overrides: {
				defaultValue: [{}],
			},
		}),
		{
			type: 'collapsible',
			label: 'Settings',
			admin: {
				initCollapsed: true,
				style: {
					marginBottom: 0,
				},
			},
			fields: [
				{
					name: 'settings',
					label: false,
					type: 'group',
					admin: {
						hideGutter: true,
					},
					fields: [
						{
							name: 'marginTop',
							type: 'group',
							admin: {
								hideGutter: true,
							},
							fields: [
								{
									type: 'row',
									fields: [
										manualSpace({
											overrides: {
												name: 'mobile',
												label: 'Mobile',
											},
										}),
										manualSpace({
											overrides: {
												name: 'tablet',
												label: 'Tablet',
											},
										}),
										manualSpace({
											overrides: {
												name: 'desktop',
												label: 'Desktop',
											},
										}),
									],
								},
							],
						},
						{
							name: 'marginBottom',
							type: 'group',
							admin: {
								hideGutter: true,
							},
							fields: [
								{
									type: 'row',
									fields: [
										manualSpace({
											overrides: {
												name: 'mobile',
												label: 'Mobile',
											},
										}),
										manualSpace({
											overrides: {
												name: 'tablet',
												label: 'Tablet',
											},
										}),
										manualSpace({
											overrides: {
												name: 'desktop',
												label: 'Desktop',
											},
										}),
									],
								},
							],
						},
						{
							name: 'align',
							type: 'group',
							admin: {
								hideGutter: true,
							},
							fields: [
								{
									type: 'row',
									fields: [
										align({
											overrides: {
												name: 'mobile',
												label: 'Mobile',
											},
										}),
										align({
											overrides: {
												name: 'tablet',
												label: 'Tablet',
											},
										}),
										align({
											overrides: {
												name: 'desktop',
												label: 'Desktop',
											},
										}),
									],
								},
							],
						},
					],
				},
			],
		},
	],
}

import { Block } from 'payload'
import { blockTabs } from '../fields/blockTabs/blockTabs'

export const Archive: Block = {
	slug: 'archive',
	interfaceName: 'ArchiveBlockType',
	fields: [
		blockTabs({
			fields: [
				{
					name: 'target',
					type: 'select',
					defaultValue: 'posts',
					options: [
						{
							label: 'Posts',
							value: 'posts',
						},
					],
				},
				{
					name: 'type',
					type: 'select',
					options: [
						{
							label: 'Query',
							value: 'query',
						},
						{
							label: 'Static',
							value: 'static',
						},
					],
				},
				{
					name: 'posts',
					type: 'relationship',
					relationTo: 'posts',
					hasMany: true,
					admin: {
						condition: (_, siblingData) =>
							siblingData?.type === 'static' && siblingData?.target === 'posts',
					},
				},
				{
					type: 'group',
					name: 'query',
					admin: {
						condition: (_, siblingData) => siblingData?.type === 'query',
					},
					fields: [
						{
							name: 'limit',
							type: 'number',
							defaultValue: 5,
							min: 0,
							max: 20,
							admin: {
								step: 1,
							},
						},
					],
				},
			],
		}),
	],
}

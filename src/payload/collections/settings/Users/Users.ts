import type { CollectionConfig } from 'payload'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { access, accessField } from '@/payload/access'
import { adminMenuGroups } from '@/payload/config/labels/adminMenuGroups'

/**
 * TODO:
 * Report bug, that defaultValue is invalid on /admin/create-first-user route
 */
export const Users: CollectionConfig = {
	slug: 'users',
	admin: {
		useAsTitle: 'email',
		group: adminMenuGroups.settings,
	},
	auth: true,
	access: {
		create: access(), // admin only
		read: access({ query: (args) => ({ id: { equals: args.req?.user?.id } }) }), // self or admin
		update: access({ query: (args) => ({ id: { equals: args.req?.user?.id } }) }), // self or admin
		delete: access(), // admin only
	},
	fields: [
		{
			name: 'roles',
			type: 'select',
			hasMany: true,
			required: true,
			hooks: {
				beforeChange: [ensureFirstUserIsAdmin],
			},
			access: {
				update: accessField(), // admin only
			},
			options: [
				{
					label: 'Admin',
					value: 'admin',
				},
				{
					label: 'Editor',
					value: 'editor',
				},
			],
		},
	],
}

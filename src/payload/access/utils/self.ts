import { User } from '@/payload/payload-types'
import type { Where, AccessArgs } from 'payload'

/**
 * Creates a query that matches the current user's ID against a specified field
 *
 * @param {string} [field='id'] - The field to match against req.user.id
 * @returns {(args: { req: { user: PayloadUser } }) => Where} A function that returns a Where query
 *
 * @example
 * // Match against id field (default)
 * query: self()
 *
 * @example
 * // Match against custom field
 * query: self('owner')
 */
export const self = (field: string = 'id') => {
	return (args: AccessArgs<User>): Where => ({
		[field]: {
			equals: args.req?.user?.id,
		},
	})
}

import { PayloadRequest } from 'payload'
import { User } from '@/payload-types'

type AccessType = 'public' | 'restricted' | 'published'

type FieldAccessArgs = {
	data?: Partial<any> | undefined
	doc?: any
	id?: number | string
	req: PayloadRequest
	siblingData?: Partial<any> | undefined
}

type FieldCondition = (args: FieldAccessArgs) => boolean | Promise<boolean>

type RoleConfig = boolean | FieldCondition

type AccessFieldConfig = {
	type?: AccessType
	roles?: Partial<Record<User['roles'][number], RoleConfig>>
	condition?: FieldCondition
	adminLock?: boolean
}

// need to write unit tests
/**
 * Creates a field access control function for Field level access
 * @param {AccessFieldConfig} [config] - Access control configuration
 * @param {AccessType} [config.type='restricted'] - Access type: 'public', 'restricted', or 'published'
 * @param {Object} [config.roles] - Role-specific access rules mapped to user roles
 * @param {FieldCondition} [config.condition] - Custom access condition function
 * @param {boolean} [config.adminLock] - Prevent admin override if true
 * @returns {Function} Async field access control function that returns boolean
 *
 * @example
 * // Public field
 * fields: [
 *   {
 *     name: "title",
 *     type: "text",
 *     access: {
 *       read: accessField({ type: 'public' })
 *     }
 *   }
 * ]
 *
 * @example
 * // Role-based access
 * fields: [
 *   {
 *     name: "price",
 *     type: "text",
 *     access: {
 *       read: accessField({
 *         roles: {
 *           editor: true,
 *           viewer: false
 *         }
 *       })
 *     }
 *   }
 * ]
 *
 * @example
 * // Conditional access
 * fields: [
 *   {
 *     name: "secret",
 *     type: "text",
 *     access: {
 *       read: accessField({
 *         condition: ({ req }) => req.user?.email?.endsWith('@company.com')
 *       })
 *     }
 *   }
 * ]
 *
 * @example
 * // Published content access
 * fields: [
 *   {
 *     name: "content",
 *     type: "richText",
 *     access: {
 *       read: accessField({
 *         type: 'published',
 *         roles: {
 *           editor: true // Editors can see unpublished content
 *         }
 *       })
 *     }
 *   }
 * ]
 *
 * @example
 * // Admin-locked field
 * fields: [
 *   {
 *     name: "apiKey",
 *     type: "text",
 *     access: {
 *       read: accessField({
 *         adminLock: true,
 *         roles: {
 *           developer: true // Only developers can access
 *         }
 *       })
 *     }
 *   }
 * ]
 */
export const accessField = (config?: AccessFieldConfig) => {
	return async (args: FieldAccessArgs): Promise<boolean> => {
		const type = config?.type || 'restricted'

		// Handle public access
		if (type === 'public') {
			return true
		}

		const user = args?.req?.user

		// Handle non-authenticated users
		if (!user) {
			// For published type, allow access to the field if the document is published
			if (type === 'published') {
				return args.doc?._status === 'published'
			}
			return false
		}

		// Admin access (unless explicitly locked)
		if (user.roles.includes('admin') && !config?.adminLock) {
			return true
		}

		// Process role-specific rules
		if (config?.roles) {
			const results: Promise<boolean>[] = []

			for (const role of user.roles) {
				const roleConfig = config.roles[role]

				if (roleConfig !== undefined) {
					// If it's a boolean, use it directly
					if (typeof roleConfig === 'boolean') {
						results.push(Promise.resolve(roleConfig))
					}
					// If it's a function, evaluate it
					else if (typeof roleConfig === 'function') {
						results.push(Promise.resolve(roleConfig(args)))
					}
				}
			}

			// If we have any results, return true if any are true
			if (results.length > 0) {
				const resolvedResults = await Promise.all(results)
				return resolvedResults.some((result) => result === true)
			}
		}

		// If no role-specific rules matched but there's a condition, use that
		if (config?.condition) {
			return await config.condition(args)
		}

		// For published type with no other access rules, check document status
		if (type === 'published') {
			return args.doc?._status === 'published'
		}

		// Otherwise return false
		return false
	}
}

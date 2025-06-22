import { AccessResult, AccessArgs as PayloadAccessArgs, Where } from 'payload'
import { User } from '@/payload-types'

type AccessType = 'public' | 'restricted' | 'published'

// Function that generates a Where query using access args
type DynamicQuery = (args: PayloadAccessArgs<'user'>) => Where

// RoleConfig can now be a static Where, boolean, or dynamic query function
type RoleConfig = Where | boolean | DynamicQuery

type AccessConfig = {
	type?: AccessType
	roles?: Partial<Record<User['roles'][number], RoleConfig>>
	query?: Where | DynamicQuery
	adminLock?: boolean
}

/**
 * Determines access permissions for a Payload CMS collection.
 *
 * The function returns either:
 * - A boolean (`true` for full access, `false` for no access)
 * - A `Where` query to filter documents.
 *
 * Supports different access levels (`public`, `restricted`, `published`) and
 * role-based or query-based access rules. Includes an optional `adminLock`
 * to restrict admin access.
 *
 * **Warning**: The `type: 'published'` option works only for collections with
 * `versions` enabled. Ensure `versions` are properly configured before using it.
 *
 * @param {AccessConfig} [config] - Configuration object for access rules.
 * @param {AccessType} [config.type] - Type of access control:
 *   - `'public'`: Unrestricted access (returns `true`).
 *   - `'restricted'`: Role-based or query-based access.
 *   - `'published'`: Restricts access to documents with `_status: 'published'`.
 * @param {Partial<Record<User['roles'][number], RoleConfig>>} [config.roles] - Role-based access configuration.
 *   Maps user roles to static queries (`Where`), booleans, or dynamic query functions.
 * @param {Where | DynamicQuery} [config.query] - A static `Where` query or a dynamic query function.
 *   Used as a fallback when no role-specific rules apply.
 * @param {boolean} [config.adminLock=false] - If `true`, prevents admins from automatically gaining access.
 *
 * @returns {function} - Access control function to be used at the collection level.
 *
 * The access function:
 * - Accepts `PayloadAccessArgs<'user'>` as an argument.
 * - Returns an `AccessResult`:
 *   - `true`: Grants full access.
 *   - `false`: Denies access.
 *   - `Where`: A query to filter accessible documents.
 *
 * @example
 * // Access control for a collection
 * access: {
 *   // Admin-only access
 *   create: access(),
 *
 *   // Published documents are visible to everyone. Otherwise, only admins.
 *   read: access({ type: 'published' }),
 *
 *   // In this instance, if the document.id matches the user.id, they will have access.
 *   // We can also disable access for admins by adding `adminLock`.
 *   update: access({
 *     query: (args) => ({
 *       id: { equals: args.req?.user?.id },
 *     }),
 *     adminLock: true,
 *   }),
 * },
 */
export const access = (config?: AccessConfig) => {
	return (args: PayloadAccessArgs<'user'>): AccessResult => {
		const type = config?.type || 'restricted'
		const publishedQuery = { _status: { equals: 'published' } }

		// handle public access
		if (type === 'public') {
			return true
		}

		const user = args?.req?.user

		if (!user) {
			return type === 'published' ? publishedQuery : false
		}

		// Admin gets access, unless explicitly removed by adminLock
		if (user.roles.includes('admin') && !config?.adminLock) {
			return true
		}

		const roleQueries: AccessResult[] = []

		// Collect all applicable role-based access results
		if (config?.roles) {
			for (const role of user?.roles) {
				const roleConfig = config.roles[role]
				if (roleConfig !== undefined) {
					// Handle function-based queries
					if (typeof roleConfig === 'function') {
						roleQueries.push(roleConfig(args))
					} else {
						roleQueries.push(roleConfig)
					}
				}
			}
		}

		// If we have role-specific results, find the most permissive one
		if (roleQueries.length > 0) {
			// If any role grants full access (true), return true
			if (roleQueries.some((query) => query === true)) {
				return true
			}

			// If we have Where queries, combine them with OR
			const whereQueries = roleQueries.filter((query): query is Where => typeof query === 'object')
			if (whereQueries.length > 0) {
				return whereQueries.length === 1 ? whereQueries[0] : { or: whereQueries }
			}

			// If we only had false values, return false
			return false
		}

		// Handle default query
		if (config?.query) {
			if (typeof config.query === 'function') {
				return config.query(args)
			}
			return config.query
		}

		// for published type with no other access rules, return published query
		if (type === 'published') {
			return publishedQuery
		}

		//finally, return false if no access is permitted
		return false
	}
}

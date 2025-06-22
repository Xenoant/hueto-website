import { FieldHook } from 'payload'
/**
 * Synchronizes pathname with the last breadcrumb URL from @payloadcms/plugin-nested-docs
 * @type {FieldHook}
 */
export const syncPathname: FieldHook = async ({ data, value, operation }) => {
	if (
		(operation === 'create' || operation === 'update') &&
		data?.breadcrumbs?.at(-1)?.url !== value &&
		data?.breadcrumbs?.at(-1)?.url !== '/undefined'
	) {
		return data?.breadcrumbs?.at(-1)?.url || ''
	}
}

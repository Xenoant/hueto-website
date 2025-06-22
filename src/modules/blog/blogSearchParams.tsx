import { createSearchParamsCache, parseAsInteger } from 'nuqs/server'

export const blogParsers = {
	page: parseAsInteger.withDefault(1),
	limit: parseAsInteger.withDefault(12),
}

export const blogSearchParams = createSearchParamsCache(blogParsers)

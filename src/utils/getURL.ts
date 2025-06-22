import { canUseDOM } from './canUseDOM'

// Coolify flips FQDN and URL. To account for it being fixed in the future, we will check for both
const COOLIFY_URL = process.env.COOLIFY_URL
const COOLIFY_FQDN = process.env.COOLIFY_FQDN

const getCoolifyURL = (url: string, fqdn: string): string => {
	return url.startsWith('http') ? url : fqdn
}

/**
 * Ensures a URL has a protocol (http:// or https://)
 * @param url The URL to check and fix
 * @param defaultProtocol Protocol to use if none exists
 */
const ensureProtocol = (url: string, defaultProtocol: 'http' | 'https' = 'https'): string => {
	if (!url) return ''
	if (url.startsWith('http://') || url.startsWith('https://')) return url
	return `${defaultProtocol}://${url}`
}

/**
 * Extracts the hostname and pathname from a URL, ignoring protocol
 * @param url URL to parse
 */
const extractUrlParts = (url: string): { hostname: string; pathname: string; port: string } => {
	try {
		// Ensure URL has a protocol for parsing
		const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
		const urlObj = new URL(urlWithProtocol)
		return {
			hostname: urlObj.hostname,
			pathname: urlObj.pathname !== '/' ? urlObj.pathname : '',
			port: urlObj.port,
		}
	} catch (e) {
		// Handle case where URL is invalid
		return {
			hostname: url.replace(/^https?:\/\//, '').split('/')[0],
			pathname: '',
			port: '',
		}
	}
}

/**
 * Get base URL for server-side operations
 * @param forceProtocol Optional protocol to override ('http' or 'https')
 */
export const getServerSideURL = (forceProtocol?: 'http' | 'https'): string => {
	let url = process.env.NEXT_PUBLIC_APP_URL || ''

	// Handle Coolify
	if (!url && COOLIFY_FQDN && COOLIFY_URL) {
		url = ensureProtocol(getCoolifyURL(COOLIFY_URL, COOLIFY_FQDN))
	}

	// Handle Vercel environment
	if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	}

	// Default to localhost if no URL is available
	if (!url) {
		url = 'http://localhost:3000'
	}

	// Ensure URL has a protocol
	url = ensureProtocol(url, 'http') // Default to http for development

	// Handle protocol override if specified
	if (forceProtocol) {
		const { hostname, pathname, port } = extractUrlParts(url)
		url = `${forceProtocol}://${hostname}${port ? `:${port}` : ''}${pathname}`
	}

	return url
}

/**
 * Get base URL for client-side operations
 * @param forceProtocol Optional protocol to override ('http' or 'https')
 */
export const getClientSideURL = (forceProtocol?: 'http' | 'https'): string => {
	// Browser environment: use window.location
	if (canUseDOM) {
		const protocol = forceProtocol ? `${forceProtocol}:` : window.location.protocol
		const domain = window.location.hostname
		const port = window.location.port
		const pathname = window.location.pathname !== '/' ? window.location.pathname : ''

		return `${protocol}//${domain}${port ? `:${port}` : ''}${pathname}`
	}

	// Server environment: fall back to getServerSideURL
	return getServerSideURL(forceProtocol)
}

/**
 * Get just the hostname without protocol or path
 */
export const getHostname = (): string => {
	if (canUseDOM) {
		return window.location.hostname
	}

	const url = process.env.NEXT_PUBLIC_APP_URL || ''
	if (url) {
		const { hostname } = extractUrlParts(url)
		return hostname
	}

	return 'localhost'
}

/**
 * Utility to get current URL from request in server components/API routes
 * @param req Next.js request object
 */
export const getURLFromRequest = (req: {
	headers: { host?: string; 'x-forwarded-proto'?: string }
}): string => {
	const host = req.headers.host || 'localhost:3000'
	const protocol = req.headers['x-forwarded-proto'] || 'http'
	return `${protocol}://${host}`
}

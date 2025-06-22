import { APIError, SendEmailOptions } from 'payload'
import { AllowedExtension, BrevoAddress, BrevoAttachment, BrevoSendEmailOptions } from './types'
import { isValidUrl } from '@/utils/isValidUrl'
import { isBase64 } from '@/utils/isBase64'

export const mapPayloadEmailToBrevoEmail = (
	message: SendEmailOptions,
	defaultFromAddress: string,
	defaultFromName: string
): BrevoSendEmailOptions =>
	({
		sender: mapSenderAddress(message.from, defaultFromName, defaultFromAddress),
		subject: message?.subject ?? '',
		to: mapAddresses(message.to),
		bcc: mapAddresses(message.bcc),
		cc: mapAddresses(message.cc),
		replyTo: mapReplyTo(message.replyTo),
		attachment: mapAttachments(message.attachments),
		htmlContent: message?.html?.toString() || '',
		textContent: message?.text?.toString() || '',
	}) as BrevoSendEmailOptions

const mapSenderAddress = (
	address: SendEmailOptions['from'],
	defaultFromName: string,
	defaultFromAddress: string
): BrevoSendEmailOptions['sender'] => {
	if (!address) {
		return {
			name: defaultFromName,
			email: defaultFromAddress,
		}
	}

	if (typeof address === 'object') {
		return {
			name: address.name,
			email: address.address,
		}
	}

	throw new APIError('Sender address could not be mapped.')
}

/**
 * Map addresses for multiple recipients (to, cc, bcc)
 */
const mapAddresses = (addresses: SendEmailOptions['to']): Array<BrevoAddress> => {
	if (!addresses) {
		return []
	}

	// Convert to array if single address
	const addressArray = Array.isArray(addresses) ? addresses : [addresses]
	return addressArray.map(convertToBrevoFormat)
}

/**
 * Map address for single recipient (replyTo)
 */
const mapReplyTo = (addresses: SendEmailOptions['replyTo']): BrevoAddress | undefined => {
	if (!addresses) {
		return undefined
	}

	// If array, take first address
	if (Array.isArray(addresses)) {
		return convertToBrevoFormat(addresses[0])
	}

	return convertToBrevoFormat(addresses)
}

/**
 * Parse a string email address into Brevo format
 */
const parseAddressString = (address: string): BrevoAddress => {
	const matches = address.match(/^(.*?)?<?([^>]+@[^>]+)>?$/)

	if (!matches) {
		throw new APIError(`Invalid email address format: ${address}`)
	}

	let [, name, email] = matches
	email = email.trim()

	if (name) {
		name = name
			.trim()
			.replace(/^["']|["']$/g, '')
			.trim()
		return name ? { email, name } : { email }
	}

	return { email }
}

const isAddressObject = (address: unknown): address is SendEmailOptions['from'] => {
	return (
		typeof address === 'object' &&
		address !== null &&
		'address' in address &&
		typeof address.address === 'string'
	)
}

/**
 * Convert PayloadCMS/Nodemailer Address to Brevo format
 */
const convertToBrevoFormat = (address: SendEmailOptions['from']): BrevoAddress => {
	if (!address) {
		throw new APIError('Address is required')
	}

	if (typeof address === 'string') {
		return parseAddressString(address)
	}

	if (isAddressObject(address)) {
		return {
			email: address.address,
			...(address.name && { name: address.name }),
		}
	}

	throw new APIError('Invalid address format')
}

export const ALLOWED_EXTENSIONS = [
	'xlsx',
	'xls',
	'ods',
	'docx',
	'docm',
	'doc',
	'csv',
	'pdf',
	'txt',
	'gif',
	'jpg',
	'jpeg',
	'png',
	'tif',
	'tiff',
	'rtf',
	'bmp',
	'cgm',
	'css',
	'shtml',
	'html',
	'htm',
	'zip',
	'xml',
	'ppt',
	'pptx',
	'tar',
	'ez',
	'ics',
	'mobi',
	'msg',
	'pub',
	'eps',
	'odt',
	'mp3',
	'm4a',
	'm4v',
	'wma',
	'ogg',
	'flac',
	'wav',
	'aif',
	'aifc',
	'aiff',
	'mp4',
	'mov',
	'avi',
	'mkv',
	'mpeg',
	'mpg',
	'wmv',
	'pkpass',
	'xlsm',
] as const

export const isValidExtension = (filename: string): boolean => {
	const extension = filename.split('.').pop()?.toLowerCase()
	return extension ? ALLOWED_EXTENSIONS.includes(extension as AllowedExtension) : false
}

const mapAttachments = (
	attachments: SendEmailOptions['attachments']
): BrevoSendEmailOptions['attachment'] => {
	if (!attachments) {
		return undefined
	}

	return attachments.map((attachment): BrevoAttachment => {
		if (!attachment.filename) {
			throw new APIError('Attachment filename is required', 400)
		}

		if (!isValidExtension(attachment.filename)) {
			throw new APIError(
				`Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
				400
			)
		}

		// Handle URL-based attachment
		if (attachment.path) {
			const urlString =
				typeof attachment.path === 'string' ? attachment.path : attachment.path.toString()

			if (!isValidUrl(urlString)) {
				throw new APIError('Invalid attachment URL format', 400)
			}

			return {
				url: urlString,
				name: attachment.filename,
			} as const
		}

		// Handle content-based attachment
		if (attachment.content) {
			let base64Content: string

			if (typeof attachment.content === 'string') {
				base64Content = isBase64(attachment.content)
					? attachment.content
					: Buffer.from(attachment.content).toString('base64')
			} else if (attachment.content instanceof Buffer) {
				base64Content = attachment.content.toString('base64')
			} else {
				throw new APIError('Attachment content must be a string or Buffer', 400)
			}

			return {
				content: base64Content,
				name: attachment.filename,
			} as const
		}

		throw new APIError('Attachment must have either a URL or content', 400)
	})
}

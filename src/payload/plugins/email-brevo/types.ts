import { type EmailAdapter } from 'payload'
import { ALLOWED_EXTENSIONS } from './utils'

export type BrevoAdapterArgs = {
  apiKey?: string
  defaultFromAddress: string
  defaultFromName: string
  disabled?: string | undefined
}

export type BrevoError = {
  code: string
  message: string
  technical_message?: string
  error?: {
    code: number
    message: string
  }[]
}

export type BrevoResponse =
  | {
      messageId: string
    }
  | BrevoError

export type BrevoAdapter = EmailAdapter<BrevoResponse>

export type BrevoAddress = {
  email: string
  name?: string
}

export type BrevoAttachment = {
  name: string
} & ({ url: string; content?: never } | { content: string; url?: never })

export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number]

export type BrevoSendEmailOptions = {
  /**
   * Sender email address and name. Required format: {email: string, name?: string}
   * @link https://developers.brevo.com/reference/sendtransacemail
   */
  sender: BrevoAddress

  /**
   * Recipient email addresses and names
   * For multiple addresses, send as an array of objects.
   * Never send to multiple addresses in marketing emails.
   */
  to: Array<BrevoAddress>

  /**
   * Blind carbon copy recipients
   */
  bcc?: Array<BrevoAddress>

  /**
   * Carbon copy recipients
   */
  cc?: Array<BrevoAddress>

  /**
   * The HTML version of the message
   */
  htmlContent?: string

  /**
   * The plain text version of the message
   */
  textContent?: string

  /**
   * Email subject
   */
  subject: string

  /**
   * Reply-to email address and name
   */
  replyTo?: BrevoAddress

  /**
   * Attachments (max 10 files, total size < 10MB)
   * Must provide either url OR content, not both
   *
   * @link https://developers.brevo.com/reference/sendtransacemail
   */
  attachment?: Array<BrevoAttachment>

  /**
   * Custom headers
   */
  headers?: Record<string, string>

  /**
   * Email tags for tracking
   * Limited to 10 tags per email
   */
  tags?: string[]

  /**
   * Template ID to use (optional)
   * If used, htmlContent and textContent are ignored
   */
  templateId?: number

  /**
   * Parameters for template placeholders
   * Required if templateId is used
   */
  params?: Record<string, string>

  /**
   * Schedule time for the email
   * Must be in ISO-8601 format
   */
  scheduledAt?: string
}

import { APIError } from 'payload'
import { BrevoAdapter, BrevoAdapterArgs, BrevoResponse } from './types'
import { mapPayloadEmailToBrevoEmail } from './utils'

export const brevoAdapter = (args: BrevoAdapterArgs): BrevoAdapter => {
  const { apiKey, defaultFromAddress, defaultFromName, disabled } = args

  const adapter: BrevoAdapter = () => ({
    name: 'brevo',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message): Promise<BrevoResponse> => {
      const sendEmailOptions = mapPayloadEmailToBrevoEmail(
        message,
        defaultFromAddress,
        defaultFromName,
      )

      if (disabled === 'true' || !apiKey) {
        if (disabled === 'true') {
          console.info('Brevo Adapter is disabled, logging to console')
        } else {
          console.info('No Brevo API Key has been provided, logging to console')
        }
        console.log(message)

        return {
          messageId: 'disabled-email-mock-id',
        }
      }

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        body: JSON.stringify(sendEmailOptions),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          'api-key': apiKey,
        },
      })

      const data = (await res.json()) as BrevoResponse

      if ('messageId' in data) {
        return data
      }

      // For error responses, construct and throw error
      const statusCode = res.status
      let formattedError = `Error sending email: ${statusCode}`
      if (data?.message) {
        formattedError += ` ${data.message}${data?.technical_message ? ', ' + data.technical_message : ''}`
      }

      throw new APIError(formattedError, statusCode)
    },
  })

  return adapter
}

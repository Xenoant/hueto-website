import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const mailpitAdapter = nodemailerAdapter({
  defaultFromAddress: process.env.MAILPIT_DEFAULT_FROM_ADDRESS || 'noreply@10xmedia.de',
  defaultFromName: process.env.MAILPIT_DEFAULT_FROM_NAME || '10x Media',
  transport: nodemailer.createTransport({
    host: process.env.MAILPIT_HOST || "localhost",
    port: process.env.MAILPIT_PORT || 1025,
    auth: {
      user: process.env.MAILPIT_USERNAME,
      pass: process.env.MAILPIT_PASSWORD
    },
    secure: false,
    ignoreTLS: true,
  } as SMTPTransport.Options),
})

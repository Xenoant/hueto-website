// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { collections } from './collections'
import { plugins } from './plugins'
import { rootEditor } from './lexical/rootEditor'
import { en } from '@payloadcms/translations/languages/en'
import { de } from '@payloadcms/translations/languages/de'
import { mailpitAdapter } from './plugins/mailpitAdapter'
import { brevoAdapter } from './plugins/email-brevo'
import { jobs } from './jobs'
import { blocks } from './blocks'
import { globals } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	admin: {
		user: 'users',
		importMap: {
			baseDir: path.resolve(dirname),
		},
		livePreview: {
			breakpoints: [
				{
					label: 'Mobile',
					name: 'mobile',
					width: 375,
					height: 667,
				},
				{
					label: 'Tablet',
					name: 'tablet',
					width: 768,
					height: 1024,
				},
				{
					label: 'Desktop',
					name: 'desktop',
					width: 1440,
					height: 900,
				},
			],
		},
	},
	email:
		process.env.ENABLE_MAILPIT === 'true'
			? mailpitAdapter
			: brevoAdapter({
					disabled: process.env.DISABLE_BREVO,
					apiKey: process.env.BREVO_API_KEY,
					defaultFromName: process.env.BREVO_SENDER_NAME ?? '',
					defaultFromAddress: process.env.BREVO_SENDER_EMAIL ?? '',
				}),
	blocks,
	collections,
	globals,
	jobs,
	editor: rootEditor,
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	i18n: {
		supportedLanguages: { en, de },
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || '',
	}),
	sharp,
	plugins,
})

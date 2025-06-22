import { Config } from './payload-types'

export type CollectionSlug = Exclude<
	keyof Config['collections'],
	'payload-locked-documents' | 'payload-preferences' | 'payload-migrations'
>

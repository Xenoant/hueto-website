import { Config } from 'payload'
import { RichText } from './RichText.config'
import { Archive } from './Archive.config'

export const blocks: Config['blocks'] = [Archive, RichText]

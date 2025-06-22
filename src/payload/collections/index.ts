import { MarketingCampaigns } from './marketing/MarketingCampaigns'
import { MarketingContacts } from './marketing/MarketingContacts'
import { MarketingLists } from './marketing/MarketingLists'
import { Media } from './content/Media/Media'
import { Pages } from './content/Pages'
import { Posts } from './content/Posts'
import { Users } from './settings/Users'
import { MarketingTemplates } from './marketing/MarketingTemplates'
import { MarketingEmails } from './marketing/MarketingEmails'
import { Config } from 'payload'

export const collections: Config['collections'] = [
	// Content
	Media,
	Pages,
	Posts,

	// Marketing
	MarketingContacts,
	MarketingLists,
	MarketingCampaigns,
	MarketingTemplates,
	MarketingEmails,

	// Settings
	Users,
]

import { JobsConfig } from 'payload'
import { campaignOrchestrator } from './tasks/campaignOrchestrator'
import { batchQueue } from './queues/batch.queue'
import { emailQueue } from './queues/email.queue'
import { sendEmail } from './tasks/sendEmail'
import { campaignCleanupQueue } from './queues/campaignCleanup.queue'
import { completeEmailCampaign } from './tasks/completeEmailCampaign'

export const jobs: JobsConfig = {
	tasks: [campaignOrchestrator, completeEmailCampaign, sendEmail],
	autoRun: [batchQueue, emailQueue, campaignCleanupQueue],
}

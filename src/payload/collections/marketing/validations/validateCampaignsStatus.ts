import { MarketingCampaign } from '@/payload/payload-types'
import { type SelectFieldSingleValidation, type ValidateOptions } from 'payload'

const VALID_STATUSES: MarketingCampaign['status'][] = [
	'draft',
	'approve',
	'scheduled',
	'sending',
	'completed',
	'cancel',
]

function isValidStatus(value: unknown): value is MarketingCampaign['status'] {
	return VALID_STATUSES.includes(value as MarketingCampaign['status'])
}

export const validateCampaignsStatus: SelectFieldSingleValidation = (
	rawValue,
	{
		previousValue,
		siblingData,
	}: ValidateOptions<MarketingCampaign, Omit<MarketingCampaign, 'status'>, {}, string>
) => {
	if (!isValidStatus(rawValue)) {
		return 'Invalid status.'
	}

	const value = rawValue
	const isStatusChanging = previousValue !== value

	// Rule 1: Prevent no-op approval
	if (isStatusChanging && previousValue === 'draft' && value === 'approve') {
		return 'Approving this campaign did not result in an action being taken.'
	}

	// Rule 2: Draft can only transition to scheduled or sending
	if (
		isStatusChanging &&
		previousValue === 'draft' &&
		value !== 'scheduled' &&
		value !== 'sending'
	) {
		return 'Draft campaigns can only be scheduled or sent immediately.'
	}

	// Rule 3: Cannot be scheduled for a date that is in the past
	if (
		isStatusChanging &&
		previousValue === 'draft' &&
		value === 'scheduled' && // Only validate if transitioning to scheduled
		siblingData?.scheduledDate &&
		new Date(siblingData.scheduledDate).getTime() < Date.now()
	) {
		return 'A campaign cannot be scheduled for a date in the past.'
	}

	// Rule 4: Scheduled can only become "completed", "draft", or "sending"
	if (
		isStatusChanging &&
		previousValue === 'scheduled' &&
		value !== 'completed' &&
		value !== 'draft' &&
		value !== 'sending'
	) {
		return 'Scheduled campaigns can only transition to completed, draft, or sending.'
	}

	// Rule 5: Completed cannot be changed
	if (isStatusChanging && previousValue === 'completed') {
		return 'Completed campaigns cannot be changed.'
	}

	return true
}

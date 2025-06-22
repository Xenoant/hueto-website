import { MarketingCampaign } from '@/payload/payload-types'
import { DateFieldValidation, ValidateOptions } from 'payload'

export const validateCampaignsScheduledDate: DateFieldValidation = (
	value,
	{
		previousValue,
		siblingData
	}: ValidateOptions<MarketingCampaign, Omit<MarketingCampaign, 'scheduledDate'>, {}, Date>
) => {
	if (value !== previousValue && value instanceof Date && value < new Date()) {
		return 'A campaign cannot be scheduled for a date in the past.'
	}

	if (siblingData?.type === "scheduled" && siblingData?.status === "approve" && !value) {
		return 'You must provide a scheduled date for a scheduled campaign.'
	}

	return true
}

import { MarketingCampaign } from '@/payload/payload-types'
import {
	RelationshipField,
	RelationshipValueMany,
} from 'node_modules/payload/dist/fields/config/types'
import { RelationshipFieldManyValidation, type ValidateOptions } from 'payload'

export const validateCampaignsTargetLists: RelationshipFieldManyValidation = (
	value,
	{
		previousValue,
		siblingData,
	}: ValidateOptions<
		MarketingCampaign,
		Omit<MarketingCampaign, 'targetLists'>,
		RelationshipField,
		RelationshipValueMany
	>
) => {
	// Helper function to extract IDs
	const extractIds = (items: RelationshipValueMany | null | undefined): (string | number)[] => {
		if (!items) return []
		return items.map((item) =>
			typeof item === 'string' || typeof item === 'number' ? item : item.value
		)
	}

	const currentIds = extractIds(value)
	const previousIds = extractIds(previousValue)

	const isExistingCampaign = previousValue !== undefined && previousValue !== null
	const isStatusChanging =
		isExistingCampaign &&
		(currentIds.length !== previousIds.length ||
			!currentIds.every((id) => previousIds.includes(id)))

	if (isStatusChanging && siblingData?.status !== 'draft') {
		return 'Target lists cannot be updated once a campaign has been approved.'
	}

	return true
}

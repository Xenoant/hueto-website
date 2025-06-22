import { FieldHook } from 'payload'

export const handleCancelCampaign: FieldHook = async ({ value, previousValue }) => {
	if (value !== previousValue && value === 'cancel') {
		if (previousValue === 'scheduled') {
			console.log('Scheduled Campaign Cancelled: Removing scheduled workflow...')
			return 'draft'
		}
	}
	return value
}

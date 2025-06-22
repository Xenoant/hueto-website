import { FieldHook } from 'payload'

export const handleApproveCampaign: FieldHook = async ({ value, previousValue, siblingData }) => {
	if (value !== previousValue && value === 'approve') {
		if (siblingData?.type === 'sendNow') {
			return 'sending'
		}

		if (siblingData?.type === 'scheduled') {
			return 'scheduled'
		}
	}

	return value
}

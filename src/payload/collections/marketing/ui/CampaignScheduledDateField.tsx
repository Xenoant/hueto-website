'use client'
import { DateTimeField, useFormFields } from '@payloadcms/ui'
import { DateFieldClientComponent } from 'payload'
import React, { useMemo } from 'react'

const CampaignScheduledDateField: DateFieldClientComponent = (props) => {
	const initialStatus = useFormFields(([form]) => form.status.initialValue)

	const isReadOnly = useMemo(() => {
		if (initialStatus === 'draft') {
			return false
		} else {
			return true
		}
	}, [initialStatus])

	return <DateTimeField {...props} readOnly={isReadOnly} />
}

export default CampaignScheduledDateField

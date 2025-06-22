'use client'
import { SelectField, useFormFields } from '@payloadcms/ui'
import { SelectFieldClientComponent } from 'payload'
import React, { useMemo } from 'react'

const CampaignTypeField: SelectFieldClientComponent = (props) => {
	const status = useFormFields(([form]) => form.status.initialValue)
	const readOnly = props.readOnly

	const forceReadOnly = useMemo(() => {
		switch (status) {
			case 'sending':
				return true
			case 'scheduled':
				return true
			default:
				break
		}
	}, [status])

	return <SelectField {...props} readOnly={forceReadOnly || readOnly} />
}

export default CampaignTypeField

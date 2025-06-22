'use client'

import { SelectField, useField, useFormFields } from '@payloadcms/ui'
import { SelectFieldClientComponent } from 'payload'
import { useEffect, useMemo } from 'react'

const CampaignMethodField: SelectFieldClientComponent = (props) => {
	const { value } = useField({ path: props.path })
	const initialStatus = useFormFields(([form]) => form.status.initialValue)
	const dispatch = useFormFields(([_, dispatch]) => dispatch)

	const isReadOnly = useMemo(() => {
		if (initialStatus === 'draft') {
			return false
		} else {
			return true
		}
	}, [initialStatus])

	useEffect(() => {
		dispatch({ path: 'template', value: null, type: 'UPDATE' })
	}, [value])

	return <SelectField {...props} readOnly={isReadOnly} />
}

export default CampaignMethodField

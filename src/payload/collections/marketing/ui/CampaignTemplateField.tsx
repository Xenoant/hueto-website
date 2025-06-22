'use client'
import { RelationshipField, useFormFields } from '@payloadcms/ui'
import { RelationshipFieldClientComponent } from 'payload'
import { useMemo } from 'react'

const CampaignTemplateField: RelationshipFieldClientComponent = (props) => {
	const initialStatus = useFormFields(([form]) => form.status.initialValue)

	const isReadOnly = useMemo(() => {
		if (initialStatus === 'draft') {
			return false
		} else {
			return true
		}
	}, [initialStatus])

	return <RelationshipField {...props} readOnly={isReadOnly} />
}

export default CampaignTemplateField

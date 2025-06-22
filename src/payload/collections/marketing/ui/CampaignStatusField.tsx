'use client'
import { type SelectFieldClientComponent } from 'payload'
import React, { useMemo } from 'react'
import { SelectField, useField } from '@payloadcms/ui'

const CampaignStatusField: SelectFieldClientComponent = (props) => {
	const { value, initialValue } = useField({ path: props.path })
	const fieldOptions = props.field.options

	// Transform the options based on the initialValue
	const options = useMemo(() => {
		if (!fieldOptions) return []

		// Filter options based on the initialValue
		let filteredOptions = fieldOptions.filter((option) => {
			const optionValue = typeof option === 'string' ? option : option.value

			if (initialValue === 'draft') {
				return optionValue === 'draft' || optionValue === 'approve'
			} else if (initialValue === 'approve') {
				return optionValue === 'approve' || optionValue === 'cancel'
			} else if (initialValue === 'cancel') {
				return optionValue === 'cancel'
			}

			if (initialValue === 'draft') {
				return optionValue === 'draft'
			}

			if (initialValue === 'approve') {
				return optionValue === 'approve'
			}

			if (initialValue === 'sending') {
				return optionValue === 'sending'
			}

			if (initialValue === 'scheduled') {
				return optionValue === 'scheduled' || optionValue === 'cancel'
			}

			if (initialValue === 'completed') {
				return optionValue === 'completed'
			}

			if (initialValue === 'canceled') {
				return optionValue === 'cancel'
			}

			// Exclude option unless explicitly provided.
			return false
		})

		return filteredOptions
	}, [fieldOptions, initialValue])

	const isReadOnly = useMemo(() => {
		// const currentStatus = value as string
		return !['draft', 'scheduled'].includes(initialValue as string)
	}, [value])

	return (
		<SelectField
			{...props}
			field={{
				...props.field,
				options, // override default options with custom logic
			}}
			readOnly={isReadOnly} // overrides to readOnly when status cannot be canceled
		/>
	)
}

export default CampaignStatusField

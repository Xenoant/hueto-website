'use client'
import { useRowLabel } from '@payloadcms/ui'
import { useMemo } from 'react'
import { socialOptions } from '../socialOptions'

export const FooterSocialLabel = ({}) => {
	const { data } = useRowLabel<{ site?: string }>()

	const label = useMemo(() => {
		return socialOptions.find((option) => option.value === data.site)?.label
	}, [data.site])

	return label
}

export default FooterSocialLabel

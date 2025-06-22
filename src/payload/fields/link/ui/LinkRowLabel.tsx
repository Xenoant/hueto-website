'use client'
import { useRowLabel } from '@payloadcms/ui'

export const LinkRowLabel = () => {
	const { data, rowNumber } = useRowLabel<{ link: { label?: string } }>()
	return data?.link?.label || `Link ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
}

export default LinkRowLabel

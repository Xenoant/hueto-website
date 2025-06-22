'use client'
import React from 'react'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { getClientSideURL } from '@/utils/getURL'

export const LivePreviewListener = () => {
	const router = useRouter()
	return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}

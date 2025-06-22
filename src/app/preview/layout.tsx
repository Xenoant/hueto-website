import { LivePreviewListener } from '@/modules/layout/LivePreviewListener'
import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

const PreviewLayout = async ({children}: {children: React.ReactNode}) => {
	const payload = await getPayload({config})
	const nextHeaders = await headers();
	const { user } = await payload.auth({headers: nextHeaders})

	if (!user) notFound();
	
	return (
		<html>
			<body>
				<LivePreviewListener/>
				{children}
			</body>
		</html>
	)
}

export default PreviewLayout
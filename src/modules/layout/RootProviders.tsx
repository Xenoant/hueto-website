'use client'
import React from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<NuqsAdapter>{children}</NuqsAdapter>
		</>
	)
}

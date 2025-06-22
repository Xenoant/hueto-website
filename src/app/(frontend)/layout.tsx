import '@/styles/global.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { cn } from '@/utils/cn'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'
import { LivePreviewListener } from '@/modules/layout/LivePreviewListener'
import { ExitPreview } from '@/modules/layout/ExitPreview'
import { Header } from '@/modules/layout/Header'
import { Footer } from '@/modules/layout/Footer'
import { getNavigationSettings, getSeoSettings } from '@/modules/common/data'
import { RootProviders } from '@/modules/layout/RootProviders'
import { Toaster } from '@/components/feedback/Toaster'
import { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'

export const generateMetadata = async (): Promise<Metadata> => {
	const seo = await getSeoSettings()
	return generateMeta({ meta: seo?.default })
}

const geist = Geist({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-sans',
})

const geistMono = Geist_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-mono',
})

interface Props {
	children: ReactNode
}

const RootLayout = async ({ children }: Props) => {
	const { isEnabled: draft } = await draftMode()
	const navigation = await getNavigationSettings()

	return (
		<html lang="en" data-theme="light">
			<body className={cn(geist.variable, geistMono.variable, 'antialiased font-sans')}>
				<RootProviders>
					<Header data={navigation?.header} />
					<main className="min-h-hscreen">{children}</main>
					<Footer data={navigation?.footer} />
					<Toaster />
					{draft && (
						<>
							<LivePreviewListener />
							<ExitPreview />
						</>
					)}
				</RootProviders>
			</body>
		</html>
	)
}

export default RootLayout

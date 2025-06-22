import { MarketingTemplate } from '@/payload/payload-types'
import { Body, Container, Head, Hr, Html, Preview, Tailwind } from '@react-email/components'
import * as React from 'react'
import { RenderEmailBlocks } from '@/payload/collections/marketing/blocks/RenderEmailBlocks'

type EmailData = Record<string, unknown>

interface Props<T extends EmailData> {
	template: MarketingTemplate['email']
	data?: T
	isPreview?: boolean
}

export default function DefaultBlueprint<T extends EmailData>({
	template,
	data,
	isPreview = false,
}: Props<T>) {
	if (!template) return null

	const { previewText, blocks } = template

	const SharedContent = () => (
		<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
			<Container className="richText text-black text-[14px] leading-[24px]">
				<RenderEmailBlocks blocks={blocks} data={data} />
			</Container>
			<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
		</Container>
	)

	// For preview mode, return just the content with minimal wrappers
	if (isPreview) {
		return (
			<div className="bg-white my-auto mx-auto font-sans px-2">
				<SharedContent />
			</div>
		)
	}

	return (
		<Html>
			<Head>
				<style>
					{`
						.richText {
							color: #000000;
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
							line-height: 1.5;
						}
						.richText h1 {
							font-size: 32px;
							font-weight: 600;
							margin-bottom: 1rem;
						}
						.richText h2 {
							font-size: 24px;
							font-weight: 600;
							margin-bottom: 0.75rem;
						}
						.richText h3 {
							font-size: 20px;
							font-weight: 600;
							margin-bottom: 0.5rem;
						}
						.richText p {
							margin-bottom: 1rem;
						}
						.richText ul, .richText ol {
							margin-bottom: 1rem;
							padding-left: 1.5rem;
						}
						.richText li {
							margin-bottom: 0.5rem;
						}
						.richText a {
							color: #0070f3;
							text-decoration: underline;
						}
						.richText strong {
							font-weight: 600;
						}
						.richText em {
							font-style: italic;
						}
						.richText img {
							max-width: 100%;
							height: auto;
							margin: 1rem 0;
						}
					`}
				</style>
			</Head>
			{previewText && <Preview>{previewText}</Preview>}
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans px-2">
					<SharedContent />
				</Body>
			</Tailwind>
		</Html>
	)
}

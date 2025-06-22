import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	allowedDevOrigins: ['10x-template.dev.10xmedia.de'],
	experimental: {
		turbo: {
			rules: {
				'*.svg': {
					loaders: ['@svgr/webpack'],
					as: '*.js',
				},
			},
		},
		// allow larger file uploads
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	webpack(config) {
		const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))
		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/,
			},
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
				use: ['@svgr/webpack'],
			}
		)
		fileLoaderRule.exclude = /\.svg$/i
		return config
	},

	// Uncomment to ignore build errors. Not recommended for production.
	// typescript: {
	// 	ignoreBuildErrors: true,
	// },

	// Warning: This allows production builds to successfully complete even if
	// your project has ESLint errors. Not recommended for production.
	// eslint: {
	// 	ignoreDuringBuilds: true,
	// },
}

export default withPayload(nextConfig, { devBundleServerPackages: true })

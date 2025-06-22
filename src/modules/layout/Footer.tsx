'use client'

import { LinkProps, type Navigation } from '@/payload/payload-types'
import { cn } from '@/utils/cn'
import { getLinkProps } from '@/utils/getLinkProps'
import { isExpanded } from '@/utils/isExpanded'
import Link from 'next/link'
import React from 'react'
import { SiFacebook, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'

interface FooterProps {
	data: Navigation['footer']
}

const getSocialIcon = (site: string) => {
	const iconProps = {
		size: 20,
		className: 'fill-current',
	}

	switch (site) {
		case 'facebook':
			return <SiFacebook {...iconProps} />
		case 'instagram':
			return <SiInstagram {...iconProps} />
		case 'twitter':
			return <SiX {...iconProps} />
		case 'youtube':
			return <SiYoutube {...iconProps} />
		default:
			return null
	}
}

const FooterLink = ({ link }: { link: LinkProps }) => {
	const linkProps = getLinkProps(link)
	return (
		<Link
			{...linkProps}
			className={cn(
				'text-sm font-medium tracking-tight',
				'text-zinc-600 hover:text-zinc-900 transition-colors duration-200',
				'active-class'
			)}
		>
			{link.label}
		</Link>
	)
}

export const Footer = ({ data }: FooterProps) => {
	const { links, socialLinks } = data || {}
	const currentYear = new Date().getFullYear()

	return (
		<footer className="w-full border-t border-zinc-200 bg-white">
			<div className="container mx-auto px-4 py-16">
				<div className="flex flex-col md:flex-row justify-between items-start gap-12">
					{/* Brand Section */}
					<div className="flex flex-col items-start space-y-6">
						<Link
							href="/"
							className="text-xl font-bold tracking-tight text-zinc-900 hover:text-zinc-700 transition-colors"
						>
							10X Template
						</Link>
						<p className="text-sm text-zinc-600">
							© {currentYear} 10X Template. All rights reserved.
						</p>
					</div>

					{/* Navigation Links */}
					<div className="flex flex-col items-start space-y-4">
						<h3 className="text-sm font-semibold text-zinc-900">Navigation</h3>
						<div className="flex flex-col space-y-3">
							{Array.isArray(links) &&
								links?.map(
									({ id, link }) =>
										isExpanded<LinkProps>(link) && <FooterLink key={id} link={link} />
								)}
						</div>
					</div>

					{/* Social Links */}
					{Array.isArray(socialLinks) && socialLinks?.length > 0 && (
						<div className="flex flex-col items-start space-y-4">
							<h3 className="text-sm font-semibold text-zinc-900">Connect</h3>
							<div className="flex gap-6">
								{socialLinks?.map((social) => (
									<Link
										key={social.id}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
									>
										{getSocialIcon(social?.site ?? '')}
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</footer>
	)
}

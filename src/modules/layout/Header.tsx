'use client'
import { LinkProps, type Navigation } from '@/payload/payload-types'
import { cn } from '@/utils/cn'
import { getLinkProps } from '@/utils/getLinkProps'
import { isExpanded } from '@/utils/isExpanded'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

interface HeaderProps {
	data: Navigation['header']
}

export const NavLink = ({ link }: { link: LinkProps }) => {
	const pathname = usePathname()
	const linkProps = getLinkProps(link)

	const isActive = useMemo(() => {
		return linkProps.href === pathname
	}, [pathname, linkProps])

	return (
		<Link
			{...linkProps}
			className={cn(
				'text-lg font-medium tracking-tight',
				'text-zinc-500 hover:text-foreground transition-colors',
				isActive && 'text-foreground',
				'active-class'
			)}
		>
			{link.label}
		</Link>
	)
}

export const Header = ({ data }: HeaderProps) => {
	return (
		<>
			<div className="h-header" />
			<header
				className={cn(
					'fixed inset-x-0 top-0 z-50 h-header',
					'border-b border-zinc-200',
					'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
				)}
			>
				<div className="container h-full flex justify-between items-center">
					<Link href="/" className="text-2xl font-bold tracking-tight">
						10X Template
					</Link>
					<div className="flex gap-8">
						{Array.isArray(data?.links) &&
							data?.links?.map(
								({ id, link }) => isExpanded<LinkProps>(link) && <NavLink key={id} link={link} />
							)}
					</div>
				</div>
			</header>
		</>
	)
}

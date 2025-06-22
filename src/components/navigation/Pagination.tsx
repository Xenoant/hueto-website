import React, { ComponentPropsWithRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { cn } from '@/utils/cn'
import { Button, buttonVariants } from '@/components/buttons/Button'
import Link from 'next/link'

type PaginationProps = ComponentPropsWithRef<'nav'>

export const Pagination = ({ className, ...props }: PaginationProps) => (
	<nav
		role="navigation"
		aria-label="pagination"
		data-slot="pagination"
		className={cn('mx-auto flex w-full justify-center', className)}
		{...props}
	/>
)
Pagination.displayName = 'Pagination'

type PaginationContentProps = ComponentPropsWithRef<'ul'>

export const PaginationContent = ({ className, ...props }: PaginationContentProps) => (
	<ul
		data-slot="pagination-content"
		className={cn('flex flex-row items-center gap-1', className)}
		{...props}
	/>
)
PaginationContent.displayName = 'PaginationContent'

type PaginationItemProps = ComponentPropsWithRef<'li'>

export const PaginationItem = ({ ...props }: PaginationItemProps) => (
	<li data-slot="pagination-item" {...props} />
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
	isActive?: boolean
	isDisabled?: boolean
	href?: string | null
	onClick?: () => void
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
	Omit<React.ComponentProps<typeof Link>, 'href'>

export const PaginationLink = ({
	className,
	isActive,
	size = 'icon',
	href,
	onClick,
	isDisabled,
	...props
}: PaginationLinkProps) => {
	const buttonClassName = cn(
		buttonVariants({
			variant: isActive ? 'outline' : 'ghost',
			size,
		}),
		'min-w-9',
		className
	)

	if (isDisabled) {
		return (
			<Button
				aria-current={isActive ? 'page' : undefined}
				data-slot="pagination-link"
				data-active={isActive}
				disabled={true}
				size={size}
				variant={isActive ? 'outline' : 'ghost'}
				className={buttonClassName}
				{...(props as React.ComponentProps<typeof Button>)}
			/>
		)
	}

	if (href) {
		return (
			<Link
				href={href}
				aria-current={isActive ? 'page' : undefined}
				data-slot="pagination-link"
				data-active={isActive}
				className={buttonClassName}
				{...props}
			/>
		)
	}

	return (
		<Button
			aria-current={isActive ? 'page' : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			size={size}
			variant={isActive ? 'outline' : 'ghost'}
			className={buttonClassName}
			onClick={onClick}
			{...(props as React.ComponentProps<typeof Button>)}
		/>
	)
}
PaginationLink.displayName = 'PaginationLink'

type PaginationPreviousProps = PaginationLinkProps

export const PaginationPrevious = ({ className, ...props }: PaginationPreviousProps) => (
	<PaginationLink
		aria-label="Go to previous page"
		size="md"
		className={cn('gap-1 px-2.5 sm:pe-4', className)}
		{...props}
	>
		<ChevronLeftIcon size={16} />
		<span>Prev</span>
	</PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

type PaginationNextProps = PaginationLinkProps

export const PaginationNext = ({ className, ...props }: PaginationNextProps) => (
	<PaginationLink
		aria-label="Go to next page"
		size="md"
		className={cn('gap-1 px-2.5 sm:ps-4', className)}
		{...props}
	>
		<span>Next</span>
		<ChevronRightIcon size={16} />
	</PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

type PaginationEllipsisProps = ComponentPropsWithRef<'span'>

export const PaginationEllipsis = ({ className, ...props }: PaginationEllipsisProps) => (
	<span
		aria-hidden
		data-slot="pagination-ellipsis"
		className={cn('flex size-9 items-center justify-center', className)}
		{...props}
	>
		<MoreHorizontalIcon size={16} />
		<span className="sr-only">More pages</span>
	</span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

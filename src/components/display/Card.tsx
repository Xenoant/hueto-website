import React, { ComponentPropsWithRef } from 'react'

import { cn } from '@/utils/cn'

export const Card = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div
		className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
		{...props}
	/>
)
Card.displayName = 'Card'

export const CardHeader = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div className={cn('text-sm text-muted-foreground', className)} {...props} />
)
CardDescription.displayName = 'CardDescription'

export const CardContent = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div className={cn('p-6 pt-0', className)} {...props} />
)
CardContent.displayName = 'CardContent'

export const CardFooter = ({ className, ...props }: ComponentPropsWithRef<'div'>) => (
	<div className={cn('flex items-center p-6 pt-0', className)} {...props} />
)
CardFooter.displayName = 'CardFooter'

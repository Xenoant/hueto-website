'use client'
import React, { ComponentPropsWithRef } from 'react'
import { Avatar as AvatarPrimitive } from 'radix-ui'

import { cn } from '@/utils/cn'

export const Avatar = ({
	className,
	...props
}: ComponentPropsWithRef<typeof AvatarPrimitive.Root>) => (
	<AvatarPrimitive.Root
		className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
		{...props}
	/>
)
Avatar.displayName = AvatarPrimitive.Root.displayName

export const AvatarImage = ({
	className,
	...props
}: ComponentPropsWithRef<typeof AvatarPrimitive.Image>) => (
	<AvatarPrimitive.Image className={cn('aspect-square h-full w-full', className)} {...props} />
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

export const AvatarFallback = ({
	className,
	...props
}: ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>) => (
	<AvatarPrimitive.Fallback
		className={cn(
			'flex h-full w-full items-center justify-center rounded-full bg-muted',
			className
		)}
		{...props}
	/>
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

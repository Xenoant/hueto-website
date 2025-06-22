'use client'

import React, { ComponentPropsWithRef } from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'

import { cn } from '@/utils/cn'

export const Separator = ({
	className,
	orientation = 'horizontal',
	decorative = true,
	...props
}: ComponentPropsWithRef<typeof SeparatorPrimitive.Root>) => (
	<SeparatorPrimitive.Root
		decorative={decorative}
		orientation={orientation}
		className={cn(
			'shrink-0 bg-border',
			orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
			className
		)}
		{...props}
	/>
)
Separator.displayName = SeparatorPrimitive.Root.displayName

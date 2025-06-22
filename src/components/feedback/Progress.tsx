'use client'

import React, { ComponentPropsWithRef } from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/utils/cn'

export const Progress = ({
	className,
	value,
	...props
}: ComponentPropsWithRef<typeof ProgressPrimitive.Root>) => (
	<ProgressPrimitive.Root
		className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className="h-full w-full flex-1 bg-primary transition-all"
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
)
Progress.displayName = ProgressPrimitive.Root.displayName

'use client'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/utils/cn'
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react'

export const buttonVariants = cva(
	[
		'group inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer',
		'text-sm font-medium transition-colors active-class',
		'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
		'[&_svg.button-icon]:pointer-events-none [&_svg.button-icon]:shrink-0',
		'[&_svg.button-icon]:transition-transform [&_svg.button-icon]:duration-200',
	],
	{
		variants: {
			variant: {
				default: 'bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90',
				secondary: 'bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200/50',
				outline: 'border border-zinc-200 bg-zinc-100/0 shadow-sm hover:bg-zinc-100/50',
				ghost: 'hover:bg-zinc-100/0 hover:bg-zinc-100/100',
				link: 'text-zinc-900 underline-offset-4 hover:underline',
				destructive: 'bg-red-600 text-red-50 shadow-sm hover:bg-red-600/90',
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				md: 'h-9 px-4 py-2',
				lg: 'h-10 px-8',
				xl: 'h-12 px-10',
				icon: 'h-9 w-9',
			},
			radius: {
				none: '',
				sm: 'rounded-sm',
				md: 'rounded-md',
				lg: 'rounded-lg',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
			radius: 'md',
		},
	}
)

export interface ButtonProps
	extends React.ComponentPropsWithRef<'button'>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	loading?: boolean
	icon?: 'none' | 'arrowRight' | 'arrowLeft' | null | undefined
}

export const Button = ({
	className,
	variant = 'default',
	size,
	children,
	asChild = false,
	disabled,
	loading = false,
	icon,
	...props
}: ButtonProps) => {
	const Comp = asChild ? Slot.Root : 'button'

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }), {
				'disabled:pointer-events-none text-transparent relative select-none': loading,
				'disabled:pointer-events-none disabled:opacity-50': disabled && !loading,
			})}
			disabled={disabled || loading}
			{...props}
		>
			{loading && (
				<div className={cn('absolute inset-0 flex items-center justify-center')}>
					<LoaderCircle
						className={cn(
							'w-5 h-5 animate-spin',
							variant === 'default' || variant === 'destructive'
								? 'text-zinc-50/90'
								: 'text-zinc-900/90'
						)}
					/>
				</div>
			)}
			{icon === 'arrowLeft' && (
				<ArrowLeft className="button-icon size-4 stroke-[2.5] group-hover:-translate-x-1 will-change-transform" />
			)}
			<Slot.Slottable>{children}</Slot.Slottable>
			{icon === 'arrowRight' && (
				<ArrowRight className="button-icon size-4 stroke-[2.5] group-hover:translate-x-1 will-change-transform" />
			)}
		</Comp>
	)
}

Button.displayName = 'Button'

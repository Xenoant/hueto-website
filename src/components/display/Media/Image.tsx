'use client'
import React, { useCallback, useState } from 'react'
import { ImageProps } from './types'
import NextImage from 'next/image'
import { cn } from '@/utils/cn'
import { thumbHashToDataURL } from 'thumbhash'

export const Image = ({
	disablePlaceholder = false,
	className,
	style,
	priority = false,
	draggable = false,
	blurDataURL,
	thumbhash,
	blurMs = 750,
	onLoad,
	...props
}: ImageProps) => {
	const [isLoading, setIsLoading] = useState(true)

	const handleLoad = useCallback(
		(event: React.SyntheticEvent<HTMLImageElement>) => {
			setIsLoading(false)
			if (onLoad) {
				onLoad(event)
			}
		},
		[onLoad]
	)

	const placeholderDataUrl = thumbhash ? thumbHashToDataURL(Object.values(thumbhash)) : undefined

	return (
		<div className={cn('relative w-full h-full')}>
			<NextImage
				priority={priority}
				draggable={draggable}
				style={{ transitionDuration: `${blurMs}ms`, ...style }}
				className={cn(
					'relative select-none z-10',
					{
						'transition-opacity': !disablePlaceholder && placeholderDataUrl,
						'opacity-0': isLoading && !disablePlaceholder && placeholderDataUrl,
						'opacity-100': !isLoading && !disablePlaceholder && placeholderDataUrl,
					},
					className
				)}
				onLoad={handleLoad}
				{...props}
			/>
			{!disablePlaceholder && (placeholderDataUrl || blurDataURL) && (
				<img
					src={placeholderDataUrl || blurDataURL}
					alt="placeholder"
					draggable={draggable}
					className={cn(
						'absolute w-full h-full select-none',
						!disablePlaceholder && placeholderDataUrl ? 'opacity-100' : 'opacity-0'
					)}
					aria-hidden="true"
				/>
			)}
		</div>
	)
}
Image.displayName = 'Image'

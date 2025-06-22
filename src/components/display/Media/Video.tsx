'use client'
import React from 'react'
import { VideoProps } from './types'
import { cn } from '@/utils/cn'

export const Video = ({
	className,
	src,
	autoPlay = true,
	muted = true,
	loop = true,
	controls = false,
	playsInline = true,
	...props
}: VideoProps) => {
	return (
		<video
			className={cn(className)}
			autoPlay={autoPlay}
			muted={muted}
			loop={loop}
			controls={controls}
			playsInline={playsInline}
			{...props}
		>
			<source src={src} />
		</video>
	)
}
Video.displayName = 'Video'

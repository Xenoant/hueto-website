'use client'
import { Button } from '@/components/buttons/Button'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { getLinkProps } from '@/utils/getLinkProps'
import { pxToRem } from '@/utils/pxToRem'
import { ButtonBlockType } from '@/payload-types'
import React, { useMemo } from 'react'
import classes from './ButtonBlock.module.css'

type CSSVariableStyles = Record<`--${string}`, string>
export const ButtonBlock = (props: ButtonBlockType) => {
	const { links, settings } = props

	const responsiveStyles = useMemo(() => {
		const styles: CSSVariableStyles = {}
		const addVariable = (name: string, value?: number | null | string) => {
			if (value !== null && value !== undefined && value !== 'none') {
				styles[name as `--${string}`] = typeof value === 'number' ? pxToRem(value) : value
			}
		}

		// Margins (unchanged)
		addVariable('--mt-mobile', settings?.marginTop?.mobile)
		addVariable('--mt-tablet', settings?.marginTop?.tablet)
		addVariable('--mt-desktop', settings?.marginTop?.desktop)
		addVariable('--mb-mobile', settings?.marginBottom?.mobile)
		addVariable('--mb-tablet', settings?.marginBottom?.tablet)
		addVariable('--mb-desktop', settings?.marginBottom?.desktop)

		// Calculate effective alignments at each breakpoint
		const getEffectiveAlign = (breakpoint: 'mobile' | 'tablet' | 'desktop'): string => {
			if (breakpoint === 'mobile') return settings?.align?.mobile || 'flex-start'
			if (breakpoint === 'tablet') {
				return settings?.align?.tablet === 'none'
					? settings?.align?.mobile || 'flex-start'
					: settings?.align?.tablet || settings?.align?.mobile || 'flex-start'
			}
			return settings?.align?.desktop === 'none'
				? (settings?.align?.tablet === 'none'
						? settings?.align?.mobile
						: settings?.align?.tablet) || 'flex-start'
				: settings?.align?.desktop ||
						settings?.align?.tablet ||
						settings?.align?.mobile ||
						'flex-start'
		}

		// Get effective alignments
		const mobileAlign = getEffectiveAlign('mobile')
		const tabletAlign = getEffectiveAlign('tablet')
		const desktopAlign = getEffectiveAlign('desktop')

		// Add alignment variables
		addVariable('--align-mobile', mobileAlign)
		addVariable('--align-tablet', tabletAlign)
		addVariable('--align-desktop', desktopAlign)

		// Add fullWidth variables based on effective alignments
		addVariable('--fullWidth-mobile', mobileAlign === 'fullWidth' ? '1' : '0')
		addVariable('--fullWidth-tablet', tabletAlign === 'fullWidth' ? '1' : '0')
		addVariable('--fullWidth-desktop', desktopAlign === 'fullWidth' ? '1' : '0')

		return styles
	}, [settings])

	if (!links || !Array.isArray(links) || links?.length < 1) return null

	return (
		<div className={cn('not-prose flex flex-wrap gap-3', classes.button)} style={responsiveStyles}>
			{links?.map(({ link, id }) => (
				<Button
					key={id}
					variant={link.appearance}
					asChild
					className={classes.buttonItem}
					icon={link?.icon}
					size={link?.size}
				>
					<Link {...getLinkProps(link)}>{link?.label}</Link>
				</Button>
			))}
		</div>
	)
}

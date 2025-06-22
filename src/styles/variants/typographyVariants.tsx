import { cva, type VariantProps } from 'class-variance-authority'

export const typographyVariants = cva('prose prose-zinc', {
	variants: {
		variant: {
			default: '',
			blog: 'prose-blog',
		},
		invert: {
			true: '!prose-invert',
			false: '',
		},
	},
	defaultVariants: {
		variant: 'default',
		invert: false,
	},
})

export type TypographyVariantProps = VariantProps<typeof typographyVariants>

import { cn } from '@/utils/cn'
import { jsxConverters } from './jsxConverters'
import { RichText as RichTextBase } from '@payloadcms/richtext-lexical/react'
import { TypographyVariantProps, typographyVariants } from '@/styles/variants/typographyVariants'
import { ComponentPropsWithRef } from 'react'
import { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import { ContainerVariantProps, containerVariants } from '@/styles/variants/containerVariants'
import { SpaceVariantProps, spaceVariants } from '@/styles/variants/spaceVariants'

export interface RichTextProps extends ComponentPropsWithRef<'div'> {
	data: SerializedEditorState<SerializedLexicalNode> | undefined | null
	tag?: 'div' | 'section' | 'article' | null | undefined
	typography?: TypographyVariantProps | false
	container?: ContainerVariantProps | ContainerVariantProps['type'] | false
	space?:
		| {
				top?: Omit<SpaceVariantProps, 'variant'>
				bottom?: Omit<SpaceVariantProps, 'variant'>
				y?: Omit<SpaceVariantProps, 'variant'>
		  }
		| false
}

export const RichText = ({
	data,
	container = false,
	typography,
	className,
	tag,
	space = false,
	...props
}: RichTextProps) => {
	if (!data) return null
	const Tag = tag || 'div'
	return (
		<Tag
			className={cn(
				container !== false &&
					containerVariants({
						type: typeof container === 'string' ? container : container?.type,
						variant: 'richText',
					}),
				typography !== false && typographyVariants(typography),
				space !== false && space?.top && spaceVariants({ ...space?.top, variant: 'top' }),
				space !== false && space?.bottom && spaceVariants({ ...space?.bottom, variant: 'bottom' }),
				space !== false && space?.y && spaceVariants({ ...space?.y, variant: 'y' }),
				className
			)}
			{...props}
		>
			<RichTextBase converters={jsxConverters} data={data} disableContainer />
		</Tag>
	)
}
RichText.displayName = 'RichText'

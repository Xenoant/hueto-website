import { containerVariants } from '@/styles/variants/containerVariants'
import { spaceVariants } from '@/styles/variants/spaceVariants'
import { cn } from '@/utils/cn'
import { ComponentPropsWithRef } from 'react'
import { RichText } from '../richText'
import { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

type BlockSettings = {
	id?: string | null | undefined
	htmlTag?: ('div' | 'section' | 'article') | null | undefined
	containerType?: ('none' | 'default' | 'post') | null | undefined
	spacing?: ('none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl') | null | undefined
	spacingType?: ('margin' | 'padding') | null | undefined
	withPrefix?: boolean | null | undefined
}

interface BlockProps extends Omit<ComponentPropsWithRef<'div'>, 'prefix'> {
	settings: BlockSettings | undefined
	prefix?: SerializedEditorState<SerializedLexicalNode> | null | undefined
	prefixClassName?: string
}

export const Block = ({
	settings,
	prefix,
	className,
	prefixClassName = 'mb-4',
	children,
	...props
}: BlockProps) => {
	const Tag = settings?.htmlTag ?? 'div'

	return (
		<Tag
			className={cn(
				settings?.containerType &&
					containerVariants({
						type: settings?.containerType,
						variant: 'standard',
					}),
				settings?.spacing &&
					settings?.spacingType &&
					spaceVariants({
						size: settings?.spacing,
						type: settings?.spacingType,
						variant: 'y',
					}),
				className
			)}
			{...props}
		>
			{settings?.withPrefix && <RichText data={prefix} className={prefixClassName} />}
			{children}
		</Tag>
	)
}

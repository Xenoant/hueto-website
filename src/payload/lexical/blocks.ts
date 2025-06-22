// import { AccordionBlock } from '@/payload/blocks/Accordion'
import { ButtonBlock } from '@/payload/lexical/blocks/ButtonBlock.config'
// import { CalloutBlock } from '@/payload/blocks/Callout'
// import { CardLink } from '@/payload/blocks/CardLink/CardLink'
// import { DoubleFormBlock } from '@/payload/blocks/DoubleForm'
// import { EmbedBlock } from '@/payload/blocks/Embed'
// import { GridBlock } from '@/payload/blocks/Grid'
// import { ImageBlock } from '@/payload/blocks/Image'
// import { PriceBlock } from '@/payload/blocks/Price'
import { Block } from 'payload'

export const Blocks = {
	// accordion: AccordionBlock,
	button: ButtonBlock,
	// cardLink: CardLink,
	// callout: CalloutBlock,
	// doubleForm: DoubleFormBlock,
	// embed: EmbedBlock,
	// grid: GridBlock,
	// image: ImageBlock,
	// price: PriceBlock,
} satisfies Record<string, Block>

export type BlockKey = keyof typeof Blocks

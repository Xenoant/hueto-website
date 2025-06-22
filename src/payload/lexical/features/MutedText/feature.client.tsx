'use client'
import { createClientFeature, toolbarTextDropdownGroupWithItems } from '@payloadcms/richtext-lexical/client'
import { $createMutedTextNode, $isMutedTextNode, MutedTextNode } from './feature.node'
import { Icon } from './Icon'
import { $createTextNode, $getSelection, $isRangeSelection, $isTextNode } from '@payloadcms/richtext-lexical/lexical'

const config = toolbarTextDropdownGroupWithItems([
	{
		ChildComponent: Icon,
		isActive: ({ selection }) => {
			if (!$isRangeSelection(selection)) return false
			return selection.getNodes().some($isMutedTextNode)
		},
		key: 'textMuted',
		label: 'Muted Text',
		onSelect: ({ editor }) => {
			editor.update(() => {
				const selection = $getSelection()
				if (!$isRangeSelection(selection)) return

				// Get just the meaningful selected content
				selection
					.extract()
					.map((node) => {
						if (!$isTextNode(node)) return null

						const text = node.getTextContent()
						// Split node if it contains both spaces and text
						const parts = text.split(/(\s+)/)

						// Process each part separately
						parts.forEach((part) => {
							if (!part) return

							const isMuted = $isMutedTextNode(node)
							if (part.trim()) {
								// Handle actual text
								if (isMuted) {
									const textNode = $createTextNode(part)
									textNode.setFormat(node.getFormat())
									node.insertBefore(textNode)
								} else {
									const mutedNode = $createMutedTextNode(part)
									mutedNode.setFormat(node.getFormat())
									node.insertBefore(mutedNode)
								}
							} else {
								// Handle whitespace - always as regular text
								const spaceNode = $createTextNode(part)
								spaceNode.setFormat(node.getFormat())
								node.insertBefore(spaceNode)
							}
						})

						// Remove original node after processing
						node.remove()
						return null
					})
					.filter(Boolean)

				// Clean up any leftover empty muted spans
				const parent = selection.getNodes()[0]?.getParent()
				if (parent) {
					parent.getChildren().forEach((child) => {
						if ($isMutedTextNode(child) && !child.getTextContent().trim()) {
							child.remove()
						}
					})
				}
			})
		},

		order: 1,
	},
])

export const MutedTextClientFeature = createClientFeature({
	toolbarFixed: {
		groups: [config],
	},
	toolbarInline: {
		groups: [config],
	},
	nodes: [MutedTextNode],
})

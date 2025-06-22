'use client'
import type { LexicalCommand } from '@payloadcms/richtext-lexical/lexical'

import {
	createCommand,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_EDITOR,
	$isTextNode,
	$createTextNode,
	FORMAT_TEXT_COMMAND,
} from '@payloadcms/richtext-lexical/lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'

import { useEffect } from 'react'

import { $createMutedTextNode, $isMutedTextNode } from './feature.node'

export const TOGGLE_MUTED_TEXT_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_MUTED_TEXT_COMMAND')

export const MutedTextPlugin = {
	Component: () => {
		const [editor] = useLexicalComposerContext()

		useEffect(() => {
			return editor.registerCommand(
				FORMAT_TEXT_COMMAND,
				(format: string) => {
					if (format !== 'muted') return false

					const selection = $getSelection()
					if (!$isRangeSelection(selection)) return false

					const selectedNodes = selection.getNodes().filter((node) => {
						if (!$isTextNode(node)) return false
						const start = selection.anchor.offset
						const end = selection.focus.offset
						return start !== end
					})

					const isMuted = selectedNodes.some($isMutedTextNode)

					editor.update(() => {
						selectedNodes.forEach((node) => {
							if ($isTextNode(node)) {
								if (isMuted) {
									const textNode = $createTextNode(node.getTextContent())
									textNode.setFormat(node.getFormat())
									node.replace(textNode)
								} else {
									const mutedNode = $createMutedTextNode(node.getTextContent())
									mutedNode.setFormat(node.getFormat())
									node.replace(mutedNode)
								}
							}
						})
					})

					return true
				},
				COMMAND_PRIORITY_EDITOR
			)
		}, [editor])

		return null
	},
	position: 'normal' as const,
}

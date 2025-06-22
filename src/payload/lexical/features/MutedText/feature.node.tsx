import type { EditorConfig, LexicalNode, NodeKey, SerializedTextNode } from '@payloadcms/richtext-lexical/lexical'

import { TextNode } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

export type SerializedMutedTextNode = SerializedTextNode & {
	type: 'mutedText'
}

export class MutedTextNode extends TextNode {
	static getType(): string {
		return 'mutedText'
	}

	static clone(node: MutedTextNode): MutedTextNode {
		return new MutedTextNode(node.__text, node.__key)
	}

	constructor(text: string, key?: NodeKey) {
		super(text, key)
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = super.createDOM(config)
		dom.style.color = 'gray'
		return dom
	}

	updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
		const updated = super.updateDOM(prevNode, dom, config)
		dom.style.color = 'gray'
		return updated
	}

	exportJSON(): SerializedMutedTextNode {
		return {
			...super.exportJSON(),
			type: 'mutedText',
			version: 1,
		}
	}

	static importJSON(serializedNode: SerializedMutedTextNode): MutedTextNode {
		const node = $createMutedTextNode(serializedNode.text)
		node.setFormat(serializedNode.format)
		node.setDetail(serializedNode.detail)
		node.setMode(serializedNode.mode)
		node.setStyle(serializedNode.style)
		return node
	}
}

export function $createMutedTextNode(text: string): MutedTextNode {
	return new MutedTextNode(text)
}

export function $isMutedTextNode(node: LexicalNode | null | undefined): node is MutedTextNode {
	return node instanceof MutedTextNode
}

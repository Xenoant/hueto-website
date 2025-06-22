import Handlebars from 'handlebars'

type EmailData = Record<string, unknown>

// Register custom helpers
Handlebars.registerHelper('default', function (value, defaultValue) {
	try {
		return value || defaultValue
	} catch {
		return defaultValue
	}
})

Handlebars.registerHelper('titlecase', function (value: string) {
	try {
		if (!value) return ''
		return value.toString().replace(/\w\S*/g, (txt: string) => {
			return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
		})
	} catch {
		return value
	}
})

const safeCompileTemplate = (template: string): Handlebars.TemplateDelegate | null => {
	try {
		return Handlebars.compile(template)
	} catch (error) {
		console.warn('Failed to compile template:', error)
		return null
	}
}

export const processTemplate = <T extends EmailData>(template: string, data?: T): string => {
	try {
		// Handle empty or invalid templates
		if (!template?.trim()) return ''

		// Try to detect incomplete handlebars syntax
		const openCount = (template.match(/{{/g) || []).length
		const closeCount = (template.match(/}}/g) || []).length
		if (openCount !== closeCount) {
			return template // Return unprocessed template if syntax is incomplete
		}

		const compiledTemplate = safeCompileTemplate(template)
		if (!compiledTemplate) return template

		try {
			// Pass data directly to the template
			return compiledTemplate(data || {})
		} catch (error) {
			console.warn('Failed to process template:', error)
			return template
		}
	} catch (error) {
		console.warn('Unexpected error in processTemplate:', error)
		return template || ''
	}
}

export const processNode = <T extends EmailData>(node: any, data?: T): any => {
	try {
		if (!node || typeof node !== 'object') return node

		if (typeof node.text === 'string') {
			return {
				...node,
				text: processTemplate(node.text, data),
			}
		}

		if (Array.isArray(node.children)) {
			return {
				...node,
				children: node.children.map((child: any) => processNode(child, data)),
			}
		}

		return node
	} catch (error) {
		console.warn('Error processing node:', error)
		return node
	}
}

export const processContent = <T extends EmailData>(content: any, data?: T) => {
	try {
		if (!content || typeof content !== 'object') return null

		if (!content.root || !Array.isArray(content.root.children)) {
			return content
		}

		return {
			...content,
			root: {
				...content.root,
				children: content.root.children.map((node: any) => processNode(node, data)),
			},
		}
	} catch (error) {
		console.warn('Error processing content:', error)
		return content
	}
}

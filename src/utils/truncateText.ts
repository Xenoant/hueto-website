export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) {
		// If the text is already shorter than the max length, return it as-is
		return text
	}

	// Truncate the text to the max length
	let truncated = text.slice(0, maxLength)

	// Check the next character after the truncation point
	const nextChar = text[maxLength]

	if (nextChar === ' ' || nextChar === '.') {
		// If the next character is a space or period, end there
		return truncated.trimEnd()
	} else {
		// If the next character is part of a word, add "..." to imply continuation
		return `${truncated.trimEnd()}...`
	}
}

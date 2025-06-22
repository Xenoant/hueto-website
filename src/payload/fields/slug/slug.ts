import { deepMerge, DeepPartial } from '@/utils/deepMerge'
import type { TextField } from 'payload'
import { formatSlug } from './hooks/formatSlug'
import { generateId } from '@/utils/generateId'

type Slug = (fieldToUse?: string, overrides?: DeepPartial<TextField>) => TextField

/**
 * Creates a customizable slug field config
 * @param {string} [fieldToUse='title'] - Field to generate slug from
 * @param {Partial<TextField>} [overrides={}] - Optional overrides for field config
 * @returns {TextField} Complete slug field configuration
 * @example
 * // Basic usage
 * fields: [
 * 	{
 * 		name: "title",
 * 		type: "text",
 * 	}
 *   slug()  // Generates from 'title' field by default
 * ]
 *
 * // Custom source field
 * fields: [
 * 	{
 * 		name: "name",
 * 		type: "text",
 * 	}
 *   slug('name')  // Generates from 'name' field
 * ]
 *
 * // With overrides
 * slug(undefined, {
 *   admin: {
 *     description: 'Slug automatically generated from the "title" field'
 *   }
 * })
 */
export const slug: Slug = (fieldToUse = 'title', overrides = {}) =>
	deepMerge(
		{
			name: 'slug',
			type: 'text',
			index: true,
			unique: true,
			admin: {
				position: 'sidebar',
			},
			hooks: {
				beforeValidate: [formatSlug(fieldToUse)],
				beforeDuplicate: [
					({ value, context }) => {
						context.duplicate = true
						if (value === '/') {
							return generateId()
						}
						return `${value}-${generateId()}`
					},
				],
			},
		},
		overrides
	)

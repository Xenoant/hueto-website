import { Field } from 'payload'
import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from '@payloadcms/plugin-seo/fields'

type SeoFieldsOptions = {
	pathPrefix?: string
	titlePath?: string
	descriptionPath?: string
	imagePath?: string
	includeNoIndex?: boolean
	hasGenerateTitleFn?: boolean
	hasGenerateDescriptionFn?: boolean
}

export const seoFields = ({
	pathPrefix = 'meta',
	titlePath,
	descriptionPath,
	imagePath,
	includeNoIndex = true,
	hasGenerateTitleFn = true,
	hasGenerateDescriptionFn = true,
}: SeoFieldsOptions = {}): Field[] => {
	// Use provided paths or construct them from prefix
	const resolvedTitlePath = titlePath ?? `${pathPrefix}.title`
	const resolvedDescriptionPath = descriptionPath ?? `${pathPrefix}.description`
	const resolvedImagePath = imagePath ?? `${pathPrefix}.image`

	const baseFields: Field[] = [
		OverviewField({
			titlePath: resolvedTitlePath,
			descriptionPath: resolvedDescriptionPath,
			imagePath: resolvedImagePath,
		}),
		MetaTitleField({
			hasGenerateFn: hasGenerateTitleFn,
		}),
		MetaDescriptionField({
			hasGenerateFn: hasGenerateDescriptionFn,
		}),
		PreviewField({
			hasGenerateFn: true,
			titlePath: resolvedTitlePath,
			descriptionPath: resolvedDescriptionPath,
		}),
		MetaImageField({
			relationTo: 'media',
		}),
	]

	if (includeNoIndex) {
		const noIndexField: Field = {
			name: 'noIndex',
			label: 'Do not index',
			type: 'checkbox',
			defaultValue: false,
			admin: {
				description:
					'Checking this box will add metatags to the page, asking search engines not to index this page. It will also remove it from the sitemap.',
			},
		}
		baseFields.push(noIndexField)
	}

	return baseFields
}

import { APIError, CollectionBeforeChangeHook } from 'payload'
import { rgbaToThumbHash } from 'thumbhash'
import sharp from 'sharp'
import { Media } from '@/payload/payload-types'

export const generateThumbhash: CollectionBeforeChangeHook<Media> = async ({
	req,
	data,
	operation,
}) => {
	if (operation === 'create' || (operation === 'update' && req.file?.mimetype.includes('image'))) {
		try {
			const buffer = req?.file?.data
			const { data: imageData, info } = await sharp(buffer)
				.ensureAlpha()
				.resize({ height: 100, width: 100, fit: 'inside' })
				.raw()
				.toBuffer({ resolveWithObject: true })

			return {
				...data,
				thumbhash: rgbaToThumbHash(info.width, info.height, imageData),
			}
		} catch (error) {
			throw new APIError('Failed to generate thumbhash...', 500, undefined, true)
		}
	}

	return data
}

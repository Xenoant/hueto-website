export const isVideo = (mimeType: string | null | undefined): Boolean => Boolean(mimeType?.includes('video'))

export const isImage = (mimeType: string | null | undefined): Boolean => Boolean(mimeType?.includes('image'))

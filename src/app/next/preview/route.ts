import { getPayload, type PayloadRequest } from 'payload'
import config from '@/payload/payload.config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export const GET = async (
	req: {
		cookies: {
			get: (name: string) => {
				value: string
			}
		}
	} & Request
): Promise<Response> => {
	const payload = await getPayload({ config: config })

	const { searchParams } = new URL(req.url)

	const pathname = searchParams.get('pathname')

	if (!pathname) {
		return new Response('You must provide a pathname parameter.', { status: 400 })
	}

	if (!pathname?.startsWith('/')) {
		return new Response('This endpoint can only be used for relative previews.', { status: 400 })
	}

	const draft = await draftMode()

	try {
		const { user } = await payload.auth({
			req: req as unknown as PayloadRequest,
			headers: req.headers,
		})

		// this is where you can customize the preview access. if they should have a specific role or something else, do it here.
		if (!user) {
			draft.disable()
			return new Response('You are not allowed to preview this page', { status: 403 })
		}

		draft.enable()
	} catch (error) {
		payload.logger.error({ err: error }, 'Error getting user for preview')
		return new Response('You are not allowed to preview this page', { status: 403 })
	}

	redirect(pathname)
}

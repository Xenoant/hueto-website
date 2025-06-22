import { revalidatePath } from 'next/cache'

export const revalidateLayout = () => {
	revalidatePath('/', 'layout')
}

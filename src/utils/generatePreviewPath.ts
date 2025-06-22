import { getServerSideURL } from './getURL'

type Args = {
	pathname: string
}

export const generatePreviewPath = ({ pathname }: Args) => {
	return `${getServerSideURL()}/next/preview?pathname=${pathname}`
}

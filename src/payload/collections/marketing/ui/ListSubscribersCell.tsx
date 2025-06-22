import { DefaultServerCellComponentProps } from 'payload'
import React from 'react'

const ListSubscribersCell = async ({ payload, rowData }: DefaultServerCellComponentProps) => {
	const { totalDocs: subscriberCount } = await payload.count({
		collection: 'marketing-contacts',
		where: {
			and: [
				{
					marketingLists: {
						contains: rowData.id,
					},
				},
				{
					subscribed: {
						equals: true,
					},
				},
			],
		},
	})
	return <span>{subscriberCount}</span>
}

export default ListSubscribersCell

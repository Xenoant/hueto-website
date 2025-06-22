import { useMemo } from 'react'

type UsePaginationProps = {
	currentPage: number
	totalPages: number
	paginationItemsToDisplay: number
}

type UsePaginationReturn = {
	pages: number[]
	showLeftEllipsis: boolean
	showRightEllipsis: boolean
}

export const usePagination = ({
	currentPage,
	totalPages,
	paginationItemsToDisplay,
}: UsePaginationProps): UsePaginationReturn => {
	const pages = useMemo(() => {
		if (totalPages <= paginationItemsToDisplay) {
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		}

		const halfDisplay = Math.floor(paginationItemsToDisplay / 2)
		const initialRange = {
			start: currentPage - halfDisplay,
			end: currentPage + halfDisplay,
		}

		const adjustedRange = {
			start: Math.max(1, initialRange.start),
			end: Math.min(totalPages, initialRange.end),
		}

		if (adjustedRange.start === 1) {
			adjustedRange.end = paginationItemsToDisplay
		}
		if (adjustedRange.end === totalPages) {
			adjustedRange.start = totalPages - paginationItemsToDisplay + 1
		}

		return Array.from(
			{ length: adjustedRange.end - adjustedRange.start + 1 },
			(_, i) => adjustedRange.start + i
		)
	}, [currentPage, totalPages, paginationItemsToDisplay])

	const showLeftEllipsis = useMemo(() => {
		if (totalPages <= paginationItemsToDisplay) return false
		return pages[0] > 1
	}, [pages, totalPages, paginationItemsToDisplay])

	const showRightEllipsis = useMemo(() => {
		if (totalPages <= paginationItemsToDisplay) return false
		return pages[pages.length - 1] < totalPages
	}, [pages, totalPages, paginationItemsToDisplay])

	return {
		pages,
		showLeftEllipsis,
		showRightEllipsis,
	}
}

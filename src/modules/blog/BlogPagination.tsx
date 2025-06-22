'use client'

import { usePagination } from '@/hooks/usePagination'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/navigation/Pagination'
import { useQueryStates } from 'nuqs'
import { blogParsers } from './blogSearchParams'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

type PaginationProps = {
	totalPages: number
	paginationItemsToDisplay?: number
}

type MobilePaginationProps = {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

type DesktopPaginationProps = {
	currentPage: number
	totalPages: number
	pages: number[]
	showLeftEllipsis: boolean
	showRightEllipsis: boolean
	onPageChange: (page: number) => void
}

const MobilePagination = ({ currentPage, totalPages, onPageChange }: MobilePaginationProps) => {
	const mobilePages = useMemo(() => {
		if (totalPages <= 3) {
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		}
		if (currentPage === 1) {
			return [1, 2, 3]
		}
		if (currentPage === totalPages) {
			return [totalPages - 2, totalPages - 1, totalPages]
		}
		return [currentPage - 1, currentPage, currentPage + 1]
	}, [currentPage, totalPages])

	return (
		<>
			<PaginationItem>
				<PaginationLink
					className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
					onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
					isDisabled={currentPage === 1}
					isActive={false}
					size="icon"
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="sr-only">Previous page</span>
				</PaginationLink>
			</PaginationItem>

			{mobilePages.map((pageNumber) => (
				<PaginationItem key={pageNumber}>
					<PaginationLink
						onClick={() => onPageChange(pageNumber)}
						isActive={pageNumber === currentPage}
						isDisabled={false}
						size="icon"
					>
						{pageNumber}
					</PaginationLink>
				</PaginationItem>
			))}

			<PaginationItem>
				<PaginationLink
					className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
					onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
					isDisabled={currentPage === totalPages}
					isActive={false}
					size="icon"
				>
					<ChevronRight className="h-4 w-4" />
					<span className="sr-only">Next page</span>
				</PaginationLink>
			</PaginationItem>
		</>
	)
}

const DesktopPagination = ({
	currentPage,
	totalPages,
	pages,
	showLeftEllipsis,
	showRightEllipsis,
	onPageChange,
}: DesktopPaginationProps) => {
	return (
		<>
			<PaginationItem>
				<PaginationPrevious
					className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
					onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
					isDisabled={currentPage === 1}
					isActive={false}
					size="md"
				/>
			</PaginationItem>

			{showLeftEllipsis && (
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
			)}

			{pages.map((pageNumber) => (
				<PaginationItem key={pageNumber}>
					<PaginationLink
						onClick={() => onPageChange(pageNumber)}
						isActive={pageNumber === currentPage}
						isDisabled={false}
						size="icon"
					>
						{pageNumber}
					</PaginationLink>
				</PaginationItem>
			))}

			{showRightEllipsis && (
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
			)}

			<PaginationItem>
				<PaginationNext
					className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
					onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
					isDisabled={currentPage === totalPages}
					isActive={false}
					size="md"
				/>
			</PaginationItem>
		</>
	)
}

export const BlogPagination = ({ totalPages, paginationItemsToDisplay = 5 }: PaginationProps) => {
	const [{ page }, setParams] = useQueryStates(blogParsers)

	const currentPage = page || 1
	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage,
		totalPages,
		paginationItemsToDisplay,
	})

	const handlePageChange = useMemo(
		() => (newPage: number) => {
			setParams({ page: newPage }, { shallow: false, scroll: true })
		},
		[setParams]
	)

	return (
		<Pagination>
			<PaginationContent>
				{/* Mobile View */}
				<div className="flex sm:hidden">
					<MobilePagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>

				{/* Desktop View */}
				<div className="hidden sm:flex">
					<DesktopPagination
						currentPage={currentPage}
						totalPages={totalPages}
						pages={pages}
						showLeftEllipsis={showLeftEllipsis}
						showRightEllipsis={showRightEllipsis}
						onPageChange={handlePageChange}
					/>
				</div>
			</PaginationContent>
		</Pagination>
	)
}

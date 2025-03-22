"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
  selectedType: string
}

export default function Pagination({ currentPage, totalPages, selectedType }: PaginationProps) {
  const pathname = usePathname()

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always include last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set("page", page.toString())

    if (selectedType) {
      params.set("type", selectedType)
    }

    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      {/* Previous button */}
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Previous
        </Link>
      )}

      {/* Page numbers */}
      <div className="flex space-x-2">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-4 py-2 text-blue-700">
              ...
            </span>
          ) : (
            <Link
              key={`page-${page}`}
              href={createPageUrl(page as number)}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentPage === page
                  ? "bg-yellow-400 text-blue-800 font-bold shadow-md transform scale-105"
                  : "bg-white hover:bg-gray-100 text-blue-700 shadow"
              }`}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {/* Next button */}
      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  )
}


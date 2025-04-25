import { JSX } from "react"
import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

import { DashboardSection } from "@components/dashboard/DashboardSection"

import { Button } from "@form/Button"

export type DashboardPaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    totalPages: number
    currentPages: number
    perPage: number
}

export function DashboardPagination({
    currentPage,
    totalPages,
    onPageChange
}: DashboardPaginationProps): JSX.Element {
    return (
        <DashboardSection className="pagination-section">
            <div className="dashboard-pagination">
                { currentPage > 1 && (
                    <Button
                        variant="secondary"
                        onClick={() => onPageChange(currentPage - 1)}
                        className="text-content dashboard-pagination-button"
                        aria-label="Page précédente"
                    >
                        <ChevronLeft size={20} />
                    </Button>
                )}

                <span className="dashboard-pagination-info text-content text-primary">
                    Page { currentPage } sur { totalPages }
                </span>

                { currentPage < totalPages && (
                    <Button
                    variant="secondary"
                    onClick={() => onPageChange(currentPage + 1)}
                    className="text-content dashboard-pagination-button"
                    aria-label="Page suivante"
                >
                    <ChevronRight size={20} />
                </Button>
                )}
            </div>
        </DashboardSection>
    )
}
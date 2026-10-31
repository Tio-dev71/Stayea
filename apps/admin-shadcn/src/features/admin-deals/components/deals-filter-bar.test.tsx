import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { DealsFilterBar } from "./deals-filter-bar"

describe("DealsFilterBar", () => {
  it("renders tablist and tabs with accessible ARIA attributes", () => {
    const handleSelect = vi.fn()
    const handleSearch = vi.fn()
    const handleCreate = vi.fn()

    render(
      <DealsFilterBar
        searchQuery=""
        onSearchChange={handleSearch}
        activeStatusTab="all"
        onSelectStatusTab={handleSelect}
        onOpenCreateModal={handleCreate}
        totalCount={0}
        activeCount={0}
        upcomingCount={0}
        expiredCount={0}
      />
    )

    const tablist = screen.getByRole("tablist", { name: "Lọc khuyến mãi theo trạng thái" })
    expect(tablist).toBeInTheDocument()

    const allTab = screen.getByRole("tab", { name: "Tất cả (0)" })
    expect(allTab).toHaveAttribute("aria-selected", "true")

    const expiredTab = screen.getByRole("tab", { name: "Đã kết thúc (0)" })
    expect(expiredTab).toBeInTheDocument()
    expect(expiredTab).toHaveAttribute("aria-selected", "false")

    fireEvent.click(expiredTab)
    expect(handleSelect).toHaveBeenCalledWith("expired")
  })

  it("provides accessible search input and create button", () => {
    const handleSearch = vi.fn()
    const handleCreate = vi.fn()

    render(
      <DealsFilterBar
        searchQuery="Summer Sale"
        onSearchChange={handleSearch}
        activeStatusTab="all"
        onSelectStatusTab={vi.fn()}
        onOpenCreateModal={handleCreate}
        totalCount={5}
        activeCount={3}
        upcomingCount={1}
        expiredCount={1}
      />
    )

    const searchInput = screen.getByRole("textbox", { name: "Tìm kiếm khuyến mãi, mã giá" })
    expect(searchInput).toHaveValue("Summer Sale")

    fireEvent.change(searchInput, { target: { value: "Winter" } })
    expect(handleSearch).toHaveBeenCalledWith("Winter")

    const createBtn = screen.getByRole("button", { name: "Tạo chương trình khuyến mãi" })
    fireEvent.click(createBtn)
    expect(handleCreate).toHaveBeenCalled()
  })
})


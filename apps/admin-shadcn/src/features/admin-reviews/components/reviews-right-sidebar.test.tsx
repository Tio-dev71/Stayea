import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ReviewsRightSidebar } from "./reviews-right-sidebar"

describe("ReviewsRightSidebar", () => {
  it("renders genuine empty state when reviews distribution and categories are empty", () => {
    render(
      <ReviewsRightSidebar
        totalReviews={0}
        distribution={[]}
        categories={[]}
        locations={[]}
      />
    )

    expect(screen.getByText("Phân bố đánh giá")).toBeInTheDocument()
    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("Đánh giá")).toBeInTheDocument()
    expect(screen.getByText("Chưa có dữ liệu đánh giá")).toBeInTheDocument()

    expect(screen.getByText("Đánh giá theo loại hình")).toBeInTheDocument()
    expect(
      screen.getByText("Chưa có dữ liệu đánh giá theo loại hình.")
    ).toBeInTheDocument()

    expect(screen.getByText("Địa điểm được đánh giá nhiều")).toBeInTheDocument()
    expect(
      screen.getByText("Chưa có dữ liệu đánh giá theo địa điểm.")
    ).toBeInTheDocument()
  })

  it("renders star labels without truncation when distribution has items", () => {
    render(
      <ReviewsRightSidebar
        totalReviews={10}
        distribution={[
          { stars: 5, label: "5 sao", percentage: 80, count: 8, color: "#007a48" },
          { stars: 4, label: "4 sao", percentage: 20, count: 2, color: "#10b981" },
        ]}
        categories={[]}
        locations={[]}
      />
    )

    expect(screen.getByText("5 sao")).toBeInTheDocument()
    expect(screen.getByText("4 sao")).toBeInTheDocument()
    expect(screen.getByText(/80%/)).toBeInTheDocument()
  })
})


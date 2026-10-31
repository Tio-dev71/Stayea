import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { RevenueRightSidebar } from "./revenue-right-sidebar"

describe("RevenueRightSidebar", () => {
  it("renders genuine empty state when payment methods and locations are empty", () => {
    render(<RevenueRightSidebar paymentMethods={[]} locations={[]} />)

    expect(screen.getByText("Phương thức thanh toán")).toBeInTheDocument()
    expect(
      screen.getByText("Chưa có giao dịch phát sinh qua cổng thanh toán.")
    ).toBeInTheDocument()

    expect(screen.getByText("Doanh thu theo địa điểm")).toBeInTheDocument()
    expect(
      screen.getByText("Chưa có dữ liệu doanh thu theo địa phương.")
    ).toBeInTheDocument()
  })
})


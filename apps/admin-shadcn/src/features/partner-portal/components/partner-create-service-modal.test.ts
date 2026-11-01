import { describe, expect, it } from "vitest"

function parseDriveUrl(input: string): { convertedUrl: string; isDrive: boolean } {
  if (!input) return { convertedUrl: "", isDrive: false }
  const trimmed = input.trim()

  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)

    if (fileIdMatch && fileIdMatch[1]) {
      return {
        convertedUrl: `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`,
        isDrive: true,
      }
    }
  }

  return { convertedUrl: trimmed, isDrive: false }
}

describe("parseDriveUrl", () => {
  it("converts standard sharing link", () => {
    const url = "https://drive.google.com/file/d/1w8yPqABC123456789_-xyz/view?usp=sharing"
    const result = parseDriveUrl(url)
    expect(result.isDrive).toBe(true)
    expect(result.convertedUrl).toBe("https://lh3.googleusercontent.com/d/1w8yPqABC123456789_-xyz")
  })

  it("converts open id link", () => {
    const url = "https://drive.google.com/open?id=12345FileIdXYZ"
    const result = parseDriveUrl(url)
    expect(result.isDrive).toBe(true)
    expect(result.convertedUrl).toBe("https://lh3.googleusercontent.com/d/12345FileIdXYZ")
  })

  it("converts uc id link", () => {
    const url = "https://drive.google.com/uc?id=789SampleId_abc"
    const result = parseDriveUrl(url)
    expect(result.isDrive).toBe(true)
    expect(result.convertedUrl).toBe("https://lh3.googleusercontent.com/d/789SampleId_abc")
  })

  it("leaves standard Unsplash/direct URLs untouched", () => {
    const url = "https://images.unsplash.com/photo-1582719478250"
    const result = parseDriveUrl(url)
    expect(result.isDrive).toBe(false)
    expect(result.convertedUrl).toBe(url)
  })
})


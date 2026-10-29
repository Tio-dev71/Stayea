/**
 * Export data to UTF-8 CSV with BOM for proper Vietnamese character rendering in Excel
 */
export function exportToCsv(
  dataOrFilename: Record<string, any>[] | string,
  filenameOrHeaders?: string | string[],
  maybeRows?: (string | number)[][]
) {
  if (typeof window === "undefined") return

  let filename = "export"
  let headers: string[] = []
  let rows: (string | number)[][] = []

  if (Array.isArray(dataOrFilename) && typeof filenameOrHeaders === "string") {
    // Overload 1: exportToCsv(objectsArray, filename)
    filename = filenameOrHeaders
    if (dataOrFilename.length > 0 && dataOrFilename[0]) {
      headers = Object.keys(dataOrFilename[0])
      rows = dataOrFilename.map((obj) => headers.map((h) => obj[h] ?? ""))
    }
  } else if (typeof dataOrFilename === "string" && Array.isArray(filenameOrHeaders) && Array.isArray(maybeRows)) {
    // Overload 2: exportToCsv(filename, headers, rows)
    filename = dataOrFilename
    headers = filenameOrHeaders
    rows = maybeRows
  }

  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\r\n")

  // Prepend UTF-8 BOM (\uFEFF)
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

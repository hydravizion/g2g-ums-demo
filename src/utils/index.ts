export function exportToCSV(data: Record<string, any>[], filename = 'data.csv') {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers
      .map((field) => {
        const value = row[field] ?? ''
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(',')
  )

  const csvContent = [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

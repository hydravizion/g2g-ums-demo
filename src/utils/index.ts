function sanitizeCSVValue(value: any): string {
  if (value === null || value === undefined) return ''

  let str = String(value)

  // Escape double quotes
  str = str.replace(/"/g, '""')

  // Protect against Excel formula injection
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`
  }

  // Wrap in quotes if value contains special characters
  if (/[",\n]/.test(str)) {
    str = `"${str}"`
  }

  return str
}

export function exportToCSV(data: Record<string, any>[], filename = 'data.csv') {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const rows = data.map((row) => headers.map((field) => sanitizeCSVValue(row[field])).join(','))

  // UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF'
  const csvContent = BOM + [headers.join(','), ...rows].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function fallbackUrlCreator(event: any, name: string) {
  let colors = ['#ED2224', '#FF0000', '#282464', '#0097A7', '#FFD966']
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = 200
  canvas.width = size
  canvas.height = size
  ctx.fillStyle = colors[name[0].toLowerCase().charCodeAt(0) % colors.length] // Background color
  ctx.fillRect(0, 0, size, size)
  ctx.font = 'bold 64px Arial'
  ctx.fillStyle = 'white' // Text color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name[0].toUpperCase(), size / 2, size / 2)

  const dataUrl = canvas.toDataURL()
  event.target.src = dataUrl
}

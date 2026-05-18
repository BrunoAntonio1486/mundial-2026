export function convertETtoPeru(dateStr: string) {

  const date = new Date(dateStr)

  // ET en junio = UTC-4
  // Perú = UTC-5
  // diferencia: -1 hora

  date.setHours(date.getHours() - 1)

  return date
}
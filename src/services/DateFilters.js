import { format, formatDistance, isSameDay, isSameYear, parseISO, addDays } from 'date-fns'

export function toLocalISO (value) {
  return format(parseISO(value))
}

export function toFullDateTime (value) {
  return format(parseISO(value), 'dddd, MMMM Do, YYYY h:mm:ss A')
}

export const differenceInWords = (value, compareDate) => formatDistance(parseISO(value), compareDate, { addSuffix: true })

export function toMaterialDate (value, currentDate) {
  const parsedValue = parseISO(value)
  if (isSameDay(parsedValue, currentDate)) {
    return 'Today'
  }
  if (isSameDay(parsedValue, addDays(currentDate, 1))) {
    return 'Tomorrow'
  }
  if (isSameDay(parsedValue, addDays(currentDate, -1))) {
    return 'Yesterday'
  }
  let formatString = 'MMMM d'
  if (!isSameYear(parsedValue, currentDate)) {
    formatString += ' y'
  }
  return format(parsedValue, formatString)
}

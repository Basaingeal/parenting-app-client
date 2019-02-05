import { format, formatDistanceStrict, isSameDay, isSameYear, parseISO, addDays, subDays, differenceInWeeks } from 'date-fns'

export function toLocalISO (value) {
  return format(parseISO(value), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
}

export function toFullDateTime (value) {
  return format(parseISO(value), 'dddd, MMMM Do, yyyy h:mm:ss aa')
}

export const differenceInWords = (value, compareDate) => formatDistanceStrict(parseISO(value), compareDate, { addSuffix: true })

export function toMaterialDate (value, currentDate) {
  const parsedValue = parseISO(value)
  if (isSameDay(parsedValue, currentDate)) {
    return 'Today'
  }
  if (isSameDay(parsedValue, addDays(currentDate, 1))) {
    return 'Tomorrow'
  }
  if (isSameDay(parsedValue, subDays(currentDate, 1))) {
    return 'Yesterday'
  }
  let formatString = 'MMMM d'
  if (!isSameYear(parsedValue, currentDate)) {
    formatString += ' y'
  }
  return format(parsedValue, formatString)
}

export function toMaterialTime (value) {
  const parsedValue = parseISO(value)
  return format(parsedValue, 'h:mm aa')
}

export function toMaterialDateTime (value, currentDate, useDistance = false) {
  const dateString = toMaterialDate(value, currentDate)
  if (useDistance && differenceInWeeks(currentDate, parseISO(value)) >= 1) {
    return dateString
  }
  const timeString = toMaterialTime(value)
  return `${dateString}, ${timeString}`
}

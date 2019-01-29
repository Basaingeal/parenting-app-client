import { format } from 'date-fns'

export function toLocalISO (value) {
  return format(value)
}

export function toFullDateTime (value) {
  return format(value, 'dddd, MMMM Do, YYYY h:mm:ss A')
}

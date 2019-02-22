import { format, subDays } from 'date-fns/fp'

export function ozToMl (oz) {
  const ml = oz * 29.5735295625
  return Math.round(ml * 100000) / 100000
}

export function mlToOz (ml) {
  const oz = ml / 29.5735295625
  return Math.round(oz * 100000) / 100000
}

export const formatDateISO = format('yyyy-MM-dd')
export const subtract1Day = subDays(1)

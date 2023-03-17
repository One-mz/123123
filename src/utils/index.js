import moment from 'moment'
import { dateFormat } from '@/config/constant'

export function dateFormatFn(dateStr, format = dateFormat.YMD) {
  return dateStr ? moment(dateStr).format(format) : moment().format(format)
}

export function getDate(dateStr) {
  return dateStr ? moment(dateStr).format(dateFormat.YMD) : moment().format(dateFormat.YMD)
}


import { domain } from 'config/domain'

let timeout = 0
if (process.env.NODE_ENV === 'development') {
  timeout = 0
} else {
  timeout = 20000
}
export default {
  baseURL: domain,
  timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
}

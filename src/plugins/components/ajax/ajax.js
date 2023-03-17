import qs from 'qs'
import axios from 'axios'
import isObject from 'lodash/isObject'
import config from './config'

// 根据项目配置创建 axios 实例
const instance = axios.create(config)

function parseRes(response) {
  const { data, status, statusText } = response
  return {
    status,
    statusText,
    data,
  }
}

export function get(url, data, opt = {}) {
  if (data) opt.params = data
  return instance.get(url, opt).then(response => parseRes(response))
}

export function post(url, data, opt) {
  let body = data
  return instance.post(url, body, opt).then(response => parseRes(response))
}
export function post2(url, data, opt) {
  let body = data
  if (isObject(data)) {
    body = qs.stringify(data, { arrayFormat: 'brackets' })
  }
  return instance.post(url, body, opt).then(response => parseRes(response))
}

export { instance as axios }

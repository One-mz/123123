import { get, post, post2, axios } from './ajax'

export default {
  install(Vue) {
    Object.defineProperties(Vue.prototype, {
      $get: {
        value: get,
      },
      $post: {
        value: post,
      },
      $post2: {
        value: post2,
      },
      $axios: {
        value: axios,
      },
    })
  },
}

export { get, post, post2, axios }

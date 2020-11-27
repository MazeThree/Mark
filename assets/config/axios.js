import axios from 'axios'
// import Qs from 'qs'
import Vue from 'vue'
import { Message } from 'element-ui' // 引用element-ui的加载和消息提示组件

const $axios = axios.create({
  // 设置超时时间
  timeout: 50000,
  // 基础url，会在请求url中自动添加前置链接
  baseURL:  '/api'
})
Vue.prototype.$http = axios // 并发请求

/**
 * 功能： 避免Post 请求重复提交
 */
const CancelToken = new axios.CancelToken(cancel => cancel())

const httpPending = {}
const removeHttpPending = (config, isRemove = true) => {
  if (!config) {
    return false
  }
  let key = config.url.includes(host) ? config.url.replace(host, '') : config.url
  let val = typeof config.data === 'object' ? JSON.stringify(config.data) : config.data
  if (httpPending[key] === val) {
    if (isRemove) {
      delete httpPending[key]
    } else {
      console.log(httpPending[key])
      console.log(val)
      console.warn(`[${key}]: repeated http request`) // 重复提交
    }
    return true
  }
  httpPending[key] = val
  return false
}

// 请求拦截器
$axios.interceptors.request.use(
  config => {
    config.headers['charset'] = 'UTF-8'
    config.headers['content-type'] = 'application/json'
      // 防止重复提交
    if (config.method === 'post') {
      if (removeHttpPending(config, false)) {
        config.cancelToken = CancelToken
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
$axios.interceptors.response.use(
  response => {
    removeHttpPending(data.config)
    return response
  },
  error => {
    removeHttpPending(data.config)
    return Promise.reject(error)
  }
)

// get，post请求方法
export default {
  sendRequest ({
    method = 'GET',
    url,
    data,
    params = {},
    timeout = 1000 * 60,
    binary = false,
    cache = false,
    useFormData = false,
    responseType
  }) {
    // const namespace = sessionStorage.getItem('namespace')
    // const token = sessionStorage.getItem('token')
    // Most rubick ajax calls are subject to namespace
    // if (!params.namespace && addNamespace) {
    //   params.namespace = namespace
    // }

    // combine params & data and assign to data
    if (!(data instanceof FormData) && !(data instanceof Array)) {
      data = Object.assign({}, data, params)
    }
    const config = {
      method,
      url,
      timeout,
      cache,
      data,
      params,
      // xsrfHeaderName: 'X-CSRFToken',
      // xsrfCookieName: '294f62ecd0',
      // client: 'rbHttp',
      responseType
    }
    config.headers = {}
    config.headers['Content-Type'] = 'application/json'
    config.headers.Accept = 'application/json, text/plain, */*'
    // config.headers.Authorization = 'Bearer ' + token
    if (useFormData) {
      if (!(data instanceof FormData)) {
        config.data = this._buildFormData(data)
      }
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    if (binary) {
      config.responseType = 'arraybuffer'
    }
    return $axios(config)
  },
  post(url, data = {}) {
    return $axios({
      method: 'post',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
  },
  get(url, params) {
    return $axios({
      method: 'get',
      url,
      params
    })
  }
}

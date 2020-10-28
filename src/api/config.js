import axios from 'axios'

// 跨域时处理
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/api'
axios.defaults.baseURL = BASEURL

// 不跨越时直接写后台地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.timeout = 3000

// 跨域时响应带上cookie设置 withCredentials = true
// axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.transformRequest = function (data) {
  if (!data) return data
  let str = ''
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) break
    str += `&${key}=${data[key]}`
  }
  return str.substring(1)
}

axios.interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  const data = response.data
  return data
}, function (error) {
  return Promise.reject(error)
})

export default axios

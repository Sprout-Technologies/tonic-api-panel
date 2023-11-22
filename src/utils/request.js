import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import * as Qs from 'qs'
import { Loading } from 'element-ui'
``
// 在这里可以根据不同的环境进行切换，基于当前的域名判断当前环境。如果是localhost则是本地环境，如果是beta.tonic.video则是测试环境，如果是app.tonic.video则是生产环境。

// 基于当前域名判断环境
const hostname = window.location.hostname
let envBaseApi

if (hostname === 'localhost') {
  // 本地环境http://localhost:1240/api/v1/
  envBaseApi = 'https://localhost:1240/api/v1/'
} else if (hostname === 'beta.tonic.video') {
  // 测试环境
  envBaseApi = 'https://beta.tonic.video/api/v1'
} else if (hostname === 'app.tonic.video') {
  // 生产环境
  envBaseApi = 'https://app.tonic.video/api/v1/'
}
const service = axios.create({
  baseURL: envBaseApi, // api的base_url
  timeout: 60000, // 请求超时时间
  paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' })
})

let globalLoading

function startLoading() {
  globalLoading = Loading.service({

    lock: true,

    text: 'Loading…',

    background: 'rgba(0, 0, 0, 0.7)'

  })
}

function endLoading() {
  setTimeout(() => {
    globalLoading.close()
  }, 2000)
}

let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }

  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return

  needLoadingRequestCount--

  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

service.baseURL = process.env.BASE_API
service.token = getToken()
// request拦截器
service.interceptors.request.use(config => {
  try {
    const token = getToken()
    if (token) {
      config.headers['X-Authorization'] = 'Bearer ' + token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (!service.token) {
      service.token = token
    }
    showFullScreenLoading()
  } catch (e) {
    tryHideFullScreenLoading()
    console.log(e)
  }
  return config
}, error => {
  // Do something with request error
  tryHideFullScreenLoading()

  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response
    tryHideFullScreenLoading()
    if (res.statusCode) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload()// 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    tryHideFullScreenLoading()

    console.log('err' + error)// for debug
    Message({
      message: 'error: [' + error.response.data.code + '] ' + error.response.data.error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

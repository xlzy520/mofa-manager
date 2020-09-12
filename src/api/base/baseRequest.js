import axios from 'axios'
import { Toast } from "vant";
import router from '../../router'

const baseRequest = axios.create({
  baseURL: 'http://101.133.152.103:8091/vbiz/',
  withCredentials: true,
  timeout: 20 * 1000,
})

baseRequest.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.Success) {
      Toast({
        message: res.Message,
        duration: 2000
      })
      // token已过期
      if (res.Code === 45001) {
        localStorage.clear()
        router.push('/login')
      }
      return Promise.reject(res)
    } else {
      return res.Data
    }
  },
  error => {
    error.message = error.message === 'timeout of 10000ms exceeded' ? '连接服务器超时！' : error.message
    Toast({
      message: error.message,
      type: 'error',
      duration: 1.5 * 1000
    })
    return Promise.reject(error)
  }
)

export default baseRequest

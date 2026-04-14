import axios, { type Method } from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import { showToast } from 'vant'
import type { AxiosRequestConfig } from 'axios'

// 1. 基地址 + 超时时间
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
})

instance.interceptors.request.use(
  (config) => {
    // 2. 携带 token
    const userStore = useUserStore()
    if (userStore.user?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${userStore.user?.token}`
    }
    return config
  },
  (err) => Promise.reject(err),
)

instance.interceptors.response.use(
  (res) => {
    // 3. 处理业务失败
    if (res.data?.code !== 10000) {
      showToast(res.data?.message || '业务失败')
      return Promise.reject(res.data)
    }
    // 4. 数据剥离
    return res.data
  },
  (err) => {
    // 5. 处理401错误
    if (err.response?.status === 401) {
      // 删除用户信息
      const userStore = useUserStore()
      userStore.delUser()
      // 跳转登录页
      router.push({
        path: '/login',
        // 带上所在页面的地址，登录完成后回跳使用
        query: { returnUrl: router.currentRoute.value.fullPath },
      })
    }
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }

// 6. 导出请求函数，方便使用
type Data<T> = {
  code: number
  message: string
  data: T
}

export const request = <T>(url: string, method: Method = 'GET', submitData?: object) => {
  const config: AxiosRequestConfig = {
    url,
    method,
  }
  // 根据 method 判断是传 params 还是 data
  if (method.toUpperCase() === 'GET') {
    config.params = submitData
  } else {
    config.data = submitData
  }
  return instance.request<unknown, Data<T>>(config)
}

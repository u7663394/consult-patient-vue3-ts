import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 路由配置
 *   1. createRouter() 创建路由实例
 *   2. createWebHistory() 使用 history 模式
 *   3. routes: 定义路由规则，对象数组
 *   4. import.meta.env.BASE_URL: 路由基础路径，开发环境默认为'/', 根据 Vite 配置自动设置
 *   5. routes 里的 meta: 可以存放自定义元信息
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/index.vue'), meta: { title: '登录' } },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' },
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' },
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人中心' },
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' },
        },
      ],
    },
  ],
})

/**
 * 路由前置守卫 -> 访问权限控制
 *
 * 语法:
 *   1. return false: 取消跳转 (停留在当前页)
 *   2. return '/path': 重定向到指定路径
 *   3. return undefined or true: 放行
 */
const wihteList = ['/login']
router.beforeEach((to) => {
  // 没有 token 且不访问白名单 -> 重定向到登录页
  const userStore = useUserStore()
  if (!userStore.user?.token && !wihteList.includes(to.path)) {
    return '/login'
  }
})

/**
 * 路由后置守卫 -> 页面标题设置
 */
router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-优医问诊`
})

export default router

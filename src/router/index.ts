import { createRouter, createWebHistory } from 'vue-router'

/**
 * 路由配置
 *   1. createRouter() 创建路由实例
 *   2. createWebHistory() 使用 history 模式
 *   3. routes: 定义路由规则，对象数组
 *   4. import.meta.env.BASE_URL: 路由基础路径，开发环境默认为'/', 根据 Vite 配置自动设置
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/index.vue') },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        { path: '/home', component: () => import('@/views/Home/index.vue') },
        { path: '/article', component: () => import('@/views/Article/index.vue') },
        { path: '/user', component: () => import('@/views/User/index.vue') },
        { path: '/notify', component: () => import('@/views/Notify/index.vue') },
      ],
    },
  ],
})

export default router

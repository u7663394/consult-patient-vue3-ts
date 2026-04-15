import 'vue-router'

// 扩展 routes 里的 meta 类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

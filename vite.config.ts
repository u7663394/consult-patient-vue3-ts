/// <reference types="vitest/config" />
/**
 * TS 先读取三斜线预处理指令
 * 必须放在文件的最顶部
 */

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'
// 组件自动注册
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// 打包 svg 地图
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// Mock 插件
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 80,
    host: true,
  },
  test: {
    environment: 'happy-dom',
  },
  plugins: [
    vue(),
    vueDevTools(),
    createHtmlPlugin(),
    viteMockServe({
      mockPath: './src/mock',
      enable: true,
    }),
    Components({
      // 不自动生成组件类型文件
      dts: false,
      // main.ts 中已经引入了样式, 此处不再引入样式
      resolvers: [VantResolver({ importStyle: false })],
    }),
    createSvgIconsPlugin({
      // 指定图标文件夹, 绝对路径
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

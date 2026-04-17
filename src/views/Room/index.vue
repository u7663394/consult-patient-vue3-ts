<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomStatus from './components/RoomStatus.vue'
import io, { Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'

/**
 * 建立 websocket 通信
 *   1. 携带 token 和 orderId
 *   2. 监听连接成功/关闭/错误事件
 *   3. 监听 chatMsgList 事件, 接受默认消息列表
 */
let socket: Socket
const userStore = useUserStore()
const route = useRoute()
onMounted(() => {
  // 1. 建立连接, 携带 token 和 orderId
  socket = io(baseURL, {
    auth: { token: `Bearer ${userStore.user?.token}` },
    query: { orderId: route.query.orderId },
  })
  // 2. 监听连接成功事件
  socket.on('connect', () => {
    console.log('连接成功')
  })
  // 关闭事件
  socket.on('disconnect', () => {
    console.log('连接关闭')
  })
  // 错误事件
  socket.on('error', () => {
    console.log('连接错误')
  })
  // 3. 监听 chatMsgList 事件
  socket.on('chatMsgList', (res) => {
    console.log('收到消息列表', res)
  })
})
// 组件卸载时关闭连接
onUnmounted(() => {
  socket.close()
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <room-status />
    <room-message></room-message>
    <room-action></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>

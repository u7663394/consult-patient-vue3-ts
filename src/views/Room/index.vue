<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomStatus from './components/RoomStatus.vue'
import io, { Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'

/**
 * 建立 websocket 通信
 *   0. 获取订单详情
 *   1. 携带 token 和 orderId
 *   2. 监听连接成功/关闭/错误事件
 *   3. 监听 chatMsgList 事件, 接受默认消息列表
 *     3.1. 处理消息列表以符合接口类型
 *     3.2. 更新 list 用于渲染
 *   4. 监听 statusChange 事件, 接受订单状态变化消息
 */
let socket: Socket
const userStore = useUserStore()
const route = useRoute()
const list = ref<Message[]>([])
const consult = ref<ConsultOrderItem>()
const getStatus = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}
onMounted(async () => {
  // 0. 获取订单详情
  await getStatus()
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
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 3.1. 处理 data 数据得到 Message[] 类型的 msgList
    const msgList: Message[] = []
    data.forEach((item) => {
      msgList.push({
        msgType: MsgType.Notify,
        msg: {
          content: item.createTime,
        },
        createTime: item.createTime,
        id: item.createTime,
      })
      msgList.push(...item.items)
    })
    // 3.2. 更新 list 用于渲染
    list.value.unshift(...msgList)
  })
  // 4. 监听 statusChange 事件
  socket.on('statusChange', async () => {
    await getStatus()
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
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <room-message v-for="msg in list" :key="msg.id" :item="msg"></room-message>
    <room-action :disabled="consult?.status !== OrderType.ConsultChat"></room-action>
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

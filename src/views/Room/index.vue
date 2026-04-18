<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomStatus from './components/RoomStatus.vue'
import io, { Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { showToast } from 'vant'

/**
 * 建立 websocket 通信
 *   0. 获取订单详情
 *   1. 携带 token 和 orderId
 *   2. 监听连接成功/关闭/错误事件
 *   3. 监听 chatMsgList 事件, 接受默认消息列表
 *     3.1. 处理消息列表以符合接口类型
 *     3.2. 更新 list 用于渲染
 *     3.3. 如果是初次进入, 滚动到底部
 *   4. 监听 statusChange 事件, 接受订单状态变化消息
 *   5. 监听 receiveChatMsg 事件, 接受并渲染文字消息
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
const initEnter = ref(true)
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
    data.forEach((item, index) => {
      if (index === 0) {
        time.value = item.createTime
      }
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
    loading.value = false
    if (!msgList.length) return showToast('没有更多消息了')
    // 3.3. 如果是初次进入, 滚动到底部
    if (initEnter.value) {
      socket.emit('updateMsgStatus', msgList[msgList.length - 1]!.id)
      nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      initEnter.value = false
    }
  })
  // 4. 监听 statusChange 事件
  socket.on('statusChange', async () => {
    await getStatus()
  })
  // 5. 监听 receiveChatMsg 事件
  socket.on('receiveChatMsg', async (msg: Message) => {
    socket.emit('updateMsgStatus', msg.id)
    list.value.push(msg)
    // 滚动到底部
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })
})
// 组件卸载时关闭连接
onUnmounted(() => {
  socket.close()
})

/**
 * 发送文字消息
 */
const onSendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text },
  })
}

/**
 * 发送图片消息
 */
const onSendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img },
  })
}

/**
 * 下拉刷新
 */
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const loading = ref(false)
const onRefresh = async () => {
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <!--
      下拉刷新组件, 包裹消息列表: 
        1. 绑定 loading 状态
        2. 监听 refresh 事件, 刷新时回调
    -->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message v-for="msg in list" :key="msg.id" :item="msg"></room-message>
    </van-pull-refresh>
    <room-action
      @send-image="onSendImage"
      @send-text="onSendText"
      :disabled="consult?.status !== OrderType.ConsultChat"
    ></room-action>
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

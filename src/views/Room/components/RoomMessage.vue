<script setup lang="ts">
import { IllnessTime, MsgType } from '@/enums'
import type { Message } from '@/types/room'
import { timeOptions, flagOptions } from '@/services/constant'
import type { Image } from '@/types/consult'
import { showImagePreview } from 'vant'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
import EvaluateCard from './EvaluateCard.vue'
import { useShowPrescription } from '@/composables'
const userStore = useUserStore()

/**
 * 通过 props 接收消息数据
 */
defineProps<{
  item: Message
}>()

/**
 * 获取患病时间与是否就诊文本
 */
const getIllnessTimeText = (time: IllnessTime) => {
  const text = timeOptions.find((ele) => ele.value === time)?.label
  return text
}

const getConsultFlagText = (flag: number) => {
  const text = flagOptions.find((ele) => ele.value === flag)?.label
  return text
}

/**
 * 预览图片
 */
const previewImg = (images: Image[]) => {
  showImagePreview(images.map((ele) => ele.url))
}

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

/**
 * 查看处方详情
 */
const { showPrescription } = useShowPrescription()
</script>

<template>
  <!-- 患者卡片 -->
  <div v-if="item.msgType === MsgType.CardPat" class="msg msg-illness">
    <div class="patient van-hairline--bottom">
      <p>
        {{ item.msg.consultRecord?.patientInfo.name }}
        {{ item.msg.consultRecord?.patientInfo.genderValue }}
        {{ item.msg.consultRecord?.patientInfo.age }}岁
      </p>
      <p>
        {{ getIllnessTimeText(item.msg.consultRecord?.illnessTime!) }} |
        {{ getConsultFlagText(item.msg.consultRecord?.consultFlag!) }}
      </p>
    </div>
    <van-row>
      <van-col span="6">病情描述</van-col>
      <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
      <van-col span="6">图片</van-col>
      <van-col
        v-if="item.msg.consultRecord?.pictures?.length"
        span="18"
        @click="previewImg(item.msg.consultRecord?.pictures)"
        >点击查看</van-col
      >
      <van-col v-else span="18">暂无图片</van-col>
    </van-row>
  </div>
  <!-- 通知-通用 -->
  <div v-if="item.msgType === MsgType.Notify" class="msg msg-tip">
    <div class="content">
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 通知-温馨提示 -->
  <div v-if="item.msgType === MsgType.NotifyTip" class="msg msg-tip">
    <div class="content">
      <span class="green">温馨提示: </span>
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 通知-结束 -->
  <div v-if="item.msgType === MsgType.NotifyCancel" class="msg msg-tip msg-tip-cancel">
    <div class="content">
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 发送文字 -->
  <div
    v-if="item.msgType === MsgType.MsgText && item.from === userStore.user?.id"
    class="msg msg-to"
  >
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
    <van-image
      :src="
        item.fromAvatar ||
        'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg'
      "
    />
  </div>
  <!-- 发送图片 -->
  <div
    v-if="item.msgType === MsgType.MsgImage && item.from === userStore.user?.id"
    class="msg msg-to"
  >
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <van-image fit="contain" :src="item.msg.picture?.url" />
    </div>
    <van-image :src="item.fromAvatar" />
  </div>
  <!-- 接收文字 -->
  <div
    v-if="item.msgType === MsgType.MsgText && item.from !== userStore.user?.id"
    class="msg msg-from"
  >
    <van-image
      :src="
        item.toAvatar ||
        'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg'
      "
    />
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
  </div>
  <!-- 接收图片 -->
  <div
    v-if="item.msgType === MsgType.MsgImage && item.from !== userStore.user?.id"
    class="msg msg-from"
  >
    <van-image :src="item.toAvatar" />
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <van-image fit="contain" :src="item.msg.picture?.url" />
    </div>
  </div>
  <!-- 处方卡片 -->
  <div class="msg msg-recipe" v-if="item.msgType === MsgType.CardPre">
    <div class="content" v-if="item.msg.prescription">
      <div class="head van-hairline--bottom">
        <div class="head-tit">
          <h3>电子处方</h3>
          <p @click="showPrescription(item.msg.prescription?.id)">
            原始处方 <van-icon name="arrow"></van-icon>
          </p>
        </div>
        <p>
          {{ item.msg.prescription.name }}
          {{ item.msg.prescription.genderValue }}
          {{ item.msg.prescription.age }}岁
          {{ item.msg.prescription.diagnosis }}
        </p>
        <p>开方时间：{{ item.msg.prescription.createTime }}</p>
      </div>
      <div class="body">
        <div class="body-item" v-for="med in item.msg.prescription.medicines" :key="med.id">
          <div class="durg">
            <p>{{ med.name }} {{ med.specs }}</p>
            <p>{{ med.usageDosag }}</p>
          </div>
          <div class="num">x{{ med.quantity }}</div>
        </div>
      </div>
      <div class="foot">
        <span>购买药品</span>
      </div>
    </div>
  </div>
  <!-- 评价卡片 -->
  <div
    class="msg msg-comment"
    v-if="item.msgType === MsgType.CardEva || item.msgType === MsgType.CardEvaForm"
  >
    <evaluate-card :evalState="item.msg.evaluateDoc"></evaluate-card>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>

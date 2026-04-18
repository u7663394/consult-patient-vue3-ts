<script setup lang="ts">
import { IllnessTime, MsgType } from '@/enums'
import type { Message } from '@/types/room'
import { timeOptions, flagOptions } from '@/services/constant'
import type { Image } from '@/types/consult'
import { showImagePreview } from 'vant'

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
  <!-- <div class="msg msg-tip msg-tip-cancel">
    <div class="content">
      <span>订单取消</span>
    </div>
  </div> -->
  <!-- 发送文字 -->
  <!-- <div class="msg msg-to">
    <div class="content">
      <div class="time">20:12</div>
      <div class="pao">大夫你好?</div>
    </div>
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
  </div> -->
  <!-- 发送图片 -->
  <!-- <div class="msg msg-to">
    <div class="content">
      <div class="time">20:12</div>
      <van-image
        fit="contain"
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
    </div>
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
  </div> -->
  <!-- 接收文字 -->
  <!-- <div class="msg msg-from">
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    <div class="content">
      <div class="time">20:12</div>
      <div class="pao">哪里不舒服</div>
    </div>
  </div> -->
  <!-- 接收图片 -->
  <!-- <div class="msg msg-from">
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    <div class="content">
      <div class="time">20:12</div>
      <van-image
        fit="contain"
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
    </div>
  </div> -->
  <!-- 处方卡片 -->
  <!-- <div class="msg msg-recipe">
    <div class="content">
      <div class="head van-hairline--bottom">
        <div class="head-tit">
          <h3>电子处方</h3>
          <p>原始处方 <van-icon name="arrow"></van-icon></p>
        </div>
        <p>李富贵 男 31岁 血管性头痛</p>
        <p>开方时间: 2022-01-15 14:21:42</p>
      </div>
      <div class="body">
        <div class="body-item" v-for="i in 2" :key="i">
          <div class="durg">
            <p>优赛明 维生素 E 乳</p>
            <p>口服, 每次 1 袋, 每天 3 次, 用药 3 天</p>
          </div>
          <div class="num">x1</div>
        </div>
      </div>
      <div class="foot"><span>购买药品</span></div>
    </div>
  </div> -->
  <!-- 评价卡片，后期实现 -->
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>

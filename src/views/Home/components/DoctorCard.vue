<script lang="ts" setup>
import { followOrUnfollow } from '@/services/consult'
import type { Doctor } from '@/types/consult'
import { ref } from 'vue'

/**
 * 接受父组件传入的 item 数据
 */
defineProps<{
  item: Doctor
}>()

/**
 * 关注或取消关注医生
 *   1. loading 状态控制按钮状态, 防止重复点击
 *   2. 调用接口
 *   3. 切换 likeFlag 的值
 */
const loading = ref(false)
const folllow = async (item: Doctor) => {
  loading.value = true
  try {
    // 调用接口
    await followOrUnfollow(item.id, 'doc')
    // 切换 likeFlag 的值
    if (item.likeFlag === 1) {
      item.likeFlag = 0
    } else {
      item.likeFlag = 1
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="doctor-card">
    <van-image round :src="item.avatar" />
    <p class="name">{{ item.name }}</p>
    <p class="van-ellipsis">{{ item.hospitalName }} {{ item.depName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button :loading="loading" @click="folllow(item)" round size="small" type="primary">
      {{ item.likeFlag === 1 ? '已关注' : '+ 关注' }}
    </van-button>
  </div>
</template>

<style scoped lang="scss">
.doctor-card {
  width: 135px;
  height: 190px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>

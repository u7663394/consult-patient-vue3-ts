<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'

/**
 * 利用 vueuse 的 useWindowSize 获取设备宽度
 */
const deviceWidth = useWindowSize().width

/**
 * 利用原生方式获取设备宽度
 * 
 * const width = ref(0)
 * 
 * const setWidth = () => {
 *   width.value = window.innerWidth
 * }
 * 
 * onMounted(() => {
 *   setWidth()
 *   window.addEventListener('resize', setWidth)
 * })
 * 
 * onUnmounted(() => {
 *   window.removeEventListener('resize', setWidth)
 * })
 */
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- 
       swipe 组件:
         1. show-indicators: 是否显示指示点
         2. loop: 是否循环滚动
         3. width: 每个子项的宽度; 375px 的设备上子项宽度为 150px
         4. 公式: 150 / 375 = width / deviceWidth
      -->
      <van-swipe :width="(deviceWidth * 150) / 375" :show-indicators="false" :loop="false">
        <van-swipe-item v-for="item in 5" :key="item">
          <DoctorCard></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>

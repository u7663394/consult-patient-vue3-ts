<script setup lang="ts">
import type { KnowledgeType } from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'
import { ref } from 'vue'

/**
 * 下滑加载更多
 */
const loading = ref(false)
const finished = ref(false)
const list = ref<number[]>([])
// 模拟加载数据
const onLoad = () => {
  setTimeout(() => {
    const data = [1, 2, 3, 4, 5]
    list.value.push(...data)
    // 模拟加载完毕
    if (list.value.length > 20) {
      finished.value = true
    }
    loading.value = false
  }, 1000)
}

/**
 * 不同列表通过 props 传入
 */
defineProps<{
  type: KnowledgeType
}>()
</script>

<template>
  <div class="knowledge-list">
    <!-- 
     van-list: 
       1. v-model:loading: 是否正在加载中
       2. finished: 是否加载完毕
       3. finished-text: 加载完毕显示的文本
       4. @load: 加载事件, 触底时触发
    -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="(item, index) in list" :key="index" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>

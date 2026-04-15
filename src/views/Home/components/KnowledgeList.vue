<script setup lang="ts">
import type { KnowledgeList, KnowledgeParams, KnowledgeType } from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'
import { ref } from 'vue'
import { getKnowledgePage } from '@/services/consult'

/**
 * 不同列表通过 props 传入
 */
const props = defineProps<{
  type: KnowledgeType
}>()

/**
 * 接口查询参数
 */
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 5,
})

/**
 * 下滑加载更多:
 *   1. 调用接口获取数据, 将数据追加到列表中
 *   2. 判断是否加载完毕
 *   3. 结束加载状态
 */
const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([])
const onLoad = async () => {
  // 1. 调用接口获取数据 + 追加
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  // 2. 判断是否加载完毕
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  // 3. 结束加载状态
  loading.value = false
}
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
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>

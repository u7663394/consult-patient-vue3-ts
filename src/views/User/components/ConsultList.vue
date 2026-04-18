<script setup lang="ts">
import type { ConsultType } from '@/enums'
import ConsultItem from './ConsultItem.vue'
import { ref } from 'vue'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { getConsultOrderList } from '@/services/consult'

// 接受 type 属性
const props = defineProps<{
  type: ConsultType
}>()

/**
 * 获取问诊记录列表
 *   1. 准备查询参数
 *   2. 调用接口获取数据
 *   3. 赋值 + 渲染
 */
const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
// 1. 准备查询参数
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5,
})
// 2. 调用接口获取数据
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  // 3. 赋值 + 渲染
  list.value.push(...res.data.rows)
  // 4. 判断是否 finished 和 loading
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item v-for="item in list" :key="item.id" :item="item"></consult-item>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>

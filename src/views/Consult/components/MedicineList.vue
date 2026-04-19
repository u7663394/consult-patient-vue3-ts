<script setup lang="ts">
import { getMedicinePage } from '@/services/consult'
import type { MedicineList, MedicineParams } from '@/types/consult'
import { ref, watch } from 'vue'
import MedicineCard from './MedicineCard.vue'

const props = defineProps<{
  keyword: string
}>()

const list = ref<MedicineList>([])
const loading = ref(false)
const finished = ref(false)
const params = ref<MedicineParams>({
  keyword: '',
  pageSize: 10,
  current: 1,
})

const onLoad = async () => {
  const { data } = await getMedicinePage(params.value)
  list.value.push(...data.rows)
  loading.value = false
  if (params.value.current >= data.pageTotal) {
    finished.value = true
  } else {
    params.value.current += 1
  }
}

watch(
  () => props.keyword,
  (val) => {
    params.value.keyword = val
    params.value.current = 1
    list.value = []
    finished.value = false
    loading.value = true
    onLoad()
  },
)
</script>

<template>
  <div class="medicine-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <medicine-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style scoped lang="scss">
.medicine-list {
  background-color: #fff;
  padding: 0 15px 45px;
}
</style>

<script setup lang="ts">
import { getFindDoctorPage } from '@/services/consult'
import type { DoctorList as DoctorListType, DoctorOrderType, DoctorParams } from '@/types/consult'
import type { PositionalTitles, PriceRange } from '@/enums'
import { ref, watch } from 'vue'
import DoctorCard from './DoctorCard.vue'

const props = defineProps<{
  depId: string
  order?: DoctorOrderType
  provinceId?: string
  grade?: string
  positionalTitles?: PositionalTitles
  priceRange?: PriceRange
}>()

const list = ref<DoctorListType>([])
const loading = ref(false)
const finished = ref(false)

const params = ref<DoctorParams>({
  current: 1,
  pageSize: 10,
  provinceId: props.provinceId || '100000',
  depId: props.depId,
  order: props.order || 'default_ascend',
  grade: props.grade,
  positionalTitles: props.positionalTitles,
  priceRange: props.priceRange,
})

const onLoad = async () => {
  const res = await getFindDoctorPage(params.value)
  list.value.push(...res.data.rows)
  loading.value = false
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
}

watch(
  [
    () => props.depId,
    () => props.order,
    () => props.provinceId,
    () => props.grade,
    () => props.positionalTitles,
    () => props.priceRange,
  ],
  ([depId, order, provinceId, grade, positionalTitles, priceRange]) => {
    list.value = []
    finished.value = false
    params.value.depId = depId
    params.value.order = order || 'default_ascend'
    params.value.provinceId = provinceId || '100000'
    params.value.grade = grade
    params.value.positionalTitles = positionalTitles
    params.value.priceRange = priceRange
    params.value.current = 1
    loading.value = true
    onLoad()
  },
  { immediate: true },
)
</script>

<template>
  <div class="doctor-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <doctor-card v-for="item in list" :key="item.id" :item="item" :grade="grade" />
    </van-list>
  </div>
</template>

<style scoped lang="scss">
.doctor-list {
  padding: 15px;
  background: #fff;
}
</style>

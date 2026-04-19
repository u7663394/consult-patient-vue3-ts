<script setup lang="ts">
import { useConsultStore } from '@/stores'
import { computed, ref } from 'vue'
import MedicineAction from './components/MedicineAction.vue'
import MedicineList from './components/MedicineList.vue'

const searchValue = ref('')
const keyword = ref('')

const onSearch = () => {
  keyword.value = searchValue.value
}

const onCancel = () => {
  searchValue.value = ''
  keyword.value = ''
}

const consultStore = useConsultStore()

const totalPrice = computed(() => {
  const total =
    consultStore.consult.medicines?.reduce((sum, item) => sum + +item.amount * +item.quantity, 0) || 0
  return total.toFixed(2)
})

const cartLength = computed(() => consultStore.consult.medicines?.length || 0)
</script>

<template>
  <div class="consult-choose-page">
    <cp-nav-bar title="选择药品" />
    <van-search
      v-model="searchValue"
      show-action
      placeholder="搜一搜: 药品名称"
      @search="onSearch"
      @cancel="onCancel"
    />
    <medicine-list :keyword="keyword" />
    <medicine-action />
    <div class="sr-only">已选{{ cartLength }}件，合计{{ totalPrice }}</div>
  </div>
</template>

<style scoped lang="scss">
.consult-choose-page {
  padding-top: 46px;
  .van-search {
    position: sticky;
    top: 46px;
    z-index: 10;
    background-color: #fff;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

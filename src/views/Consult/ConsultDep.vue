<script setup lang="ts">
import { getAllDep } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { TopDep } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
const active = ref(0) // 当前选中项的索引
const consultStore = useConsultStore() // store 实例

/**
 * 获取并渲染科室列表
 *   1. 空数组
 *   2. 发请求
 *   3. 赋值 + 渲染
 */
const allDep = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDep()
  allDep.value = res.data
})

/**
 * 根据 active 的值，渲染对应的二级科室列表
 */
const subDep = computed(() => {
  return allDep.value[active.value]?.child || []
})
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!-- 
       侧边栏组件: 
         1. van-sidebar-item: 每个选项
         2. v-model: 当前选中项的索引 
      -->
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="dep in allDep" :key="dep.id" :title="dep.name" />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          @click="consultStore.setDep(sub.id)"
          to="/consult/illness"
          v-for="sub in subDep"
          :key="sub.id"
        >
          {{ sub.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>

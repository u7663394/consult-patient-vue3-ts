<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const showPopover = ref(false)
const actions = computed(() => [
  { text: '查看处方', disabled: props.disabled },
  { text: '删除订单' },
])

const emit = defineEmits<{
  (e: 'on-delete'): void
  (e: 'on-preview'): void
}>()

const onSelect = (_: unknown, i: number) => {
  if (i === 0) emit('on-preview')
  if (i === 1) emit('on-delete')
}
</script>

<template>
  <div class="consult-more">
    <!-- 
     气泡弹出框组件:
       1. placement: 弹出框位置
       2. v-model:show: 控制弹出框显示隐藏
       3. :actions: 弹出框选项列表
       4. @select: 选项被点击时触发的事件
    -->
    <van-popover
      placement="top-start"
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>

<style lang="scss" scoped>
.consult-more {
  flex: 1;
  color: var(--cp-tag);
  font-size: 13px;
}
</style>

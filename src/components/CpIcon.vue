<script setup lang="ts">
/**
 * 通过 props 传入图标名称，使用 <use> 标签引用 svg 图标
 * 例: <CpIcon name="home" /> 会引用 id 为 "icon-home
 */
defineProps<{
  name: string
}>()
</script>

<template>
  <svg aria-hidden="true" class="cp-icon">
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<style lang="scss" scoped>
.cp-icon {
  // 和字体一样大
  width: 1em;
  height: 1em;
}
</style>

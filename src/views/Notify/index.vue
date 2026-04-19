<script setup lang="ts">
import { request } from '@/utils/request'

/**
 * Mock 模拟接口
 */
request('http://localhost/patient/message/sys/list').then((res) => {
  console.log(res)
})
</script>

<template>
  <div class="notify-page">notify</div>
</template>

<style lang="scss" scoped></style>

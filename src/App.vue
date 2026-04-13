<script setup lang="ts">
import { Button as VantButton } from 'vant'
</script>

<template>
  <vant-button type="primary">主要按钮</vant-button>
  <div class="main">我是 main 区域</div>
  <div class="footer">我是 footer 区域</div>
</template>

<style scoped>
.main {
  background-color: var(--cp-primary);
}

.footer {
  background-color: var(--footer-color);
}
</style>

<script setup lang="ts">
const handleClickRight = () => {
  // 跳转到注册页面
  console.log('to register page')
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar @click-right="handleClickRight" title="登录" right-text="注册"></cp-nav-bar>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { Button as VantButton } from 'vant'
import { useUserStore } from './stores'

const userStore = useUserStore()
const onLogin = () => {
  userStore.setUser({
    id: '1',
    account: '张三',
    mobile: '12345678901',
    avatar: 'demo.png',
    token: 'abc123}',
  })
}
const onLogout = () => {
  userStore.delUser()
}
</script>

<template>
  <div>用户信息: {{ userStore.user }}</div>
  <vant-button type="primary" @click="onLogin">模拟登陆</vant-button>
  <vant-button type="danger" @click="onLogout">模拟退出</vant-button>
</template>

<style scoped></style>

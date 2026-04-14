<script setup lang="ts">
import { Button as VantButton } from 'vant'
import { useUserStore } from './stores'
import { request } from './utils/request'

const userStore = useUserStore()
const onLogin = async () => {
  const res = await request('login/password', 'post', {
    mobile: '13811111111',
    password: '123441123',
  })
  userStore.setUser(res.data)
}

const onLogout = () => {
  userStore.delUser()
}

const getUser = async () => {
  await request('patient/myUser', 'get')
}
</script>

<template>
  <div>用户信息: {{ userStore.user }}</div>
  <vant-button type="primary" @click="onLogin">模拟登陆</vant-button>
  <vant-button type="danger" @click="onLogout">模拟退出</vant-button>
  <vant-button type="primary" @click="getUser">获取用户信息</vant-button>
</template>

<style scoped></style>

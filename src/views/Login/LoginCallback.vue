<script setup lang="ts">
/* global QC */
import { loginByQQ } from '@/services/user'
import { onMounted, ref } from 'vue'

/**
 * 支持 QQ 登录
 */
const openId = ref('')
const isNeedBind = ref(true) // 是否需要绑定手机号
onMounted(() => {
  if (QC.Login.check()) {
    QC.Login.getMe((id: string) => {
      openId.value = id
      loginByQQ(id)
        .then((res) => {
          // 登录成功
          console.log(res)
          isNeedBind.value = false
        })
        .catch(() => {
          // 登录失败
          isNeedBind.value = true
        })
    })
  }
})
</script>

<template>
  <div class="login-page" v-if="isNeedBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form">
      <van-field name="mobile" placeholder="请输入手机号"></van-field>
      <van-field name="code" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send">发送验证码</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button style="margin-top: 50px" block round type="primary" native-type="submit">
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>

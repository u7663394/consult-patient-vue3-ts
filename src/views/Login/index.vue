<script setup lang="ts">
import { useSendMobileCode } from '@/composables'
import { loginByPassword, loginByMobile } from '@/services/user'
import { useUserStore } from '@/stores'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showSuccessToast, showToast } from 'vant'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
/**
 * 使用密码登录 / 短信验证码登陆
 *   1. 判断是否同意协议
 *   2. 登录逻辑
 */
const mobile = ref('13230000007')
const password = ref('abc12345')
const code = ref('')
const isPassword = ref(true)
const agree = ref(false)
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const onSubmit = async () => {
  // 1. 判断是否同意协议
  if (!agree.value) return showToast('请同意用户协议和隐私条款')
  // 2. 登录逻辑
  const res = isPassword.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  // 2.1. 存储用户信息
  userStore.setUser(res.data)
  // 2.2. 提示登录成功
  showSuccessToast('登录成功')
  // 2.3. 有 returnUrl 就跳转到 returnUrl, 没有就跳转到用户页
  router.replace((route.query.returnUrl as string) || '/user')
}

/**
 * 发送短信验证码
 *   1. 发送前验证
 *   2. 发送验证码
 *   3. 倒计时
 */

const { form, time, onSend } = useSendMobileCode(mobile, 'login')

/**
 * 切换密码可见功能
 */
const show = ref(false)

/**
 * QQ 登录
 */
const qqUrl = `https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=${encodeURIComponent(import.meta.env.VITE_APP_CALLBACK + '/login/callback')}`
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      title="登录"
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPassword ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPassword = !isPassword">
        <span>{{ isPassword ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="onSubmit" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPassword"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon> </template
      ></van-field>
      <van-field v-else placeholder="短信验证码" v-model="code" :rules="codeRules">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="onSend">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <!-- 
         1. native-type="submit": 设置 button 组件为原生 submit 类型按钮。
         2. 在 van-form 中即可监听 submit 事件处理提交逻辑。
         3. van-form 会自动触发整体表单校验, 无需手动调用校验方法
        -->
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <a class="icon" :href="qqUrl">
        <img src="@/assets/qq.svg" alt="" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>

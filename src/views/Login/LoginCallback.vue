<script setup lang="ts">
/* global QC */
import { useSendMobileCode } from '@/composables'
import { bindMobile, loginByQQ } from '@/services/user'
import { useUserStore } from '@/stores'
import type { User } from '@/types/user'
import { codeRules, mobileRules } from '@/utils/rules'
import { showSuccessToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

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
          loginSuccess(res)
          isNeedBind.value = false
        })
        .catch(() => {
          // 登录失败
          isNeedBind.value = true
        })
    })
  }
})

/**
 * 校验表单 + 发送验证码
 */
const mobile = ref('')
const code = ref()

const { form, time, onSend } = useSendMobileCode(mobile, 'bindMobile')

/**
 * 绑定手机号
 *   1. 调用接口绑定手机号
 *   2. 登录成功逻辑
 */
const userStore = useUserStore()
const router = useRouter()

const bind = async () => {
  // 1. 调用接口
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value,
  })
  // 2. 登录成功逻辑
  loginSuccess(res)
}

const loginSuccess = (res: { data: User }) => {
  userStore.setUser(res.data)
  router.replace('/user')
  showSuccessToast('登录成功')
}
</script>

<template>
  <div class="login-page" v-if="isNeedBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      ></van-field>
      <van-field v-model="code" name="code" placeholder="请输入验证码" :rules="codeRules">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="onSend">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
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

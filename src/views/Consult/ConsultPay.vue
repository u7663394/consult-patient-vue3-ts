<script setup lang="ts">
import { createConsultOrder, getConsultOrderPayUrl, getConsultOrderPre } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData, PartialConsult } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showDialog, showLoadingToast, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

/**
 * 获取预支付信息
 *   1. 定义空变量
 *   2. 发请求
 *   3. 赋值 + 渲染
 */
const consultStore = useConsultStore()
// 定义空变量
const payInfo = ref<ConsultOrderPreData>()
// 发请求
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: consultStore.consult.type,
    illnessType: consultStore.consult.illnessType,
  })
  // 赋值
  payInfo.value = res.data
  // 记录优惠券 ID
  consultStore.setCoupon(res.data.couponId)
}
loadData()

/**
 * 获取患者信息
 *   1. 定义空变量
 *   2. 发请求
 *   3. 赋值 + 渲染
 */
const patient = ref<Patient>()
const loadPatient = async () => {
  const res = await getPatientDetail(consultStore.consult.patientId!)
  patient.value = res.data
}
loadPatient()

/**
 * 生成订单
 *   1. 判断是否同意协议
 *   2. 发送生成订单请求
 *   3. 接受订单 ID
 *   4. 清理 consultStore
 *   5. 显示支付面板
 */
const agree = ref(false)
const show = ref(false)
const paymentMethod = ref<0 | 1>(1) // 0 微信支付，1 支付宝支付
const loading = ref<boolean>(false)
const orderId = ref<string>('') // 订单 ID
const onSubmit = async () => {
  // 1. 判断是否同意协议
  if (!agree.value) return showToast('请同意支付协议')
  // 2. 发送生成订单请求
  loading.value = true
  const res = await createConsultOrder(consultStore.consult)
  // 3. 接受订单 ID
  orderId.value = res.data.id
  loading.value = false
  // 4. 清理 consultStore
  consultStore.clear()
  // 5. 显示支付面板
  show.value = true
}

/**
 * 用户引导:
 *   1. 生成订单后不可回退
 *   2. 生成订单后不可关闭支付抽屉
 *   3. 生成订单接口所需参数不足时提示
 */
onBeforeRouteLeave(() => {
  // 1. 生成订单后不可回退
  if (orderId.value) {
    return false
  }
})
// 2. 生成订单后不可关闭支付抽屉
const router = useRouter()
const onClose = async () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭?',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
  })
    .then(() => {
      return false
    })
    .catch(() => {
      // 关闭离开
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
// 3. 生成订单接口所需参数不足时提示
type Key = keyof PartialConsult
onMounted(() => {
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId',
  ]
  // 所有值都不是 undefined 才 return true
  const valid = validKeys.every((key) => {
    return consultStore.consult[key] !== undefined
  })
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付!',
      closeOnPopstate: false,
    }).then(() => {
      router.push('/')
    })
  }
})

/**
 * 支付功能:
 *   1. 先校验是否选择支付方式
 *   2. 显示 loading toast
 *   3. 调用支付接口
 *   4. 成功则跳转支付链接
 *
 * 测试账号: scobys4865@sandbox.com
 * 登录密码：111111
 * 支付密码：111111
 */
const onPay = async () => {
  // 0. 测试用: 若由于网路问题, 可强行跳转到 room 页面
  // return (window.location.href = 'http://localhost:5173/room?orderId=7276410060488704&payResult=true&type=2')
  // 1. 校验
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  // 2. 显示 loading toast
  showLoadingToast({
    message: '跳转支付', // 提示信息
    duration: 0, // 显示时间, 0 表示一直显示
  })
  // 3. 调用支付接口
  const res = await getConsultOrderPayUrl({
    orderId: orderId.value,
    paymentMethod: paymentMethod.value,
    payCallback: 'http://localhost:5173/room',
  })
  // 4. 成功则跳转支付链接
  window.location.href = res.data.payUrl
}
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <!-- 
     van-cell-group: 
       1. 每个 cell 为一行
       2. title 为标题
       3. value 为内容
    -->
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="consultStore.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 
     van-submit-bar: 
       1. :price 价格，单位为分
       2. button-text 按钮文本
       3. text-align 文本对齐方式
    -->
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="onSubmit"
      :loading="loading"
    />
    <!-- 
     动作面板:
       1. v-model:show 控制显示隐藏
       2. title 标题
       3. :close-on-popstate 是否允许通过浏览器返回按钮关闭
       4. :closeable 是否显示关闭按钮
       5. :before-close 关闭前的回调函数, 返回 false 阻止关闭, 返回 true 允许关闭
    -->
    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      :before-close="onClose"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button @click="onPay" type="primary" round block>立即支付</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
  <div v-else class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <!-- 
     骨架屏: 
       1. title 标题
       2. row 显示内容行数
    -->
    <van-skeleton title :row="10" style="margin-top: 10px" />
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>

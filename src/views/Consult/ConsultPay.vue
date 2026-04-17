<script setup lang="ts">
import { getConsultOrderPre } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { ref } from 'vue'
const agree = ref(false)

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
    />
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

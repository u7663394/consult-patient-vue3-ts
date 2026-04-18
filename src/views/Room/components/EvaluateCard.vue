<script setup lang="ts">
import { evaluateConsultOrder } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import type { EvaluateDoc } from '@/types/room'
import { showToast } from 'vant'
import { computed, inject, ref, type Ref } from 'vue'

defineProps<{
  evalState?: EvaluateDoc
}>()

/**
 * 绑定表单数据
 */
const score = ref<number>(0)
const content = ref<string>('')
const isAnonymous = ref<boolean>(false)
const disabled = computed(() => {
  return !score.value || !content.value.trim()
})

/**
 * 提交评价
 *   1. 校验
 *   2. 调用接口提交
 *   3. 修改卡片状态
 */
const consult = inject<Ref<ConsultOrderItem>>('consult')
const completeEva = inject<(score: number) => void>('completeEva')
const onSubmit = async () => {
  // 1. 校验
  if (!score.value) return showToast('请打分')
  if (!content.value.trim()) return showToast('请填写评价内容')
  // 2. 调用接口提交
  await evaluateConsultOrder({
    docId: consult?.value.docInfo?.id!,
    orderId: consult?.value.id!,
    score: score.value,
    content: content.value.trim(),
    anonymousFlag: isAnonymous.value ? 1 : 0,
  })
  // 3. 修改卡片状态
  completeEva!(score.value)
  showToast('评价提交成功')
}
</script>

<template>
  <!-- 已评价 -->
  <div class="evaluate-card" v-if="evalState">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evalState.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>
  <!-- 待评价 -->
  <div class="evaluate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
      v-model="score"
    />
    <van-field
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
      v-model="content"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="isAnonymous">匿名评价</van-checkbox>
      <van-button
        type="primary"
        size="small"
        round
        :class="{ disabled: disabled }"
        @click="onSubmit"
      >
        提交评价
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.evaluate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;
  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }
  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    :deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }
        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }
        height: 16px;
      }
      .van-button {
        padding: 0 16px;
        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import { uploadImage } from '@/services/consult'
import type { Image } from '@/types/consult'
import { showLoadingToast, type UploaderAfterRead } from 'vant'
import { ref } from 'vue'

defineProps<{
  disabled: boolean
}>()

/**
 * 发送文字消息
 *   1. 回车发送
 *   2. 清空输入框
 */
const text = ref<string>('')
const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', img: Image): void
}>()
// 1. 回车发送
const sendText = () => {
  if (!text.value.trim()) return
  emit('send-text', text.value)
  // 2. 清空输入框
  text.value = ''
}

/**
 * 发送图片消息
 */
const sendImage: UploaderAfterRead = async (data) => {
  if (Array.isArray(data) || !data.file) return
  const t = showLoadingToast({ message: '图片上传中...', duration: 0 })
  const res = await uploadImage(data.file)
  t.close()
  emit('send-image', res.data)
}
</script>

<template>
  <div class="room-action">
    <van-field
      v-model="text"
      @keyup.enter="sendText"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      :disabled="disabled"
    ></van-field>
    <van-uploader :after-read="sendImage" :preview-image="false" :disabled="disabled">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>

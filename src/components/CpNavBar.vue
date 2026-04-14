<script setup lang="ts">
import { useRouter } from 'vue-router'

/**
 * props 传入 title 标题 和 rightText 右侧文字
 */
const props = defineProps<{
  title?: string
  rightText?: string
}>()

/**
 * 右侧文字功能
 *
 * 注意:
 *   由于每个组件右侧功能不同，所以通过 emit 将事件传递给父组件
 *   由父组件来处理具体的逻辑
 */
const emit = defineEmits<{
  (event: 'click-right'): void
}>()

const onClickRight = () => {
  emit('click-right')
}

/**
 * 左侧返回功能:
 *   1. 如果有 history 就返回上一页
 *   2. 如果没有 history 就返回首页
 */
const router = useRouter()
const onClickLeft = () => {
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <!-- 
   导航栏: 
      1. fixed: 固定在顶部
      2. left-arrow: 左侧返回箭头
      3. title: 标题
      4. right-text: 右侧文字按钮
      5. @click-left: 点击左侧箭头事件
      6. @click-right: 点击右侧文字事件
  -->
  <van-nav-bar
    fixed
    left-arrow
    :title="props.title"
    :right-text="props.rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
// 深度作用 :deep(){ ... } 用于覆盖第三方组件的样式
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>

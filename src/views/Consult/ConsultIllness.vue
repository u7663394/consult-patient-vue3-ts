<script setup lang="ts">
import { IllnessTime } from '@/enums'
import { useConsultStore } from '@/stores'
import type { ConsultIllness, Image } from '@/types/consult'
import { showConfirmDialog, showToast, type UploaderFileListItem } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 选项数据
 */
const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More },
]

const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '没就诊过', value: 0 },
]

/**
 * 表单数据
 */
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: [],
})

const cpUploadRef = ref<{ setFileList: (val: Image[]) => void }>()
const onUploadSuccess = (image: Image) => {
  form.value.pictures?.push(image)
}
const onDeleteImg = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter((pic) => {
    return pic.url !== item.url
  })
}

/**
 * 下一步按钮
 *   1. 按钮 disabled 状态: 没有 desc | time | flag 就禁用
 *   2. 点击事件: 校验 + 存储 + 跳转
 */
const consultStore = useConsultStore()
const router = useRouter()
// 1. 按钮状态
const disabled = computed(() => {
  return (
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
  )
})
// 2. 点击
const next = () => {
  // 2.1. 校验
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.illnessTime === undefined) return showToast('请选择患病时间')
  if (form.value.consultFlag === undefined) return showToast('请选择是否就诊过')
  // 2.2. 存储
  consultStore.setIllness(form.value)
  // 2.3. 跳转
  router.push('/user/patient?isChange=1')
}

/**
 * 有数据时回显
 */
onMounted(() => {
  if (consultStore.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢?',
      closeOnPopstate: false, // 回退时也显示弹窗
    }).then(() => {
      // 回显数据
      const { illnessDesc, illnessTime, consultFlag, pictures } = consultStore.consult
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      cpUploadRef.value?.setFileList(pictures || [])
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 收集信息 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="timeOptions" v-model="form.illnessTime"></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="flagOptions" v-model="form.consultFlag"></cp-radio-btn>
      </div>
      <cp-upload
        ref="cpUploadRef"
        @upload-success="onUploadSuccess"
        @delete-success="onDeleteImg"
      />
      <van-button :class="{ disabled }" @click="next" type="primary" block round>下一步</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>

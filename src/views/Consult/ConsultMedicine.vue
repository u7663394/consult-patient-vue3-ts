<script setup lang="ts">
import {
  allergicHistoryOptions,
  fertilityStatusOptions,
  liverFunctionOptions,
  renalFunctionOptions,
} from '@/services/constant'
import { useConsultStore } from '@/stores'
import type { Image, MedicineIllness } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast, type UploaderFileListItem } from 'vant'

const consultStore = useConsultStore()
const router = useRouter()

const form = ref<MedicineIllness>({
  illnessDesc: '',
  liverFunction: undefined,
  renalFunction: undefined,
  allergicHistory: undefined,
  fertilityStatus: undefined,
  pictures: [],
})

const disabled = computed(
  () =>
    !form.value.illnessDesc ||
    form.value.liverFunction === undefined ||
    form.value.renalFunction === undefined ||
    form.value.allergicHistory === undefined ||
    form.value.fertilityStatus === undefined,
)

const cpUploadRef = ref<{ setFileList: (val: Image[]) => void }>()

const onUploadSuccess = (image: Image) => {
  form.value.pictures?.push(image)
}

const onDeleteSuccess = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter((pic) => pic.url !== item.url)
}

const next = () => {
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.liverFunction === undefined) return showToast('请选择肝功能情况')
  if (form.value.renalFunction === undefined) return showToast('请选择肾功能情况')
  if (form.value.allergicHistory === undefined) return showToast('请选择过敏史情况')
  if (form.value.fertilityStatus === undefined) return showToast('请选择生育状态及计划')

  consultStore.setMedicineIllness(form.value)
  router.push('/user/patient?isChange=1&from=medicineConsult')
}

onMounted(() => {
  if (consultStore.consult.liverFunction === undefined || !consultStore.consult.illnessDesc) return
  showConfirmDialog({
    title: '温馨提示',
    message: '是否恢复您之前填写的开药信息呢?',
    closeOnPopstate: false,
  }).then(() => {
    const {
      illnessDesc,
      liverFunction,
      renalFunction,
      allergicHistory,
      fertilityStatus,
      pictures,
    } = consultStore.consult

    form.value = {
      illnessDesc,
      liverFunction,
      renalFunction,
      allergicHistory,
      fertilityStatus,
      pictures,
    }
    cpUploadRef.value?.setFileList(pictures || [])
  })
})
</script>

<template>
  <div class="consult-medicine-page">
    <cp-nav-bar
      title="开药门诊"
      right-text="问诊记录"
      @click-right="$router.push('/user/consult')"
    />
    <van-notice-bar text="请如实填写资料以便医生了解您的病情和用药需求" />
    <div class="illness-form">
      <div class="adm-list-header">症状描述</div>
      <van-field v-model="form.illnessDesc" type="textarea" rows="3" placeholder="请输入所患疾病名称" />
      <div class="adm-list-header">用药人身体情况</div>
      <div class="item">
        <p>肝功能</p>
        <cp-radio-btn v-model="form.liverFunction" :options="liverFunctionOptions" />
      </div>
      <div class="item">
        <p>肾功能</p>
        <cp-radio-btn v-model="form.renalFunction" :options="renalFunctionOptions" />
      </div>
      <div class="item">
        <p>过敏史</p>
        <cp-radio-btn v-model="form.allergicHistory" :options="allergicHistoryOptions" />
      </div>
      <div class="item">
        <p>生育状态及计划</p>
        <cp-radio-btn v-model="form.fertilityStatus" :options="fertilityStatusOptions" />
      </div>
      <div class="adm-list-header">补充病例信息</div>
      <cp-upload
        ref="cpUploadRef"
        @upload-success="onUploadSuccess"
        @delete-success="onDeleteSuccess"
      />
      <van-button :class="{ disabled }" type="primary" block round @click="next">下一步</van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.consult-medicine-page {
  padding-top: 46px;
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
  .illness-form {
    padding: 0 15px 15px;
    .adm-list-header {
      padding-bottom: 5px;
      font-size: 16px;
      font-weight: 500;
      color: #121826;
      margin-top: 30px;
    }
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
}
</style>

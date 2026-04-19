<script setup lang="ts">
import { uploadImage } from '@/services/consult'
import type { Image } from '@/types/consult'
import type { UploaderAfterRead, UploaderFileListItem } from 'vant'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'uploadSuccess', img: Image): void
  (e: 'deleteSuccess', item: UploaderFileListItem): void
}>()

const fileList = ref<Image[]>([])

const onAfterRead: UploaderAfterRead = (item) => {
  if (Array.isArray(item) || !item.file) return
  item.status = 'uploading'
  item.message = '上传中...'
  uploadImage(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = undefined
      item.url = res.data.url
      emit('uploadSuccess', res.data)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}

const onDeleteImg = (item: UploaderFileListItem) => {
  emit('deleteSuccess', item)
}

const setFileList = (val: Image[]) => {
  fileList.value = val
}

defineExpose({
  setFileList,
})
</script>

<template>
  <div class="illness-img">
    <van-uploader
      v-model="fileList"
      upload-icon="photo-o"
      upload-text="上传图片"
      max-count="9"
      :max-size="5 * 1024 * 1024"
      :after-read="onAfterRead"
      @delete="onDeleteImg"
    />
    <p v-if="!fileList.length" class="tip">上传内容仅医生可见,最多9张图,最大5MB</p>
  </div>
</template>

<style scoped lang="scss">
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
</style>

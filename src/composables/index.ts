// 利用组合式 API, 实现业务逻辑复用
import { ref } from 'vue'
import { followOrUnfollow, getPrescriptionPic } from '@/services/consult'
import type { FollowType } from '@/types/consult'
import { showImagePreview } from 'vant'

/**
 * 关注或取消关注
 *   1. loading 状态控制按钮状态, 防止重复点击
 *   2. 调用接口
 *   3. 切换 likeFlag 的值
 */
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      // 调用接口
      await followOrUnfollow(item.id, type)
      // 切换 likeFlag 的值
      if (item.likeFlag === 1) {
        item.likeFlag = 0
      } else {
        item.likeFlag = 1
      }
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

/**
 * 查看处方详情
 */
export const useShowPrescription = () => {
  const showPrescription = async (id?: string) => {
    if (!id) return
    const res = await getPrescriptionPic(id)
    showImagePreview([res.data.url])
  }
  return { showPrescription }
}

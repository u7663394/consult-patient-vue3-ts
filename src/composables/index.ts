// 利用组合式 API, 实现业务逻辑复用
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { cancelOrder, deleteOrder, followOrUnfollow, getPrescriptionPic } from '@/services/consult'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import {
  showFailToast,
  showImagePreview,
  showSuccessToast,
  showToast,
  type FormInstance,
} from 'vant'
import { OrderType } from '@/enums'
import type { OrderDetail } from '@/types/order'
import { getMedicalOrderDetail } from '@/services/order'
import type { CodeType } from '@/types/user'
import { sendMobileCode } from '@/services/user'

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

/**
 * 取消订单
 *   1. 调接口
 *   2. 成功后修改订单状态
 */
export const useCancelOrder = () => {
  const loading = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      // 1. 调接口
      await cancelOrder(item.id)
      // 2. 成功后修改订单状态
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showSuccessToast('取消成功')
    } catch (err) {
      console.log(err)
      showFailToast('取消失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, cancelConsultOrder }
}

/**
 * 删除订单
 *   1. 调接口
 *   2. callback 替代原本的 emit
 *
 * 原因:
 *  此处没有 emit, 只能通过参数传入一个 callback 来通知父组件
 */
export const useDeleteOrder = (cb: () => void) => {
  const deleteLoading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    try {
      deleteLoading.value = true
      // 1. 调接口
      await deleteOrder(item.id)
      showSuccessToast('删除成功')
      // 2. 成功后通知父组件
      cb && cb()
    } catch (err) {
      console.log(err)
      showFailToast('删除失败')
    } finally {
      deleteLoading.value = false
    }
  }
  return { deleteLoading, deleteConsultOrder }
}

/**
 * 获取订单支付结果信息并渲染
 */
export const useOrderDetail = (id: string) => {
  const loading = ref(false)
  const order = ref<OrderDetail>()
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}

/**
 * 发送短信验证码
 *   1. 发送前验证
 *   2. 发送验证码
 *   3. 倒计时
 */
export const useSendMobileCode = (mobile: Ref<string>, type: CodeType = 'login') => {
  const time = ref(0)
  const form = ref<FormInstance>()
  let timer: number
  const onSend = async () => {
    // 1. 发送前验证: 倒计时 + 手机号校验
    if (time.value > 0) return showToast('请稍后再试')
    await form.value?.validate('mobile')
    // 2. 发送验证码逻辑
    await sendMobileCode(mobile.value, type)
    showSuccessToast('验证码发送成功')
    time.value = 60
    // 3. 倒计时
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      time.value--
      if (time.value <= 0) clearInterval(timer)
    }, 1000)
  }
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
  return { form, time, onSend }
}

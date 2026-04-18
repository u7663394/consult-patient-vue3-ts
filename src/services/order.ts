import type { OrderPre, AddressItem } from '@/types/order'
import { request } from '@/utils/request'

// 获取预支付信息
export const getMedicalOrderPre = (params: { prescriptionId: string }) => {
  return request<OrderPre>('/patient/medicine/order/pre', 'GET', params)
}

// 获取地址列表
export const getAddressList = () => {
  return request<AddressItem[]>('/patient/order/address')
}

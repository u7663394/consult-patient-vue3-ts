import type { OrderPre, AddressItem, CreateMedicalOrderParams } from '@/types/order'
import { request } from '@/utils/request'

// 获取预支付信息
export const getMedicalOrderPre = (params: { prescriptionId: string }) => {
  return request<OrderPre>('/patient/medicine/order/pre', 'GET', params)
}

// 获取地址列表
export const getAddressList = () => {
  return request<AddressItem[]>('/patient/order/address')
}

// 创建药品订单
export const createMedicalOrder = (data: CreateMedicalOrderParams) => {
  return request<{ id: string }>('/patient/medicine/order', 'POST', data)
}

import type { Medical } from './room'

// 预支付信息
export type OrderPre = {
  id: string
  couponId: string
  pointDeduction: number
  couponDeduction: number
  payment: number
  expressFee: number // 邮费
  actualPayment: number
  medicines: Medical[]
}

// 地址信息
export type AddressItem = {
  id: string
  mobile: string
  receiver: string
  province: string
  city: string
  county: string // 区
  addressDetail: string
  isDefault: 0 | 1 // 是否默认地址，0 不是 1 是
}

// 创建订单参数
export type CreateMedicalOrderParams = {
  id: string
  addressId: string
  couponId?: string
}

import type { ExpressStatus } from '@/enums'
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

/**
 * 语法: Omit<T, K>
 * 表示从类型 T 中剔除 K 中指定的属性，返回一个新的类型。
 */
type Address = Omit<AddressItem, 'isDefault'>

// 订单信息
export type OrderDetail = {
  id: string
  orderNo: string
  type: number
  createTime: string
  prescriptionId: string
  status: OrderType
  statusValue: string
  medicines: Medical[]
  countDown: number
  addressInfo: Address
  /** 物流信息 */
  expressInfo: {
    content: string
    time: string
  }
  payTime: string
  paymentMethod?: 0 | 1
  payment: number
  pointDeduction: number
  couponDeduction: number
  expressFee: number
  actualPayment: number
  roomId: string
}

// 快递状态
export type Express = {
  id: string
  content: string
  createTime: string
  status: ExpressStatus
  statusValue: string
}

// 位置
export type Location = {
  longitude: string
  latitude: string
}

// 物流信息
export type Logistics = {
  estimatedTime: string
  name: string
  awbNo: string // 物流编号
  status: ExpressStatus
  statusValue: string
  list: Express[]
  logisticsInfo: Location[] // 物流轨迹
  currentLocationInfo: Location
}

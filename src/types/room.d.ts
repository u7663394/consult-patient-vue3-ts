import { MsgType, PrescriptionStatus } from '@/enums'
import type { Consult, Image } from './consult'
import type { Patient } from './user'

// 药品信息
export type Medical = {
  id: string
  name: string
  amount: string
  avatar: string
  specs: string // 规格信息
  usageDosag: string // 用法用量
  quantity: string
  prescriptionFlag: 0 | 1 // 是否处方, 0 不是 1 是
}

// 处方信息
export type Prescription = {
  id: string
  orderId: string
  createTime: string
  name: string
  recordId: string
  gender: 0 | 1
  genderValue: ''
  age: number
  diagnosis: string // 诊断信息
  status: PrescriptionStatus
  medicines: Medical[] // 药品清单
}

// 评价信息
export type EvaluateDoc = {
  id?: string
  score?: number
  content?: string
  createTime?: string
  creator?: string
}

// 消息类型
export type Message = {
  id: string
  msgType: MsgType
  from?: string // 发信人
  fromAvatar?: string
  to?: string // 收信人
  toAvatar?: string
  createTime: string
  msg: {
    content?: string
    picture?: Image
    consultRecord?: Consult & {
      patientInfo: Patient
    }
    prescription?: Prescription // 处方信息
    evaluateDoc?: EvaluateDoc
  }
}

// 消息列表
export type TimeMessages = {
  createTime: string
  items: Message[] // 消息数组
  orderId: string
  sid: string // 会话ID
}

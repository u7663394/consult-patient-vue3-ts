import { ConsultType, IllnessTime } from '@/enums/index'

// 文章信息类型
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string // 医生科室
  creatorTitles: string // 医生职称
  creatorId: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 文章列表分页
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

// 联合类型
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

// 分页查询参数
export type PageParams = {
  current: number
  pageSize: number
}

// 文章列表查询参数
export type KnowledgeParams = PageParams & {
  type: KnowledgeType
}

// 医生卡片对象
export type Doctor = {
  id: string
  name: string
  avatar: string
  hospitalName: string
  gradeName: string // 医院等级
  depName: string // 科室
  positionalTitles: string // 职称
  likeFlag: 0 | 1
  serviceFee: number
  consultationNum: number // 接诊人数
  score: number
  major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 关注类型
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'

// 图片列表
export type Image = {
  id: string
  url: string
}

// 问诊记录
export type Consult = {
  id: string
  type: ConsultType
  illnessType: 0 | 1 // 快速问诊类型，0 普通 1 三甲
  depId: string // 科室ID
  illnessDesc: string
  illnessTime: IllnessTime
  consultFlag: 0 | 1 // 是否就诊过，0 未就诊过  1 就诊过
  pictures: Image[]
  patientId: string
  couponId: string // 优惠券ID
}

/**
 * 将 Consult 类型的所有属性变为可选的类型
 * 语法: Partial<Type>
 *
 * 补充:
 *   - Required<Type> 将 Type 中的所有属性变为必选的类型
 */
export type PartialConsult = Partial<Consult>

// 二级科室
export type SubDep = {
  id: string
  name: string
}

// 一级科室
export type TopDep = SubDep & {
  child: SubDep[]
}

/**
 * 病情描述信息
 *
 * 语法:
 * Pick<Type, Keys> 从 Type 中选择 Keys 构造出新的类型
 */
export type ConsultIllness = Pick<
  PartialConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>

// 问诊订单预支付传参
export type ConsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>

// 问诊订单预支付信息
export type ConsultOrderPreData = {
  pointDeduction: number // 积分抵扣
  couponDeduction: number // 优惠券抵扣
  couponId: string
  payment: number
  actualPayment: number
}

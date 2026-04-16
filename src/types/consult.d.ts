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

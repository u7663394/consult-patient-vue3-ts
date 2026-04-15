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

// 文章列表查询参数
export type KnowledgeParams = {
  type: KnowledgeType
  current: number
  pageSize: number
}

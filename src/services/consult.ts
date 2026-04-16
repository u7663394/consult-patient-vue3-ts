import type { DoctorPage, KnowledgePage, KnowledgeParams, PageParams } from '@/types/consult'
import { request } from '@/utils/request'

// 获取知识列表
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('/patient/home/knowledge', 'GET', params)
}

// 获取医生列表
export const getDoctorPage = (params: PageParams) => {
  return request<DoctorPage>('/home/page/doc', 'GET', params)
}

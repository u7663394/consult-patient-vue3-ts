import type {
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage,
  ConsultOrderPreData,
  ConsultOrderPreParams,
  DoctorPage,
  EvalParams,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  MedicineDetail,
  MedicinePage,
  MedicineParams,
  PageParams,
  PartialConsult,
  PayParams,
  TopDep,
} from '@/types/consult'
import { request } from '@/utils/request'

// 获取知识列表
export const getKnowledgePage = (params: KnowledgeParams) => {
  return request<KnowledgePage>('/patient/home/knowledge', 'GET', params)
}

// 获取医生列表
export const getDoctorPage = (params: PageParams) => {
  return request<DoctorPage>('/home/page/doc', 'GET', params)
}

// 获取药品分页列表
export const getMedicinePage = (params: MedicineParams) => {
  return request<MedicinePage>('/patient/medicine', 'GET', params)
}

// 获取药品详情
export const getMedicineDetail = (id: string) => {
  return request<MedicineDetail>(`/patient/medicine/${id}`)
}

// 关注或取消关注
export const followOrUnfollow = (id: string, type: FollowType = 'doc') => {
  return request('/like', 'POST', { id, type })
}

// 获取所有科室
export const getAllDep = () => {
  return request<TopDep[]>('/dep/all')
}

// 上传图片
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('/upload', 'POST', fd)
}

// 获取订单预支付信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) => {
  return request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)
}

// 生成订单
export const createConsultOrder = (data: PartialConsult) => {
  return request<{ id: string }>('/patient/consult/order', 'POST', data)
}

// 获取支付地址
export const getConsultOrderPayUrl = (params: PayParams) => {
  return request<{ payUrl: string }>('/patient/consult/pay', 'POST', params)
}

// 获取订单详情
export const getConsultOrderDetail = (orderId: string) => {
  return request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })
}

// 查看处方
export const getPrescriptionPic = (id: string) => {
  return request<{ url: string }>(`/patient/consult/prescription/${id}`)
}

// 提交评价
export const evaluateConsultOrder = (data: EvalParams) => {
  return request<{ id: string }>('/patient/order/evaluate', 'POST', data)
}

// 获取问诊记录列表
export const getConsultOrderList = (params: ConsultOrderListParams) => {
  return request<ConsultOrderPage>('/patient/consult/order/list', 'GET', params)
}

// 取消订单
export const cancelOrder = (id: string) => {
  return request(`/patient/order/cancel/${id}`, 'PUT')
}

// 删除订单
export const deleteOrder = (id: string) => {
  return request(`/patient/order/${id}`, 'DELETE')
}

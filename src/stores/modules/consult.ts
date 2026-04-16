import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 1. 总问诊信息
    const consult = ref<PartialConsult>({})
    // 2. 设置问诊类型
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    // 3. 设置问诊级别
    const setIllnessLevel = (type: 0 | 1) => {
      consult.value.illnessType = type
    }
    // 4. 记录科室
    const setDep = (depId: string) => {
      consult.value.depId = depId
    }
    // 最后 return
    return { consult, setType, setIllnessLevel, setDep }
  },
  {
    persist: true,
  },
)

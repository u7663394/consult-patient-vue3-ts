import type { ConsultType } from '@/enums'
import type { ConsultIllness, PartialConsult } from '@/types/consult'
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
    // 5. 记录病情
    const setIllness = (illness: ConsultIllness) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 最后 return
    return { consult, setType, setIllnessLevel, setDep, setIllness }
  },
  {
    persist: true,
  },
)

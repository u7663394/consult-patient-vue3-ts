import type { ConsultType } from '@/enums'
import type { ConsultIllness, MedicineIllness, PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Medical } from '@/types/room'

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
    // 5.1 记录开药门诊病情
    const setMedicineIllness = (illness: MedicineIllness) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.liverFunction = illness.liverFunction
      consult.value.renalFunction = illness.renalFunction
      consult.value.allergicHistory = illness.allergicHistory
      consult.value.fertilityStatus = illness.fertilityStatus
      consult.value.pictures = illness.pictures
    }
    // 6. 记录患者
    const setPatient = (patientId: string) => {
      consult.value.patientId = patientId
    }
    // 6.1 记录药品
    const setMedicines = (medicines: Medical[]) => {
      consult.value.medicines = medicines
    }
    // 7. 记录优惠券
    const setCoupon = (couponId: string) => {
      consult.value.couponId = couponId
    }
    // 8. 清空信息
    const clear = () => {
      consult.value = {}
    }
    // 最后 return
    return {
      consult,
      setType,
      setIllnessLevel,
      setDep,
      setIllness,
      setMedicineIllness,
      setPatient,
      setMedicines,
      setCoupon,
      clear,
    }
  },
  {
    persist: true,
  },
)

import type {
  AllergicHistory,
  FertilityStatus,
  IllnessTime,
  LiverFunction,
  RenalFunction,
} from '@/enums'
import {
  allergicHistoryOptions,
  fertilityStatusOptions,
  flagOptions,
  liverFunctionOptions,
  renalFunctionOptions,
  timeOptions,
} from '@/services/constant'

/**
 * 获取患病时间与是否就诊文本
 */
export const getIllnessTimeText = (time: IllnessTime) => {
  const text = timeOptions.find((ele) => ele.value === time)?.label
  return text
}

export const getConsultFlagText = (flag: number) => {
  const text = flagOptions.find((ele) => ele.value === flag)?.label
  return text
}

export const getLiverFunctionText = (val: LiverFunction) => {
  return liverFunctionOptions.find((item) => item.value === val)?.label
}

export const getAllergicHistoryText = (val: AllergicHistory) => {
  return allergicHistoryOptions.find((item) => item.value === val)?.label
}

export const getFertilityStatusText = (val: FertilityStatus) => {
  return fertilityStatusOptions.find((item) => item.value === val)?.label
}

export const getRenalFunctionText = (val: RenalFunction) => {
  return renalFunctionOptions.find((item) => item.value === val)?.label
}

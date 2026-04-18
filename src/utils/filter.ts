import type { IllnessTime } from '@/enums'
import { flagOptions, timeOptions } from '@/services/constant'

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

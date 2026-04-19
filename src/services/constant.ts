import {
  AllergicHistory,
  FertilityStatus,
  IllnessTime,
  LiverFunction,
  PositionalTitles,
  PriceRange,
  RenalFunction,
} from '@/enums'

export const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More },
]

export const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '没就诊过', value: 0 },
]

export const liverFunctionOptions = [
  { label: '正常', value: LiverFunction.Normal },
  { label: '异常', value: LiverFunction.Abnormal },
  { label: '不清楚', value: LiverFunction.Unclear },
]

export const renalFunctionOptions = [
  { label: '正常', value: RenalFunction.Normal },
  { label: '异常', value: RenalFunction.Abnormal },
  { label: '不清楚', value: RenalFunction.Unclear },
]

export const allergicHistoryOptions = [
  { label: '正常', value: AllergicHistory.Normal },
  { label: '异常', value: AllergicHistory.Abnormal },
  { label: '不清楚', value: AllergicHistory.Unclear },
]

export const fertilityStatusOptions = [
  { label: '无', value: FertilityStatus.No },
  { label: '备孕中', value: FertilityStatus.TryingToConceive },
  { label: '已怀孕', value: FertilityStatus.AlreadyPregnant },
  { label: '哺乳期中', value: FertilityStatus.Breastfeeding },
]

export const gradeOptions = [{ label: '三级甲等', value: '9' }]

export const positionalTitlesOptions = [
  { label: '主任医师', value: PositionalTitles.ChiefPhysician },
  { label: '副主任医师', value: PositionalTitles.AssociateChiefPhysician },
  { label: '主治医师', value: PositionalTitles.AttendingPhysician },
  { label: '医师', value: PositionalTitles.Physician },
]

export const priceRangeOptions = [
  { label: '0-19', value: PriceRange.ZeroToNineteen },
  { label: '20-49', value: PriceRange.TwentyToFortyNine },
  { label: '50-79', value: PriceRange.FiftyToSeventyNine },
  { label: '80以上', value: PriceRange.MoreThanEighty },
]

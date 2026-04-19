import { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'

type Key = keyof PartialConsult

const commonKeys: Key[] = ['type', 'illnessDesc', 'patientId', 'pictures']

const fastKeys: Key[] = [...commonKeys, 'depId', 'illnessTime', 'consultFlag']

const medicineKeys: Key[] = [
  ...commonKeys,
  'allergicHistory',
  'fertilityStatus',
  'liverFunction',
  'renalFunction',
  'medicines',
]

export const getCreateOrderParams = (
  consult: PartialConsult,
  type: ConsultType = ConsultType.Fast,
): PartialConsult => {
  const params: PartialConsult = {}

  switch (type) {
    case ConsultType.Fast:
      fastKeys.forEach((key) => {
        params[key] = consult[key]
      })
      break
    case ConsultType.Medication:
      medicineKeys.forEach((key) => {
        params[key] = consult[key]
      })
      break
    case ConsultType.Doctor:
      break
  }

  return params
}

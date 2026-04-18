// 问诊类型
export enum ConsultType {
  Doctor = 1, // 找医生
  Fast = 2, // 快速问诊
  Medication = 3, // 开药问诊
}

// 问诊时间
export enum IllnessTime {
  Week = 1,
  Month, // 2
  HalfYear, // 3
  More, // 4
}

// 消息类型
export enum MsgType {
  MsgText = 1,
  MsgImage = 4,
  CardPat = 21, // 患者信息
  CardPre = 22, // 处方信息
  CardEvaForm = 23, // 未评价信息
  CardEva = 24, // 已评价信息
  Notify = 31, // 通用通知
  NotifyTip = 32,
  NotifyCancel = 33,
}

// 处方状态
export enum PrescriptionStatus {
  NotPayment = 1,
  Payment = 2,
  Invalid = 3,
}

// 订单状态
export enum OrderType {
  ConsultPay = 1, // 待支付
  ConsultWait = 2, // 待接诊
  ConsultChat = 3, // 问诊中
  ConsultComplete = 4,
  ConsultCancel = 5,
  MedicinePay = 10,
  MedicineSend = 11, // 待发货
  MedicineTake = 12, // 待收货
  MedicineComplete = 13,
  MedicineCancel = 14,
}

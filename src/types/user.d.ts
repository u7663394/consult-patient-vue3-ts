// 用户类型
export type User = {
  token: string
  id: string
  account: string // 用户名
  mobile: string // 手机号
  avatar: string
}

// 验证码联合类型
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

// Omit: 从 User 类型中剔除 token 属性，得到 OmitUser 类型
type OmitUser = Omit<User, 'token'>
// 用户信息类型
export type UserInfo = OmitUser & {
  likeNumber: number // 点赞
  collectionNumber: number // 收藏
  score: number // 积分
  couponNumber: number // 优惠券
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

// 患者信息
export type Patient = {
  id: string
  name: string
  idCard: string // 身份证
  defaultFlag: 0 | 1 // 是否默认
  gender: 0 | 1
  genderValue: string // 性别值
  age: number
}

// 患者信息列表
export type PatientList = Patient[]

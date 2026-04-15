export type User = {
  token: string
  id: string
  account: string // 用户名
  mobile: string // 手机号
  avatar: string
}

// 验证码联合类型
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

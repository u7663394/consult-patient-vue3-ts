import type { FieldRule } from 'vant'

// 提取表单校验规则: 为了其他页面复用
const mobileRules: FieldRule[] = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'onBlur' },
]

const passwordRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需8-24个字符', trigger: 'onBlur' },
]

export { mobileRules, passwordRules }

import { IllnessTime } from '@/enums'
import { test, expect } from 'vitest'
import { getConsultFlagText, getIllnessTimeText } from '../filter'

/**
 * 测试 getIllnessTimeText 函数
 *
 * 语法: test(name, fn, timeout)
 *   1. name: 测试用例的名称 / 描述测试的目的
 *   2. fn: 一个函数，包含了测试的代码
 *   3. timeout: 可选参数，指定测试的超时时间，单位为毫秒
 */
test('测试 getIllnessTimeText 函数', () => {
  // 测试函数的输入是否可以达到预期的输出
  const text = getIllnessTimeText(IllnessTime.Month)
  expect(text).toBe('一月内')
  const text2 = getIllnessTimeText(IllnessTime.Week)
  expect(text2).toBe('一周内')
})

/**
 * 测试 getConsultFlagText 函数
 *
 * 语法:
 *   1. expect(output): 创建一个断言对象，output 是要测试的值
 *   2. toBe(expected): 匹配器方法，验证 output 是否严格等于 expected
 */
test('测试 getConsultFlagText 函数', () => {
  const text = getConsultFlagText(0)
  expect(text).toBe('就诊过')
})

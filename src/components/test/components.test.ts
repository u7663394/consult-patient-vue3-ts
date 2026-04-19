import { test, expect } from 'vitest'
import { render } from '@testing-library/vue'
import CpRadioBtn from '../CpRadioBtn.vue'

/**
 * 组件测试
 */
test('CpRadioBtn', async () => {
  // 1. 通过 render 挂载渲染组件; 第二个参数是组件的 props
  const wrapper = render(CpRadioBtn, {
    props: {
      options: [
        { label: '选项一', value: 1 },
        { label: '选项二', value: 2 },
      ],
      modelValue: 1,
    },
  })
  // 2. 测试组件是否正确渲染了选项
  wrapper.getByText('选项一')
  wrapper.getByText('选项二')
  // 3. 测试 props
  const hasActive = wrapper.queryByText('选项一')?.classList.contains('active')
  expect(hasActive).toBe(true)
  // 4. 测试自定义事件 (update:modelValue)
  wrapper.queryByText('选项二')?.click()
  const value = wrapper.emitted()['update:modelValue']![0]
  expect(value).toEqual([2])
  // 5. 测试 props 更新
  await wrapper.rerender({
    modelValue: 2,
  })
  const hasActive2 = wrapper.queryByText('选项二')?.classList.contains('active')
  expect(hasActive2).toBe(true)
})

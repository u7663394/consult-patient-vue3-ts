import Mock from 'mockjs'

const rules = [
  // 模拟系统消息列表接口
  {
    url: '/patient/message/sys/list',
    method: 'get',
    timeout: 1000, // 模拟响应延迟
    response: () => {
      const data = []
      for (let i = 0; i < 10; i++) {
        data.push(
          // 使用 Mock.mock 生成随机数据
          Mock.mock({
            id: '@id',
            avatar: '@image("100x100")',
            title: '@ctitle(3,10)',
            content: '@ctitle(10,40)',
            createTime: '@datetime()',
            status: '@integer(0,1)',
            type: '@integer(1,3)',
          }),
        )
      }
      // 返回模拟数据
      return {
        code: 10000,
        message: '模拟数据成功',
        data,
      }
    },
  },
]

export default rules

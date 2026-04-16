/**
 * 枚举: 一组可选的常量
 *
 * 语法:
 *   enum EnumName {
 *     Member1 = Value1,
 *     Member2 = Value2,
 *     ...
 *   }
 *
 * 注意: 成员的值默认从 0 开始递增, 也可以手动指定值
 */

// 1. 定义
enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
  Default, // 自动递增, 值为 4
}

// 2. 使用
const logDirection = (dir: Direction) => {
  console.log(dir)
}
logDirection(Direction.Up) // 输出: 0
logDirection(Direction.Left) // 输出: 2
logDirection(Direction.Default) // 输出: 4 (自动递增)

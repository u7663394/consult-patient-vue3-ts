import { ref } from 'vue'
import type { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 1. 用户信息
    const user = ref<User>()
    // 2. 设置用户信息
    const setUser = (newUser: User) => {
      user.value = newUser
    }
    // 3. 清除用户信息
    const delUser = () => {
      user.value = undefined
    }
    // 最后 return
    return { user, setUser, delUser }
  },
  {
    persist: true, // 开启持久化
  },
)

<script setup lang="ts">
import { addPatient, editPatient, getPatientList } from '@/services/user'
import type { PatientList, Patient } from '@/types/user'
import { idCardRules, nameRules } from '@/utils/rules'
import { showConfirmDialog, showSuccessToast, type FormInstance } from 'vant'
import { computed, onMounted, ref } from 'vue'

/**
 * 渲染患者列表
 *   1. 准备空列表
 *   2. 发请求
 *   3. 赋值 + 渲染
 */
const list = ref<PatientList>([])
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
onMounted(() => {
  loadList()
})

/**
 * 复选框选项数据
 */
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 },
]

/**
 * 弹层显示控制
 *   1. 无item -> 打开时重置表单
 *   2. 有item -> 打开时回显 item 数据
 */
const show = ref(false)
const showPopup = (item?: Patient) => {
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    patient.value = { ...initPatient }
  }
  show.value = true
}

/**
 * 表单数据绑定
 */
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0,
}
const patient = ref<Patient>({ ...initPatient })

/**
 * 复选框属性需要转化为 boolean:
 *   1. 计算属性 get: 转化为 boolean
 *   2. 计算属性 set: 转化为数字
 */
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(bool) {
    if (bool) {
      patient.value.defaultFlag = 1
    } else {
      patient.value.defaultFlag = 0
    }
  },
})

/**
 * 提交:
 *   1. 校验表单
 *   2. 调用接口提交
 *   3. 关闭弹层 + 刷新列表
 */
const form = ref<FormInstance>()
const onSubmit = async () => {
  await form.value?.validate()
  // 身份证倒数第二位, 单数是男, 双数是女
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和身份证号中的不一致\n您确认提交吗?',
    })
  }
  // 调用接口提交
  patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value)
  // 关闭弹层 + 刷新列表
  show.value = false
  loadList()
  showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item">
        <div class="info">
          <span class="name">齐夏天</span>
          <span class="id">321111********6164</span>
          <span>男</span>
          <span>23岁</span>
        </div>
        <div class="tag">默认</div>
      </div>
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">
            {{ item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2') }}
          </span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div @click="showPopup(item)" class="icon"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div @click="showPopup(undefined)" class="patient-add" v-if="list.length < 6">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
      <!-- 
      弹层: 
        1. v-model:show 控制显示隐藏
        2. position="right" 从右侧弹出
      -->
      <van-popup v-model:show="show" position="right">
        <cp-nav-bar
          :title="patient.id ? '编辑患者' : '添加患者'"
          @click-right="onSubmit"
          right-text="保存"
          :back="() => (show = false)"
        >
        </cp-nav-bar>
        <van-form autocomplete="off" ref="form" style="padding-top: 46px">
          <van-field
            v-model="patient.name"
            label="真实姓名"
            :rules="nameRules"
            placeholder="请输入真实姓名"
          />
          <van-field
            v-model="patient.idCard"
            label="身份证号"
            :rules="idCardRules"
            placeholder="请输入身份证号"
          />
          <van-field label="性别" class="pb4">
            <!-- 单选按钮组件 -->
            <template #input>
              <!-- 
               v-model="gender" 相当于 
               :modelValue="gender" 加
               @update:modelValue="gender = $event" 
              -->
              <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <van-checkbox v-model="defaultFlag" :icon-size="18" round />
            </template>
          </van-field>
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 85%;
      height: 100%;
    }
  }
}
</style>

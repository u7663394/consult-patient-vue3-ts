<script setup lang="ts">
import { PositionalTitles, PriceRange } from '@/enums'
import { getAllBasicArea } from '@/services/consult'
import { gradeOptions, positionalTitlesOptions, priceRangeOptions } from '@/services/constant'
import type { Area, City, DoctorOrderType } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DoctorList from './components/DoctorList.vue'

type FindDoctorForm = {
  grade?: string
  positionalTitles?: PositionalTitles
  priceRange?: PriceRange
}

const route = useRoute()
const department = route.query.department as string
const depId = route.params.depId as string

const menuRef = ref<{ close: () => void } | null>(null)
const areaItemRef = ref<{ toggle: () => void } | null>(null)
const filterItemRef = ref<{ toggle: () => void } | null>(null)

const order = ref<DoctorOrderType>('default_ascend')
const orderOptions = [
  { text: '综合排序', value: 'default_ascend' },
  { text: '评分排序', value: 'score_ascend' },
  { text: '接诊量排序', value: 'consultationNum_ascend' },
  { text: '价格排序', value: 'serviceFee_ascend' },
]

const active = ref(0)
const areas = ref<Area[]>([])
const provinceId = ref('100000')

const citys = computed(() => {
  const parent = areas.value[active.value]
  const result = parent?.citys || []
  const allCity: City = {
    id: parent?.id || '100000',
    parentId: parent?.parentId || '',
    name: '全部',
  }
  return [allCity, ...result]
})

const selectCity = (id: string) => {
  provinceId.value = id
  areaItemRef.value?.toggle()
}

const initForm: FindDoctorForm = {
  grade: undefined,
  positionalTitles: undefined,
  priceRange: undefined,
}

const form = ref<FindDoctorForm>({ ...initForm })
const grade = ref<string>()
const positionalTitles = ref<PositionalTitles>()
const priceRange = ref<PriceRange>()

const onReset = () => {
  form.value = { ...initForm }
}

const onConfirm = () => {
  grade.value = form.value.grade
  positionalTitles.value = form.value.positionalTitles
  priceRange.value = form.value.priceRange
  filterItemRef.value?.toggle()
}

onMounted(async () => {
  const { data } = await getAllBasicArea()
  areas.value = [{ id: '100000', parentId: '', name: '全部' }, ...data]
})
</script>

<template>
  <div class="doctor-list-page">
    <cp-nav-bar :title="department" />
    <div class="search"><cp-icon name="home-search" /> 搜一搜：医生/疾病名称</div>
    <van-dropdown-menu ref="menuRef">
      <van-dropdown-item v-model="order" :options="orderOptions" />
      <van-dropdown-item ref="areaItemRef" title="区域">
        <div class="wrapper">
          <van-sidebar v-model="active">
            <van-sidebar-item v-for="item in areas" :key="item.id" :title="item.name" />
          </van-sidebar>
          <div class="sub">
            <span v-for="city in citys" :key="city.id" @click="selectCity(city.id)">
              <span>{{ city.name }}</span>
              <van-icon v-if="city.id === provinceId" name="success" />
            </span>
          </div>
        </div>
      </van-dropdown-item>
      <van-dropdown-item ref="filterItemRef" title="筛选">
        <div class="find-doctor-form">
          <div class="item">
            <p>医院等级</p>
            <cp-radio-btn v-model="form.grade" :options="gradeOptions" />
          </div>
          <div class="item">
            <p>医生职称</p>
            <cp-radio-btn v-model="form.positionalTitles" :options="positionalTitlesOptions" />
          </div>
          <div class="item">
            <p>价格区间</p>
            <cp-radio-btn v-model="form.priceRange" :options="priceRangeOptions" />
          </div>
          <van-button round class="reset-btn" @click="onReset">重置</van-button>
          <van-button round type="primary" class="confirm-btn" @click="onConfirm">确认</van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>

    <doctor-list
      :dep-id="depId"
      :order="order"
      :province-id="provinceId"
      :grade="grade"
      :positional-titles="positionalTitles"
      :price-range="priceRange"
    />
  </div>
</template>

<style scoped lang="scss">
.doctor-list-page {
  padding-top: 46px;
  .search {
    box-sizing: border-box;
    margin: 10px 15px 0;
    height: 40px;
    border-radius: 20px;
    box-shadow: 0 15px 22px -7px rgba(224, 236, 250, 0.8);
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: var(--cp-dark);
    font-size: 13px;
    .cp-icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }
  .van-dropdown-menu {
    position: sticky;
    top: 46px;
    z-index: 10;
    background-color: #fff;
  }
}

.wrapper {
  height: 400px;
  overflow: hidden;
  display: flex;
  .sub {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > span {
      display: flex;
      justify-content: space-between;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}

.find-doctor-form {
  padding-left: 15px;
  padding-bottom: 15px;
  .item {
    padding: 15px 0;
    p {
      font-size: 14px;
      color: #848484;
      margin-bottom: 10px;
    }
  }
  .reset-btn {
    width: 125px;
    margin-right: 15px;
  }
  .confirm-btn {
    width: 205px;
  }
}
</style>
